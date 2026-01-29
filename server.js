const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.pdf')) {
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
            : 'Directory does not exist'
    });
});

// ✅ Direct PDF route as backup
app.get('/proposal', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'assets', 'documents', 'Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf');
    const fs = require('fs');
    
    if (fs.existsSync(pdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf"');
        res.sendFile(pdfPath);
    } else {
        res.status(404).send('PDF file not found');
    }
});

// ✅ Fallback route for SPA - only for non-static files
app.get('*', (req, res) => {
    // Don't serve index.html for static file requests
    if (req.path.startsWith('/assets/') || 
        req.path.endsWith('.css') || 
        req.path.endsWith('.js') || 
        req.path.endsWith('.pdf') ||
        req.path.endsWith('.png') ||
        req.path.endsWith('.jpg') ||
        req.path.endsWith('.svg')) {
        return res.status(404).send('Static file not found: ' + req.path);
    }
    
    // For all other routes, serve the main HTML file
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
