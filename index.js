import express from "express";
import { ChemicalServer } from "chemicaljs";
import cheerio from "cheerio";

const app = express();
const port = process.env.PORT || 3000;

// Initialize ChemicalServer
const chemical = new ChemicalServer({
    scramjet: false,
    rammerhead: false,
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await chemical.fetch(url, {
            headers: req.headers,
            method: req.method,
        });

        if (response.headers['content-type'] && response.headers['content-type'].includes('text/html')) {
            const body = await response.text();
            const $ = cheerio.load(body);

            $('a, link, script, img').each((i, el) => {
                const $el = $(el);
                const attr = $el.is('a, link') ? 'href' : 'src';
                const src = $el.attr(attr);

                if (src && !src.startsWith('http')) {
                    $el.attr(attr, `/proxy?url=${new URL(src, url).toString()}`);
                }
            });

            res.send($.html());
        } else {
            response.body.pipe(res);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Error fetching the URL');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
