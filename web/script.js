// Skills Marketplace Web Interface
class SkillsMarketplace {
    constructor() {
        this.skills = [];
        this.currentSearch = '';
        this.init();
    }

    init() {
        // Load skills data
        this.loadSkillsData();
        
        // Set up event listeners
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        document.getElementById('searchButton').addEventListener('click', () => {
            this.handleSearch(document.getElementById('searchInput').value);
        });
        
        // Handle form submission
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch(document.getElementById('searchInput').value);
        });
    }

    async loadSkillsData() {
        try {
            // In a real implementation, this would fetch from the backend
            // For now, we'll use mock data based on the integrated skills
            this.skills = [
                {
                    id: 'agent-browser',
                    name: 'Agent Browser',
                    description: 'A fast Rust-based headless browser automation CLI with Node.js fallback that enables AI agents to navigate, click, type, and snapshot pages via structured commands.',
                    source: 'local',
                    categories: ['browser', 'automation', 'web'],
                    installCommand: 'Available in local installation',
                    rating: 4.8,
                    downloadCount: 1250
                },
                {
                    id: 'daily-digest',
                    description: 'Daily summary and productivity features',
                    source: 'local',
                    categories: ['productivity', 'daily', 'summary'],
                    installCommand: 'Available in local installation',
                    rating: 4.5,
                    downloadCount: 890
                },
                {
                    id: 'find-skills',
                    name: 'Find Skills',
                    description: 'Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities.',
                    source: 'local',
                    categories: ['discovery', 'search', 'skills'],
                    installCommand: 'Available in local installation',
                    rating: 4.9,
                    downloadCount: 2100
                },
                {
                    id: 'personal-assistant',
                    name: 'Personal Assistant',
                    description: 'Personal daily briefing and productivity assistant. Generates morning briefings with priorities, habits, and self-care reminders.',
                    source: 'local',
                    categories: ['assistant', 'productivity', 'daily'],
                    installCommand: 'Available in local installation',
                    rating: 4.7,
                    downloadCount: 1560
                },
                {
                    id: 'self-improving',
                    name: 'Self Improving',
                    description: 'Self-improvement and learning capabilities for AI agents',
                    source: 'local',
                    categories: ['learning', 'improvement', 'ai'],
                    installCommand: 'Available in local installation',
                    rating: 4.3,
                    downloadCount: 780
                },
                {
                    id: 'self-improving-agent',
                    name: 'Self Improving Agent',
                    description: 'Advanced self-improvement agent features with hooks and automation',
                    source: 'local',
                    categories: ['learning', 'improvement', 'automation'],
                    installCommand: 'Available in local installation',
                    rating: 4.4,
                    downloadCount: 650
                },
                {
                    id: 'skill-vetter',
                    name: 'Skill Vetter',
                    description: 'Security auditing and skill validation for safe skill installation',
                    source: 'local',
                    categories: ['security', 'audit', 'validation'],
                    installCommand: 'Available in local installation',
                    rating: 4.6,
                    downloadCount: 920
                },
                {
                    id: 'tavily-search',
                    name: 'Tavily Search',
                    description: 'AI-optimized web search via Tavily API. Returns concise, relevant results for AI agents.',
                    source: 'local',
                    categories: ['search', 'web', 'api'],
                    installCommand: 'Available in local installation',
                    rating: 4.8,
                    downloadCount: 1890
                }
            ];
            
            this.renderSkills(this.skills);
        } catch (error) {
            console.error('Failed to load skills data:', error);
            this.showError('Failed to load skills data. Please try again later.');
        }
    }

    handleSearch(query) {
        this.currentSearch = query.trim().toLowerCase();
        if (this.currentSearch === '') {
            this.renderSkills(this.skills);
        } else {
            const filteredSkills = this.skills.filter(skill => 
                skill.name.toLowerCase().includes(this.currentSearch) ||
                skill.description.toLowerCase().includes(this.currentSearch) ||
                (skill.categories && skill.categories.some(cat => cat.toLowerCase().includes(this.currentSearch)))
            );
            this.renderSkills(filteredSkills);
        }
    }

    renderSkills(skills) {
        const container = document.getElementById('skillsContainer');
        if (skills.length === 0) {
            container.innerHTML = '<div class="no-results">No skills found matching your search.</div>';
            return;
        }

        const skillsHTML = skills.map(skill => `
            <div class="skill-card">
                <div class="skill-header">
                    <h3>${skill.name || skill.id}</h3>
                    <div class="skill-meta">
                        <span class="source">${skill.source}</span>
                        <span class="rating">⭐ ${skill.rating}</span>
                        <span class="downloads">📥 ${skill.downloadCount}</span>
                    </div>
                </div>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-categories">
                    ${skill.categories ? skill.categories.map(cat => `<span class="category">${cat}</span>`).join('') : ''}
                </div>
                <div class="skill-actions">
                    <button class="install-btn" onclick="installSkill('${skill.id}')">
                        Install
                    </button>
                    <button class="details-btn" onclick="showSkillDetails('${skill.id}')">
                        Details
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = skillsHTML;
    }

    showError(message) {
        const container = document.getElementById('skillsContainer');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Global functions for button clicks
function installSkill(skillId) {
    alert(`Installing skill: ${skillId}\nIn a real implementation, this would call the backend API.`);
}

function showSkillDetails(skillId) {
    alert(`Showing details for skill: ${skillId}\nIn a real implementation, this would open a detailed view.`);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SkillsMarketplace();
});