/**
 * Skills Marketplace - Local Registry
 * 
 * Manages local skills registry and indexing
 */

const fs = require('fs').promises;
const path = require('path');

class SkillsRegistry {
  constructor(registryPath = './data/registry.json') {
    this.registryPath = registryPath;
    this.registry = null;
  }

  async initialize() {
    try {
      // Ensure data directory exists
      await fs.mkdir(path.dirname(this.registryPath), { recursive: true });
      
      // Load existing registry or create new one
      try {
        const data = await fs.readFile(this.registryPath, 'utf8');
        this.registry = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // Registry file doesn't exist, create empty one
          this.registry = {
            skills: {},
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
          };
          await this.save();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Failed to initialize registry:', error);
      throw error;
    }
  }

  async save() {
    try {
      this.registry.lastUpdated = new Date().toISOString();
      await fs.writeFile(this.registryPath, JSON.stringify(this.registry, null, 2));
    } catch (error) {
      console.error('Failed to save registry:', error);
      throw error;
    }
  }

  addSkill(skillMetadata) {
    if (!skillMetadata.id) {
      throw new Error('Skill metadata must have an id');
    }
    this.registry.skills[skillMetadata.id] = skillMetadata;
  }

  getSkill(skillId) {
    return this.registry.skills[skillId] || null;
  }

  getAllSkills() {
    return Object.values(this.registry.skills);
  }

  search(query, limit = 20) {
    const queryLower = query.toLowerCase();
    const results = this.getAllSkills().filter(skill => 
      skill.name.toLowerCase().includes(queryLower) ||
      skill.title.toLowerCase().includes(queryLower) ||
      skill.description.toLowerCase().includes(queryLower) ||
      (skill.tags && skill.tags.some(tag => tag.toLowerCase().includes(queryLower))) ||
      (skill.categories && skill.categories.some(cat => cat.toLowerCase().includes(queryLower)))
    );
    return results.slice(0, limit);
  }

  cacheSearchResults(query, results) {
    // Store search results in registry for caching
    const cacheKey = `search:${query}`;
    this.registry.skills[cacheKey] = {
      id: cacheKey,
      name: `search-cache-${query}`,
      title: `Search Cache: ${query}`,
      description: 'Cached search results',
      source: 'local',
      version: '1.0.0',
      categories: ['cache'],
      tags: ['search', 'cache'],
      installCommand: '',
      dependencies: [],
      compatibility: [],
      securityAuditPassed: true,
      auditResults: {},
      rating: 0,
      downloadCount: 0,
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.save();
  }

  listInstalledSkills() {
    return this.getAllSkills().filter(skill => !skill.id.startsWith('search:'));
  }

  removeSkill(skillId) {
    if (this.registry.skills[skillId]) {
      delete this.registry.skills[skillId];
      return true;
    }
    return false;
  }

  updateSkill(skillId, updates) {
    if (this.registry.skills[skillId]) {
      this.registry.skills[skillId] = { ...this.registry.skills[skillId], ...updates };
      return true;
    }
    return false;
  }

  async syncWithLocalSkills() {
    // TODO: Scan local skills directory and update registry
    // This will be implemented in Phase 2
    console.log('Syncing with local skills...');
  }
}

module.exports = SkillsRegistry;