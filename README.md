# Skills Marketplace

A comprehensive skills ecosystem for AI agents, providing discovery, management, creation, and marketplace capabilities.

## Vision

Create a complete skills platform that:
- Discovers skills from multiple sources (clawhub, GitHub, npm, etc.)
- Provides detailed skill information and usage guides
- Manages skill installation, updates, and dependencies
- Enables skill creation with templates and validation
- Supports monetization and commercial distribution

## Integrated Skills

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
├── src/                    # Core application code
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
├── config/                # Configuration files
├── data/                  # Data storage and cache
├── docs/                  # Documentation
├── examples/              # Usage examples
├── tests/                 # Test suite
├── main.js               # Main application entry point
├── ROADMAP.md            # Development roadmap
├── DEVELOPMENT_PLAN.md   # Detailed development plan
└── DAILY_PROGRESS.md     # Daily progress tracking
```

## Getting Started

### CLI Mode
1. Clone this repository
2. Install dependencies: `npm install`
3. Run the application: `node main.js --help`

### Web Interface
1. Navigate to the web directory: `cd web`
2. Install web dependencies: `npm install`
3. Start the web server: `node server.js`
4. Access the interface at `http://localhost:8000`

See [WEB_ACCESS.md](WEB_ACCESS.md) for detailed access instructions.

## CLI Commands

- `search <query>` - Search for skills across multiple sources
- `install <skillId>` - Install a specific skill
- `list` - List installed skills
- `update-progress` - Update daily progress report

## Development

Follow the [Development Plan](DEVELOPMENT_PLAN.md) for contributing to this project.

## License

MIT License