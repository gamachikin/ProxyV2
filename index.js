const express = require('express');
const Chemical = require('chemicaljs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy route
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        console.log(`Proxying request to URL: ${targetUrl}`);

        const chemical = new Chemical(targetUrl, {
            headers: req.headers,
            method: req.method,
        });

        const response = await chemical.run();
        const contentType = response.headers['content-type'];
        
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        response.body.pipe(res);
    } catch (error) {
        console.error(`Error fetching the URL: ${error.message}`);
        res.status(500).send('Error fetching the URL');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
