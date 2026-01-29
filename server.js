const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route for debugging
app.get('/debug', (req, res) => {
    res.json({
        message: 'Debug endpoint',
        currentDir: __dirname,
        publicDir: path.join(__dirname, 'public'),
        filesInPublic: require('fs').readdirSync(path.join(__dirname, 'public'))
    });
});

// ✅ Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ==========================================
    🚀 Server started successfully!
    ==========================================
    Local:  http://localhost:${PORT}
    
    Test URLs:
    - Main site: http://localhost:${PORT}
    - Check CSS: http://localhost:${PORT}/view-css
    - Debug info: http://localhost:${PORT}/debug
    
    ==========================================
    `);
});
