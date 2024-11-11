const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const { deepFry, sovietize } = require('./effects.js');

app.get('/*', async (req, res) => {
    try {
        // Get the GIF's URL
        const url = req.params[0];

        // Browser is just searching for the icon, we don't care
        if (url === 'favicon.ico') return;

        // Get the search term
        const searchTerm = (url.split('/'))[1];
        const mode = (url.split('/'))[0];
        if (searchTerm === undefined) {
            res.sendFile(path.join(__dirname, 'error.gif'));
            return;
        }

        const toSearch = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${process.env.TENOR_API_KEY}&client_key=sovietcord&limit=1`;
        console.log('Search term:', searchTerm, '\nURL:', toSearch);

        // Fetch the GIF
        const response = await fetch(toSearch, {
            headers: {
                'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
            }
        });

        const data = await response.json();

        if (!(data.results && data.results.length > 0)) {
            res.status(404).send('No GIFs found for the search term');
            return;
        }

        const gifURL = data.results[0].media_formats.gif.url;
        console.log('GIF URL:', gifURL);

        // Do stuff to the gif
        if(mode === 'viditw' || mode === 'attachmditnts') {
            await deepFry(gifURL);
        } else {
            await sovietize(gifURL);
        }

        // Send the output
        res.sendFile(path.join(__dirname, 'output.gif'), (err) => {
            if (err) {
                console.error('Error sending the file:', err);
                res.status(500).send('Error sending the processed GIF');
            }

            // Clean up after sending the response
            fs.unlinkSync(path.join(__dirname, 'output.gif'));
        });

    } catch (error) {
        // Error :(
        console.error('Error in processing:', error);
        res.status(500).send('Something went wrong while processing the request');
    }
});

app.listen('80', () => {
    console.log('Listening, port 80');
});
