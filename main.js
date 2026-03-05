#!/usr/bin/env node

/**
 * Skills Marketplace - Main Application
 * 
 * This is the main entry point for the Skills Marketplace project.
 * It provides CLI commands for discovering, managing, and installing skills.
 */

const MultiSourceSearch = require('./src/search');
const SkillsRegistry = require('./src/registry');
const fs = require('fs');
const path = require('path');

// Load configuration
let sourcesConfig;
try {
  const configPath = path.join(__dirname, 'config', 'sources.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  sourcesConfig = config.sources;
} catch (error) {
  console.warn('Could not load sources config, using defaults');
  sourcesConfig = {
    clawhub: { enabled: true, priority: 1 },
    github: { enabled: true, priority: 2 },
    npm: { enabled: true, priority: 3 },
    skills_sh: { enabled: true, priority: 4 },
    local: { enabled: true, priority: 5 }
  };
}

class SkillsMarketplace {
  constructor() {
    this.searchEngine = new MultiSourceSearch(sourcesConfig);
    this.registry = new SkillsRegistry();
  }

  /**
   * Initialize the marketplace (async setup)
   */
  async initialize() {
    await this.registry.initialize();
  }

  /**
   * Search for skills across multiple sources
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of found skills
   */
  async search(query) {
    console.log(`🔍 Searching for: ${query}`);
    const results = await this.searchEngine.search(query);
    
    // Save results to registry for caching
    await this.registry.cacheSearchResults(query, results);
    
    return results;
  }

  /**
   * Get detailed information about a specific skill
   * @param {string} skillId - Skill identifier
   * @returns {Promise<Object>} - Skill details
   */
  async getSkillDetails(skillId) {
    console.log(`📋 Getting details for: ${skillId}`);
    const skill = await this.searchEngine.getSkillDetails(skillId);
    
    if (skill) {
      await this.registry.addSkill(skill);
    }
    
    return skill;
  }

  /**
   * Install a skill
   * @param {string} skillId - Skill identifier
   * @returns {Promise<boolean>} - Installation success
   */
  async installSkill(skillId) {
    console.log(`📥 Installing: ${skillId}`);
    const skill = await this.getSkillDetails(skillId);
    
    if (!skill) {
      console.error(`❌ Skill not found: ${skillId}`);
      return false;
    }

    // Execute installation command
    const { exec } = require('child_process');
    return new Promise((resolve) => {
      const child = exec(skill.installCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Installation failed: ${error.message}`);
          resolve(false);
          return;
        }
        
        if (stderr) {
          console.warn(`⚠️  Installation warnings: ${stderr}`);
        }
        
        console.log(`✅ Successfully installed: ${skillId}`);
        console.log(stdout);
        resolve(true);
      });
      
      // Add timeout for safety
      setTimeout(() => {
        if (!child.killed) {
          child.kill();
          console.error('❌ Installation timed out');
          resolve(false);
        }
      }, 60000); // 60 second timeout
    });
  }

  /**
   * List all installed skills
   * @returns {Array} - Installed skills
   */
  listInstalledSkills() {
    return this.registry.listInstalledSkills();
  }

  /**
   * Update progress report
   */
  updateProgressReport() {
    const progressPath = path.join(__dirname, 'DAILY_PROGRESS.md');
    const today = new Date().toISOString().split('T')[0];
    const progressContent = `# Skills Marketplace - Daily Progress Tracker

## ${today} (Development in progress)
- ✅ **Core Architecture**
  - Created JavaScript-based skill schema
  - Implemented multi-source search engine
  - Built local skills registry
  - Developed main application framework
- ✅ **GitHub CLI Integration**
  - Successfully installed gh tool
  - Enhanced GitHub search capabilities

## Next Steps
- Test multi-source search functionality
- Implement CLI interface
- Add security audit integration
- Create documentation

---
*This file will be updated daily with progress reports*
`;

    fs.writeFileSync(progressPath, progressContent);
    console.log('📊 Progress report updated');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node main.js <command> [options]');
    console.log('Commands:');
    console.log('  search <query>     - Search for skills');
    console.log('  install <skillId>  - Install a skill');
    console.log('  list               - List installed skills');
    console.log('  update-progress    - Update daily progress report');
    return;
  }

  const marketplace = new SkillsMarketplace();
  await marketplace.initialize();
  const command = args[0];

  switch (command) {
    case 'search':
      if (args.length < 2) {
        console.error('Please provide a search query');
        return;
      }
      const results = await marketplace.search(args.slice(1).join(' '));
      console.log(JSON.stringify(results, null, 2));
      break;
      
    case 'install':
      if (args.length < 2) {
        console.error('Please provide a skill ID');
        return;
      }
      await marketplace.installSkill(args[1]);
      break;
      
    case 'list':
      const installed = marketplace.listInstalledSkills();
      console.log(JSON.stringify(installed, null, 2));
      break;
      
    case 'update-progress':
      marketplace.updateProgressReport();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SkillsMarketplace;