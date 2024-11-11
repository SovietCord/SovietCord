const path = require('path');
const fs = require('fs');
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

async function hub(url) {
    try {
        const gif = await getGif(url);

        // Handle if gif is smol
        let titlePosSize = [30, 100, 60];
        let textPosSize = [30, 150, 20];
        await new Promise((resolve, reject) => {
            gm(gif).identify((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (data.size.width < 400) {
                        titlePosSize = [10, 10, 34];
                        textPosSize = [10, 60, 15];
                    }
                    resolve(); 
                }
            });
        });        
    
        return new Promise((resolve, reject) => {
            gm(gif)
            .coalesce()
            .out('-fill', 'rgba(0, 0, 0, 0.8)')
            .out('-colorize', '100,0,0')

            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), titlePosSize[2])
            .fill('#ffffff')
            .drawText(titlePosSize[0], titlePosSize[2], 'Welcome!')

            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), textPosSize[2])
            .fill('#ffffff')
            .drawText(textPosSize[0], textPosSize[1], 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n[command list here]')
            
            .toBuffer('GIF', (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        
        });
    } catch (err) {
        console.error('Error in hub function:', err);
        throw err;
    }
}


module.exports = { deepFry, sovietize, hub };