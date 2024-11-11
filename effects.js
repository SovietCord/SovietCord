const path = require('path');
require('dotenv').config();
const gm = require('gm').subClass({ imageMagick: true });

// Takes in the URL of the GIF, writes it to a temporary file, 
// returns the path of that file
async function getGif(url) {
    // Get the GIF
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch GIF');

    // Convert arrayBuffer to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
}

async function deepFry(url) {
    try {
        const gifBuffer = await getGif(url);

        // Deepfry the GIF
        return new Promise((resolve, reject) => {
            gm(gifBuffer)
                .modulate(120, 200, 100)
                .contrast(10)
                .noise('laplacian')
                .quality(50)
                .toBuffer('GIF', (err, buffer) => {
                    if (err) reject(err);
                    else resolve(buffer);
                });
        });
    } catch (error) {
        console.error('An error occurred while deep frying the gif:', error);
        throw error;
    }
}

async function sovietize(url) {
    try {
        const gifBuffer = await getGif(url);

        // Sovietize the GIF
        return new Promise((resolve, reject) => {
            gm(gifBuffer)
                .coalesce()
                .out('-fill', 'rgba(255, 0, 0, 0.6)')
                .out('-colorize', '100,0,0')
                .toBuffer('GIF', (err, buffer) => {
                    if (err) reject(err);
                    else resolve(buffer);
                });
        });
    } catch (error) {
        console.error('An error occurred while sovietizing the gif:', error);
        throw error;
    }
}

module.exports = { deepFry, sovietize };