const express = require('express');
const Chemical = require('chemicaljs');
const cheerio = require('cheerio');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression()); // Compress all responses

// Serve static files if you have any (e.g., for the frontend)
app.use(express.static('public'));

// Proxy route
app.use('/proxy', async (req, res) => {
    try {
        const chemical = new Chemical(req.query.url, {
            headers: req.headers,
            method: req.method,
        });

        const response = await chemical.run();

        if (response.headers['content-type'].includes('text/html')) {
            const body = await response.text();
            const $ = cheerio.load(body);

            $('a, link, script, img').each((i, el) => {
                const $el = $(el);
                const attr = $el.is('a, link') ? 'href' : 'src';
                const url = $el.attr(attr);

                if (url && !url.startsWith('http')) {
                    $el.attr(attr, `/proxy?url=${new URL(url, req.query.url)}`);
                }
            });

            res.send($.html());
        } else {
            response.pipe(res);
        }
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy site running on http://localhost:${PORT}`);
});
