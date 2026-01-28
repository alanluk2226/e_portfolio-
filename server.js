const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route for debugging - check if CSS is being served
app.get('/debug', (req, res) => {
    res.json({
        message: 'Debug endpoint',
        cssPath: path.join(__dirname, 'public', 'style.css'),
        cssExists: require('fs').existsSync(path.join(__dirname, 'public', 'style.css')),
        currentDir: __dirname,
        filesInPublic: require('fs').readdirSync(path.join(__dirname, 'public'))
    });
});

// ✅ Route to directly view CSS
app.get('/view-css', (req, res) => {
    const cssPath = path.join(__dirname, 'public', 'style.css');
    if (require('fs').existsSync(cssPath)) {
        res.type('css').sendFile(cssPath);
    } else {
        res.status(404).send('CSS file not found at: ' + cssPath);
    }
});

// ✅ Test PDF endpoint
app.get('/test-pdf', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'assets', 'documents', 'Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf');
    res.json({
        pdfPath: pdfPath,
        pdfExists: require('fs').existsSync(pdfPath),
        documentsDir: path.join(__dirname, 'public', 'assets', 'documents'),
        filesInDocuments: require('fs').existsSync(path.join(__dirname, 'public', 'assets', 'documents')) 
            ? require('fs').readdirSync(path.join(__dirname, 'public', 'assets', 'documents'))
            : 'Directory does not exist'
    });
});

// ✅ SPA fallback - only for HTML routes (not static files)
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
