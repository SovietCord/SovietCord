const express = require('express');
const app = express();
require('dotenv').config();
const { deepFry, sovietize, hub, welcome } = require('./effects.js');
const path = require('path');
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

            // Fetch the initial HTML
            const response = await fetch(source.replace('tenvietr', 'tenor'), {
                headers: {
                    'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
                }
            });
            const html = await response.text();
    
            // Extract the URL from the HTML
            const match = html.match(/<meta class="dynamic" name="twitter:image" content="https:\/\/(?:c|media1)\.tenor\.com\/([^"]*)">/);
            if (!match || !match[1]) {
                throw new Error("Image URL not found in the HTML.");
            }
    
            // Construct the direct image URL
            gifURL = `https://media1.tenor.com/${match[1]}`;
        } else {
            // Assuming Discord URL
            tenor = false;
            gifURL = source.replace('discvietrd', 'discord');
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

app.listen('6969', () => {
    console.log('Listening, port 6969');
});
