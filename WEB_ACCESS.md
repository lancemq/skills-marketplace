# Skills Marketplace Web Access

## Web Server Information
- **Port**: 8000
- **URL**: http://localhost:8000
- **Status**: Running

## How to Access

### Option 1: Local Access (if running locally)
- Open your browser and navigate to: `http://localhost:8000`

### Option 2: Remote Server Access
Since you're running this on a remote server, you have several options:

#### A. SSH Port Forwarding (Recommended)
```bash
# Run this command on your local machine
ssh -L 8000:localhost:8000 your-server-ip

# Then open in your local browser: http://localhost:8000
```

#### B. Configure Firewall (if you want direct access)
```bash
# Open port 8000 in firewall
sudo firewall-cmd --add-port=8000/tcp --permanent
sudo firewall-cmd --reload

# Then access via: http://your-server-ip:8000
```

#### C. Use Existing Web Server
If you have Nginx/Apache running, configure a reverse proxy:
```nginx
# Nginx example
location / {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Web Interface Features
- 🏠 **Project Overview** - Shows all integrated skills
- 🔍 **Skill Search** - Multi-source search functionality  
- 📋 **Skill Details** - Detailed information for each skill
- ⬇️ **Installation Guide** - Commands to install skills
- 📊 **Development Progress** - Current project status

## Troubleshooting
- If the web server stops, restart it with: `node web/server.js`
- Check if port 8000 is available: `netstat -tlnp | grep 8000`
- View server logs in the terminal where it's running

## Alternative: Command Line Interface
If you cannot access the web interface, you can still use the CLI:
```bash
cd projects/skills-marketplace
node main.js search "query"
node main.js list
```