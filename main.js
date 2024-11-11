const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');

async function deepFry(url) {
    try {
        // Get the GIF
        const response = await fetch(url);

        if(!response.ok) throw new Error('Failed to fetch GIF');

        // File stuff
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const tempPath = path.join(__dirname, 'temp.gif');
        fs.writeFileSync(tempPath, buffer);

        // Deepfry
        await new Promise((resolve, reject) => {
            gm(tempPath)
                .modulate(120, 200, 100)
                .contrast(10)
                .noise('laplacian')
                .quality(50)
                .write(path.join(__dirname, 'output.gif'), (err) => {
                    if (err) {
                        console.error('Error processing GIF:', err);
                        reject(err);
                    } else {
                        console.log('GIF processed and saved as output.gif');
                        resolve();
                    }
                });
        });

        // Clean up
        fs.unlinkSync(tempPath);
    } catch(error) {
        console.error('An error occured while adding a caption the the gif: ', error);
    }
}

app.get('/*', async (req, res) => {
    try {
        // Get the GIF's URL
        const url = req.params[0];

        // Browser is just searching for the icon, we don't care
        if (url === 'favicon.ico') return;

        // Get the search term
        const searchTerm = (url.split('/'))[1];
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

        // Deepfry the gif
        await deepFry(gifURL);

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
