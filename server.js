/**
 * server.js
 * Development server with asset scanning API
 * Run: node server.js
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = 8000;
const ROOT_DIR = __dirname;

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Scan directory recursively
async function scanDirectory(dir, relativeTo = dir) {
    const files = [];

    try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            const relativePath = path.relative(relativeTo, fullPath).replace(/\\/g, '/');

            if (item.isDirectory()) {
                // Recursively scan subdirectories
                const subFiles = await scanDirectory(fullPath, relativeTo);
                files.push(...subFiles);
            } else if (item.isFile()) {
                const ext = path.extname(item.name).toLowerCase();
                files.push({
                    name: item.name,
                    path: relativePath,
                    ext: ext,
                    type: getFileType(ext)
                });
            }
        }
    } catch (err) {
        console.error(`Error scanning ${dir}:`, err.message);
    }

    return files;
}

// Determine file type category
function getFileType(ext) {
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.bmp', '.webp'].includes(ext)) {
        return 'image';
    }
    if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
        return 'audio';
    }
    if (['.mp4', '.webm', '.ogv'].includes(ext)) {
        return 'video';
    }
    if (['.ttf', '.woff', '.woff2', '.otf', '.eot'].includes(ext)) {
        return 'font';
    }
    return 'other';
}

// API endpoint to scan assets folder
async function handleAssetScan(req, res) {
    const assetsPath = path.join(ROOT_DIR, 'assets');

    try {
        // Check if assets folder exists
        await fs.access(assetsPath);

        // Scan all files
        const allFiles = await scanDirectory(assetsPath, ROOT_DIR);

        // Categorize files
        const categorized = {
            images: allFiles.filter(f => f.type === 'image'),
            audio: allFiles.filter(f => f.type === 'audio'),
            video: allFiles.filter(f => f.type === 'video'),
            fonts: allFiles.filter(f => f.type === 'font'),
            other: allFiles.filter(f => f.type === 'other')
        };

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(categorized, null, 2));

        console.log(`[API] Scanned ${allFiles.length} assets`);
    } catch (err) {
        res.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            error: 'Failed to scan assets folder',
            message: err.message
        }));
        console.error('[API] Asset scan error:', err.message);
    }
}

// API endpoint to list projects
async function handleListProjects(req, res) {
    const projectsPath = path.join(ROOT_DIR, 'projects');

    try {
        await fs.access(projectsPath);
        const files = await fs.readdir(projectsPath);

        const projects = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(projectsPath, file);
                const stats = await fs.stat(filePath);
                const content = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(content);

                projects.push({
                    filename: file,
                    name: data.name || file.replace('.json', ''),
                    modified: stats.mtime,
                    size: stats.size,
                    eventCount: data.sequence ? data.sequence.length : 0
                });
            }
        }

        projects.sort((a, b) => b.modified - a.modified);

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(projects, null, 2));

        console.log(`[API] Listed ${projects.length} projects`);
    } catch (err) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify([]));
    }
}

// API endpoint to save project
async function handleSaveProject(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const projectData = JSON.parse(body);
            const filename = projectData.filename || `${slugify(projectData.name || 'untitled')}.json`;
            const projectPath = path.join(ROOT_DIR, 'projects', filename);

            // Add metadata
            projectData.modified = new Date().toISOString();
            if (!projectData.created) {
                projectData.created = projectData.modified;
            }

            await fs.writeFile(projectPath, JSON.stringify(projectData, null, 2));

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                success: true,
                filename: filename,
                path: `projects/${filename}`
            }));

            console.log(`[API] Project saved: ${filename}`);
        } catch (err) {
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                error: 'Failed to save project',
                message: err.message
            }));
            console.error('[API] Save error:', err.message);
        }
    });
}

// API endpoint to load project
async function handleLoadProject(req, res, filename) {
    const projectPath = path.join(ROOT_DIR, 'projects', filename);

    try {
        const content = await fs.readFile(projectPath, 'utf8');
        const projectData = JSON.parse(content);

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(projectData, null, 2));

        console.log(`[API] Project loaded: ${filename}`);
    } catch (err) {
        res.writeHead(404, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            error: 'Project not found',
            message: err.message
        }));
        console.error('[API] Load error:', err.message);
    }
}

// Helper function to slugify names
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// Serve static files
async function serveFile(filePath, res) {
    try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

// Main server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    console.log(`[${req.method}] ${pathname}`);

    // API endpoints
    if (pathname === '/api/scan-assets') {
        return handleAssetScan(req, res);
    }

    if (pathname === '/api/projects') {
        return handleListProjects(req, res);
    }

    if (pathname === '/api/save-project' && req.method === 'POST') {
        return handleSaveProject(req, res);
    }

    if (pathname.startsWith('/api/load-project/')) {
        const filename = pathname.replace('/api/load-project/', '');
        return handleLoadProject(req, res, filename);
    }

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // Serve index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Serve static files
    const filePath = path.join(ROOT_DIR, pathname);

    try {
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            return serveFile(filePath, res);
        }
    } catch (err) {
        // File doesn't exist
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('   🎮 DEADDAY Development Server v2.0');
    console.log('═══════════════════════════════════════════════════');
    console.log(`   Running at: http://127.0.0.1:${PORT}`);
    console.log('');
    console.log('   🎨 Builder:  http://127.0.0.1:${PORT}/builder.html`);
    console.log('   🎬 Game:     http://127.0.0.1:${PORT}/game.html`);
    console.log('');
    console.log('   📁 Features:');
    console.log('   ✅ Real asset folder scanning');
    console.log('   ✅ Project save/load system');
    console.log('   ✅ Auto-save (every 30s)');
    console.log('   ✅ Multiple project support');
    console.log('');
    console.log('   🔌 API Endpoints:');
    console.log('   - GET  /api/scan-assets');
    console.log('   - GET  /api/projects');
    console.log('   - POST /api/save-project');
    console.log('   - GET  /api/load-project/:name');
    console.log('');
    console.log('   Press Ctrl+C to stop');
    console.log('═══════════════════════════════════════════════════');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use!`);
        console.error('Stop the other server first (Ctrl+C in other terminal)');
        console.error('Or use: npx kill-port 8000\n');
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});
