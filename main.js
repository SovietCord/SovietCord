const express = require('express');
const app = express();
require('dotenv').config();
const { deepFry, sovietize, hub, welcome, drawSmallText, getGif } = require('./effects.js');
const { compressGIF } = require('./optimize.js');
const path = require('path');
const fs = require('fs').promises;

const replace = [
    'menu',
    'welcome',
    'sovietize',
    'deepfry'
]

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



/*
    Here's how soviet-server works:


    1. Get the necessary parameters in the header, URL, ...
        These informations will be used later by other functions.

    2. Get the GIF's URL with http-source (found in the header)
        Firstly, we detect if the URL is for Tenor or Discord
        This URL gets saved in gifURL. gifURL will then be passed
        to different functions which will handle fetching the GIF.

    3. Check which effect to apply and apply it to the GIF
        With the URL variable, we check what the user wants to do,
        to then call the proper function to apply different effects
        to the GIF.
        The functions return the buffer of the modified GIF.
        They can be found in effects.js

    4. Compress and send the GIF
        The GIF file firstly gets compressed to reduce the transfer
        time and size. The function to do so is compressGIF() and
        can be found in optimize.js.
        Once the GIF got compressed, we simply send it to the user.
*/

app.get('*', async (req, res) => {
    try {
        // Get the source from the headers
        const source = req.headers['http-source'];

        // Check the header
        if(source === undefined) return sendError(res);

        // Get the GIF URL
        let gifURL;
        let tenor; // true if the GIF is from tenor, false otherwise
        if(source.charAt(8) === 't') {
            // Tenor URL
            tenor = true;

            let toFetch = source.replace('tenvietr', 'tenor');
            for(let i = 0; i<replace.length; i++) {
                toFetch = toFetch.replace(replace[i], 'view');
            }
            
            // Fetch the initial HTML
            const response = await fetch(toFetch, {
                headers: {
                    'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
                }
            });
            const html = await response.text();
    
            // Find the GIF URL in the HTML
            const match = html.match(/<meta class="dynamic" name="twitter:image" content="https:\/\/(?:c|media1)\.tenor\.com\/([^"]*)">/);
            if (!match || !match[1]) throw new Error("Image URL not found in the HTML.");

            gifURL = `https://media1.tenor.com/${match[1]}`;
        } else {
            // Assuming Discord URL
            tenor = false;
            gifURL = source.replace('discvietrd', 'discord');
            for(let i = 0; i<replace.length; i++) {
                gifURL = gifURL.replace(replace[i], 'attachments');
            }
        }

        let gifBuffer;
        let skipCheck = false;
        const URL = (req.params[0]).split('/').slice(0, 2).join('/');
        
        // Check the URL and use the correct functions
        if(URL === '/' || URL === '/view' || URL === '/attachments') {
            skipCheck = true;
            gifBuffer = await welcome(gifURL, tenor ? true : false);
        }

        if(!skipCheck) {
            switch(URL.slice(1)) {
                case 'sovietize':
                    gifBuffer = await sovietize(gifURL);
                    break;
                case 'deepfry':
                    gifBuffer = await deepFry(gifURL);
                    break;
                case 'menu':
                    gifBuffer = await hub(gifURL);
                    break;
                case 'weirdy':
                    // This effect works by overcompressing the GIF
                    gifBuffer = await getGif(gifURL);
                    gifBuffer = await compressGIF(gifBuffer, 3, 50000);
                    gifBuffer = await drawSmallText(gifBuffer, 'Enter "s/weirdy/menu" to go back to the hub');
                    break;
                default:
                    gifBuffer = await fs.readFile(path.join(__dirname, 'media', 'error.gif'));
            }
        }

        // Compress & send the GIF
        gifBuffer = await compressGIF(gifBuffer, 3, 60);
        res.setHeader('User-Agent', 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)');
        res.setHeader('Content-Type', 'image/gif');
        res.send(gifBuffer);
    } catch (error) {
        // Error
        console.error('Error in processing:\n', error);
        sendError(res);
    }
});

// Listen on port 6969
app.listen('6969', () => {
    console.log('Listening, port 6969');
});
