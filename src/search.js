/**
 * Skills Marketplace - Multi-Source Search
 * 
 * Handles searching for skills across multiple sources:
 * - clawhub.com
 * - GitHub
 * - npm
 * - skills.sh
 * - Local registry
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Import skill schema and registry
const { SkillMetadata } = require('./skillSchema');
const SkillsRegistry = require('./registry');

class MultiSourceSearch {
  constructor(sourcesConfig) {
    this.registry = new SkillsRegistry();
    this.sources = sourcesConfig || this.loadSources();
  }

  loadSources() {
    try {
      const sourcesPath = path.join(__dirname, '..', 'config', 'sources.json');
      const sourcesData = fs.readFileSync(sourcesPath, 'utf8');
      return JSON.parse(sourcesData);
    } catch (error) {
      console.warn('Could not load sources config, using defaults');
      return {
        clawhub: { enabled: true, priority: 1 },
        github: { enabled: true, priority: 2 },
        npm: { enabled: true, priority: 3 },
        skills_sh: { enabled: true, priority: 4 },
        local: { enabled: true, priority: 5 }
      };
    }
  }

  async search(query, options = {}) {
    const { limit = 20, includePremium = false, sortBy = 'relevance' } = options;
    let allResults = [];

    // Initialize registry
    await this.registry.initialize();

    // Search local registry first (fastest)
    if (this.sources.local.enabled) {
      const localResults = await this.searchLocal(query, limit);
      allResults = allResults.concat(localResults);
    }

    // Search external sources in parallel
    const externalPromises = [];

    if (this.sources.clawhub.enabled) {
      externalPromises.push(this.searchClawHub(query, limit));
    }

    if (this.sources.github.enabled) {
      externalPromises.push(this.searchGitHub(query, limit));
    }

    if (this.sources.npm.enabled) {
      externalPromises.push(this.searchNpm(query, limit));
    }

    if (this.sources.skills_sh.enabled) {
      externalPromises.push(this.searchSkillsSh(query, limit));
    }

    try {
      const externalResults = await Promise.allSettled(externalPromises);
      externalResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allResults = allResults.concat(result.value);
        }
      });
    } catch (error) {
      console.error('Error searching external sources:', error);
    }

    // Filter premium skills if not requested
    if (!includePremium) {
      allResults = allResults.filter(skill => !skill.isPremium);
    }

    // Remove duplicates and sort
    const uniqueResults = this.removeDuplicates(allResults);
    const sortedResults = this.sortResults(uniqueResults, sortBy);

    return sortedResults.slice(0, limit);
  }

  async searchLocal(query, limit) {
    try {
      const results = this.registry.searchSkills(query);
      return results.slice(0, limit);
    } catch (error) {
      console.warn('Local search failed:', error.message);
      return [];
    }
  }

  async searchClawHub(query, limit) {
    try {
      // Use clawhub CLI to search (without --json flag since it's not supported)
      const { stdout } = await execPromise(`npx clawhub search "${query}" --limit ${limit}`);
      
      // Parse the text output
      const lines = stdout.split('\n').filter(line => line.trim() !== '');
      const results = [];
      
      for (let i = 0; i < lines.length && results.length < limit; i++) {
        const line = lines[i].trim();
        if (line.startsWith('- ') || line.includes('  └ ')) {
          // Extract skill name from the output
          const match = line.match(/- (.+?)\s+/);
          if (match) {
            const skillName = match[1];
            results.push(new SkillMetadata({
              name: skillName,
              id: `clawhub/${skillName}`,
              version: 'latest',
              source: 'clawhub',
              title: skillName,
              description: '',
              categories: [],
              tags: [],
              repositoryUrl: '',
              homepageUrl: '',
              documentationUrl: '',
              license: '',
              installCommand: `npx clawhub install ${skillName}`,
              dependencies: [],
              compatibility: [],
              securityAuditPassed: false,
              auditResults: {},
              rating: 0,
              downloadCount: 0,
              isPremium: false,
              price: null,
              currency: 'USD',
              author: '',
              createdAt: '',
              updatedAt: ''
            }));
          }
        }
      }
      
      return results;
    } catch (error) {
      console.warn('ClawHub search failed:', error.message);
      return [];
    }
  }

  async searchGitHub(query, limit) {
    try {
      // Use GitHub API or git clone to search
      // For now, we'll use a simple approach with existing tools
      const { stdout } = await execPromise(`curl -s "https://api.github.com/search/repositories?q=${encodeURIComponent(query + ' skill')}+in:name,description&per_page=${limit}"`);
      const results = JSON.parse(stdout);
      
      if (!results.items) {
        return [];
      }

      return results.items.map(item => new SkillMetadata({
        name: item.name.replace(/-skill$/, ''),
        id: `github/${item.full_name}`,
        version: 'latest',
        source: 'github',
        title: item.name,
        description: item.description || '',
        categories: [],
        tags: [],
        repositoryUrl: item.html_url,
        homepageUrl: item.homepage || '',
        documentationUrl: `${item.html_url}/blob/main/README.md`,
        license: item.license ? item.license.spdx_id : '',
        installCommand: `git clone ${item.clone_url}`,
        dependencies: [],
        compatibility: [],
        securityAuditPassed: false,
        auditResults: {},
        rating: 0,
        downloadCount: item.stargazers_count || 0,
        isPremium: false,
        price: null,
        currency: 'USD',
        author: item.owner.login,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.warn('GitHub search failed:', error.message);
      return [];
    }
  }

  async searchNpm(query, limit) {
    try {
      const { stdout } = await execPromise(`npm search "${query} skill" --json --limit ${limit}`);
      const results = JSON.parse(stdout);
      
      return results.map(item => new SkillMetadata({
        name: item.name.replace(/-skill$/, ''),
        id: `npm/${item.name}`,
        version: item.version || 'latest',
        source: 'npm',
        title: item.name,
        description: item.description || '',
        categories: item.keywords ? item.keywords.filter(k => k !== 'skill') : [],
        tags: item.keywords || [],
        repositoryUrl: item.repository || '',
        homepageUrl: item.homepage || '',
        documentationUrl: item.homepage || '',
        license: item.license || '',
        installCommand: `npm install ${item.name}`,
        dependencies: Object.keys(item.dependencies || {}),
        compatibility: [],
        securityAuditPassed: false,
        auditResults: {},
        rating: 0,
        downloadCount: item.downloads || 0,
        isPremium: false,
        price: null,
        currency: 'USD',
        author: item.author || '',
        createdAt: '',
        updatedAt: ''
      }));
    } catch (error) {
      console.warn('npm search failed:', error.message);
      return [];
    }
  }

  async searchSkillsSh(query, limit) {
    // skills.sh doesn't have a public API, so we'll skip for now
    // In the future, we could scrape or use their CLI if available
    return [];
  }

  removeDuplicates(skills) {
    const seen = new Set();
    return skills.filter(skill => {
      const key = `${skill.source}/${skill.id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  sortResults(skills, sortBy) {
    switch (sortBy) {
      case 'rating':
        return skills.sort((a, b) => b.rating - a.rating);
      case 'downloads':
        return skills.sort((a, b) => b.downloadCount - a.downloadCount);
      case 'newest':
        return skills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'relevance':
      default:
        // Simple relevance sorting - prioritize local and clawhub
        return skills.sort((a, b) => {
          const sourcePriority = { local: 0, clawhub: 1, github: 2, npm: 3, skills_sh: 4 };
          return sourcePriority[a.source] - sourcePriority[b.source];
        });
    }
  }

  async getSkillDetails(skillId) {
    // Get detailed information about a specific skill
    const localSkill = await this.registry.getSkill(skillId);
    if (localSkill) {
      return localSkill;
    }
    
    // For external skills, we'd need to fetch details from the source
    // This is a placeholder implementation
    return null;
  }
}

module.exports = MultiSourceSearch;