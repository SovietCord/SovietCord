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
        // Get the GIF's URL and some parameters
        const url = req.params[0];
        const firstArg = (url.split('/'))[1];
        const secondArg = (url.split('/'))[2];
        if(firstArg === undefined || secondArg === undefined) return await sendError(res);

        let gifURL;
        if(firstArg === 'attachments' || firstArg.charAt(0) === 'd') {
            // Discord URL
            gifURL = 'https://cdn.discordapp.com/attachments/' + req.originalUrl.split('/').slice(2).join('/');
        } else {
            // Assuming Tenor URL
            const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${secondArg}&key=${process.env.TENOR_API_KEY}&client_key=sovietcord&limit=1`, {
                headers: {
                    'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
                }
            });

            const data = await response.json();

            if (!(data.results && data.results.length > 0)) {
                // No gifs found
                await sendError(res);
                return;
            }

            gifURL = data.results[0].media_formats.gif.url;
        }

        let gifBuffer;
        let skipCheck = false;
        // Check if the link has been modified
        if(firstArg === 'view') {
            gifBuffer = await welcome(gifURL, true);
            skipCheck = true;
        } else if(firstArg === 'attachments') {
            gifBuffer = await welcome(gifURL, false);
            skipCheck = true;
        }

        if(!skipCheck) {
            switch(firstArg.slice(1)) {
                case 'syph':
                    gifBuffer = await sovietize(gifURL);
                    break;
                case 'dyph':
                    gifBuffer = await deepFry(gifURL);
                    break;
                default:
                    gifBuffer = await hub(gifURL);
            }
        }

        // Send the output
        res.setHeader('Content-Type', 'image/gif');
        res.send(gifBuffer);
    } catch (error) {
        // Error :(
        console.error('Error in processing:', error);
        sendError(res);
    }
});

app.listen('80', () => {
    console.log('Listening, port 80');
});
