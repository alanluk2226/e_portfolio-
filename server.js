const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Direct PDF route - this should work
app.get('/proposal', (req, res) => {
    const pdfPath = path.join(__dirname, 'public', 'assets', 'documents', 'Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf');
    const fs = require('fs');
    
    console.log('PDF request received');
    console.log('PDF path:', pdfPath);
    console.log('PDF exists:', fs.existsSync(pdfPath));
    
    if (fs.existsSync(pdfPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Luk_Ho_Lung_NVIDIA_Project_Proposal.pdf"');
        res.sendFile(pdfPath);
    } else {
        res.status(404).send('PDF file not found at: ' + pdfPath);
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
            : 'Directory does not exist'
    });
});

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
