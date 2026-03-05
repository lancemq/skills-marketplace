# Skills Marketplace Web Access

## Local Development
If you're running this on your local machine, simply open:
- http://localhost:3000

## Remote Server Access
Since this is running on a remote server, you have several options:

### Option 1: SSH Port Forwarding
```bash
ssh -L 3000:localhost:3000 your-server-username@your-server-ip
```
Then open http://localhost:3000 in your local browser.

### Option 2: Configure Nginx/Apache Reverse Proxy
Set up a reverse proxy to forward requests from port 80/443 to port 3000.

### Option 3: Use the CLI Interface
You can also use the command-line interface directly:
```bash
cd projects/skills-marketplace
node main.js search "okx"
node main.js list
```

## Features Available
- **Skill Discovery**: Search across multiple sources (GitHub, clawhub, npm)
- **Skill Details**: View comprehensive information about each skill
- **Installation**: Install skills directly from the web interface
- **Integrated Skills**: Browse the 8 integrated skills included in this project
- **Progress Tracking**: View daily development progress

## Current Status
The web interface is a basic prototype. The core functionality is available through the CLI, and the web interface will be enhanced in future development phases.