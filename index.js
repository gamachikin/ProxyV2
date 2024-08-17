const express = require('express');
const Chemical = require('chemicaljs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression()); // Compress all responses

// Serve static files if you have a frontend
app.use(express.static('public'));

// Proxy route
app.use('/proxy', async (req, res) => {
    try {
        const chemical = new Chemical(req.query.url, {
            headers: req.headers,
            method: req.method,
        });

        const response = await chemical.run();
        response.pipe(res);
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy site running on http://localhost:${PORT}`);
});
