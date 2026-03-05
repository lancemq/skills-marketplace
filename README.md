# Skills Marketplace

A comprehensive skills ecosystem for AI agents, providing discovery, management, creation, and marketplace capabilities.

## Vision

Create a complete skills platform that:
- Discovers skills from multiple sources (clawhub, GitHub, npm, etc.)
- Provides detailed skill information and usage guides
- Manages skill installation, updates, and dependencies
- Enables skill creation with templates and validation
- Supports monetization and commercial distribution

## Integrated Features

### Web Interface (Full-Featured)
- **Homepage**: Browse all skills with weekly highlights (New Skills, Updated Skills)
- **Skill Detail Pages**: Comprehensive capability descriptions, installation guides, usage examples
- **Search & Discovery**: Multi-source skill discovery across GitHub, clawhub, and other repositories
- **Source Management**: Track and manage skill sources with automatic discovery
- **Vercel Integration**: Cron jobs for daily health checks and periodic source discovery
- **Blob Storage**: Persistent data storage with fallback to local files

### CLI Tools (Command-Line Interface)
- **Multi-source Search**: Search skills across GitHub, clawhub, npm, and local registry
- **Security Auditing**: Built-in security vetting with red flag detection
- **Skill Management**: Install, update, and manage skills with dependency resolution
- **Local Registry**: Cache and manage locally installed skills

### Integrated Skills Collection
This repository contains the following integrated skills:

- **agent-browser**: Browser automation capabilities
- **daily-digest**: Daily summary and productivity features  
- **find-skills**: Skill discovery and search functionality
- **personal-assistant**: Personal productivity and daily briefing
- **self-improving**: Self-improvement and learning capabilities
- **self-improving-agent**: Advanced self-improvement agent features
- **skill-vetter**: Security auditing and skill validation
- **tavily-search**: AI-optimized web search via Tavily API

## Architecture

```
skills-marketplace/
├── src/                    # Core application code (CLI)
│   ├── skillSchema.js     # Standardized skill metadata schema
│   ├── registry.js        # Local skills registry and caching
│   ├── search.js          # Multi-source search engine
│   └── ...                # Additional core modules
├── skills/                # Integrated skills collection
│   ├── agent-browser/
│   ├── daily-digest/
│   ├── find-skills/
│   ├── personal-assistant/
│   ├── self-improving/
│   ├── self-improving-agent/
│   ├── skill-vetter/
│   └── tavily-search/
├── web/                   # Full-featured web interface
│   ├── index.html         # Homepage with skill browsing
│   ├── skill-detail.html  # Detailed skill pages
│   ├── sources.html       # Source management
│   ├── app.js            # Main web application logic
│   ├── server.cjs        # Web server (port 8000)
│   ├── api/              # API routes for cron and data
│   └── ...               # CSS, JS, assets, and configuration
├── config/                # Configuration files
├── data/                  # Data storage and cache
├── docs/                  # Documentation
├── examples/              # Usage examples
├── tests/                 # Test suite
├── main.js               # Main CLI application entry point
├── ROADMAP.md            # Development roadmap
├── DEVELOPMENT_PLAN.md   # Detailed development plan
└── DAILY_PROGRESS.md     # Daily progress tracking
```

## Getting Started

### Web Interface
1. Navigate to the web directory: `cd web`
2. Install web dependencies: `npm install`
3. Start the web server: `node server.cjs`
4. Access the interface at `http://localhost:8000`

### CLI Mode
1. Clone this repository
2. Install dependencies: `npm install`
3. Run the application: `node main.js --help`

See [WEB_ACCESS.md](WEB_ACCESS.md) for detailed access instructions.

## CLI Commands

- `search <query>` - Search for skills across multiple sources
- `install <skillId>` - Install a specific skill
- `list` - List installed skills
- `update-progress` - Update daily progress report

## Web Features

- **Daily Health Checks**: Automatic validation of skill links and metadata
- **Source Discovery**: Periodic crawling of new skill sources
- **Skill Enrichment**: Automatic enhancement of missing skill details
- **Invalid Skill Handling**: Skills with broken links are hidden by default
- **Blob Storage Integration**: Persistent data storage with Vercel Blob

## Development

Follow the [Development Plan](DEVELOPMENT_PLAN.md) for contributing to this project.

## License

MIT License