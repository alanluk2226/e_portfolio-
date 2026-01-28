const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
        }
    }
}));

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
    const fs = require('fs');
    
    res.json({
        pdfPath: pdfPath,
        pdfExists: fs.existsSync(pdfPath),
        pdfSize: fs.existsSync(pdfPath) ? fs.statSync(pdfPath).size : 'N/A',
        documentsDir: path.join(__dirname, 'public', 'assets', 'documents'),
        filesInDocuments: fs.existsSync(path.join(__dirname, 'public', 'assets', 'documents')) 
            ? fs.readdirSync(path.join(__dirname, 'public', 'assets', 'documents'))
            : 'Directory does not exist',
        publicDir: path.join(__dirname, 'public'),
        assetsDir: path.join(__dirname, 'public', 'assets')
    });
});

// ✅ Direct PDF serving route as backup
app.get('/pdf/:filename', (req, res) => {
    const filename = req.params.filename;
    const pdfPath = path.join(__dirname, 'public', 'assets', 'documents', filename);
    const fs = require('fs');
    
    if (fs.existsSync(pdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(pdfPath);
    } else {
        res.status(404).json({
            error: 'PDF not found',
            requestedFile: filename,
            searchPath: pdfPath,
            exists: false
        });
    }
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
