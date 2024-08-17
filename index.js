const express = require('express');
const Chemical = require('chemicaljs');
const cheerio = require('cheerio');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression()); // Compress all responses

// Serve static files if you have any (e.g., for the frontend)
app.use(express.static('public'));

// Proxy route with debugging logs
app.use('/proxy', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        console.log(`Proxying URL: ${targetUrl}`);  // Debugging log for the target URL

        if (!targetUrl) {
            return res.status(400).send('Missing URL parameter');  // Handle missing URL parameter
        }

        const chemical = new Chemical(targetUrl, {
            headers: req.headers,
            method: req.method,
        });

        const response = await chemical.run();
        console.log(`Response Status: ${response.status}`);  // Debugging log for the response status

        if (response.headers['content-type'].includes('text/html')) {
            const body = await response.text();
            const $ = cheerio.load(body);

            $('a, link, script, img').each((i, el) => {
                const $el = $(el);
                const attr = $el.is('a, link') ? 'href' : 'src';
                const url = $el.attr(attr);

                if (url && !url.startsWith('http')) {
                    const rewrittenUrl = `/proxy?url=${encodeURIComponent(new URL(url, targetUrl).href)}`;
                    console.log(`Rewriting ${attr} to: ${rewrittenUrl}`);  // Debugging log for rewritten URLs
                    $el.attr(attr, rewrittenUrl);
                }
            });

            res.send($.html());
        } else {
            response.pipe(res);
        }
    } catch (error) {
        console.error(`Error proxying URL: ${req.query.url}`, error);  // Debugging log for errors
        res.status(500).send('Something went wrong!');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy site running on http://localhost:${PORT}`);
});
