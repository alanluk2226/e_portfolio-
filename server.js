const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory FIRST
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route for debugging - check if CSS is being served
app.get('/debug', (req, res) => {
    res.json({
        message: 'Debug endpoint',
        cssPath: path.join(__dirname, 'public', 'style.css'),
        cssExists: require('fs').existsSync(path.join(__dirname, 'public', 'style.css')),
        currentDir: __dirname,
        filesInPublic: require('fs').readdirSync(path.join(__dirname, 'public')),
        pdfExists: require('fs').existsSync(path.join(__dirname, 'public', 'assets', 'documents', 'Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf'))
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

// ✅ Route to test PDF directly
app.get('/test-pdf', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'assets', 'documents', 'Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf');
    if (require('fs').existsSync(pdfPath)) {
        res.type('pdf').sendFile(pdfPath);
    } else {
        res.status(404).send('PDF file not found at: ' + pdfPath);
    }
});

// ✅ Only redirect HTML routes to index.html, not static files
app.get('*', (req, res) => {
    // Don't redirect requests for static files (assets, documents, etc.)
    if (req.path.startsWith('/assets/') || 
        req.path.startsWith('/style.css') || 
        req.path.startsWith('/script.js') ||
        req.path.includes('.')) {
        // Let express.static handle these files
        return res.status(404).send('File not found');
    }
    
    // Only redirect HTML page requests to index.html
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
    - Test PDF: http://localhost:${PORT}/test-pdf
    - Direct PDF: http://localhost:${PORT}/assets/documents/Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf
    
    ==========================================
    `);
});
