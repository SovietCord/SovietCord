const express = require('express');
const app = express();
require('dotenv').config();
const { deepFry, sovietize, hub, welcome } = require('./effects.js');
const path = require('path');
const { send } = require('process');
const fs = require('fs').promises;

async function sendError(res) {
    try {
        const errorGifBuffer = await fs.readFile(path.join(__dirname, 'media', 'error.gif'));
        res.setHeader('Content-Type', 'image/gif');
        res.send(errorGifBuffer);
    } catch(error) {
        res.status(500).send('Error errored');
        console.log(error);
    }
}

app.get('*', async (req, res) => {
    try {
        // Get the source from the headers
        const source = req.headers['source'];

        // Check the header
        if(source === undefined) return sendError(res);

        // Get the GIF URL
        let gifURL;
        let tenor; // true if from tenor, false otherwise
        if(source.charAt(8) === 't') {
            // Tenor URL
            tenor = true;
            const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${source.split('/')[4]}&key=${process.env.TENOR_API_KEY}&client_key=sovietcord&limit=1`, {
                headers: {
                    'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
                }
            });

            const data = await response.json();

            if (!(data.results && data.results.length > 0)) {
                // No gifs found
                return await sendError(res);
            }

            gifURL = data.results[0].media_formats.gif.url;
        } else {
            // Assuming Discord URL
            tenor = false;
            gifURL = source;
        }

        let gifBuffer;
        let skipCheck = false;
        // Send welcome message if needed
        if(req.params[0] === '/' || req.params[0] === '/view' || req.params[0] === '/attachments') {
            skipCheck = true;
            gifBuffer = await welcome(gifURL, tenor ? true : false);
        }

        if(!skipCheck) {
            switch(req.params[0].slice(1)) {
                case 'sovietize':
                    gifBuffer = await sovietize(gifURL);
                    break;
                case 'deepfry':
                    gifBuffer = await deepFry(gifURL);
                    break;
                case 'menu':
                    gifBuffer = await hub(gifURL);
                    break;
                default:
                    gifBuffer = await fs.readFile(path.join(__dirname, 'media', 'error.gif'));
            }
        }

        // Send the output
        res.setHeader('User-Agent', 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)');
        res.setHeader('Content-Type', 'image/gif');
        res.send(gifBuffer);
    } catch (error) {
        // Error :(
        console.error('Error in processing:\n', error);
        sendError(res);
    }
});

app.listen('80', () => {
    console.log('Listening, port 80');
});
