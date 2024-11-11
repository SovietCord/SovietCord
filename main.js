const express = require('express');
const app = express();
require('dotenv').config();
const { deepFry, sovietize, hub } = require('./effects.js');
const path = require('path');
const fs = require('fs');

app.get('*', async (req, res) => {
    try {
        // Get the GIF's URL
        const url = req.params[0];

        // Browser is just searching for the icon, we don't care
        if (url === '/favicon.ico') return;

        // Get the search term
        const searchTerm = (url.split('/'))[2];
        const mode = (url.split('/'))[1];
        if (searchTerm === undefined) {
            res.sendFile(path.join(__dirname, 'media', 'error.gif'));
            return;
        }

        let gifURL;

        if(mode.charAt(0) === 'v') {
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

            gifURL = data.results[0].media_formats.gif.url;
        } else {
            console.log("Original URL: ", req.originalUrl);
            gifURL = 'https://cdn.discordapp.com/attachments/' + req.originalUrl.split('/').slice(2).join('/');
        }

        console.log('GIF URL:', gifURL);

        // Do stuff to the gif
        let gifBuffer;
        let type = 'image/gif';

        switch(mode) {
            case 'viditw':
                gifBuffer = await deepFry(gifURL);
                break;
            case 'attachmditnts':
                gifBuffer = await deepFry(gifURL);
                break;
            case 'vxylophoneew':
                gifBuffer = await hub(gifURL);
                break;
            default:
                gifBuffer = await sovietize(gifURL);
        }

        // Send the output
        res.setHeader('Content-Type', type);
        res.send(gifBuffer);
    } catch (error) {
        // Error :(
        console.error('Error in processing:', error);
        res.status(500).send('Something went wrong while processing the request');
    }
});

app.listen('80', () => {
    console.log('Listening, port 80');
});
