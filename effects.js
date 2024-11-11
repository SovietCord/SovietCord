const path = require('path');
require('dotenv').config();
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');

// Takes in the URL of the GIF, writes it to a temporary file, 
// returns the path of that file
async function getAndWriteTempFiles(url) {
    // Get the GIF
    const response = await fetch(url);

    if(!response.ok) throw new Error('Failed to fetch GIF');

    // File stuff
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tempPath = path.join(__dirname, 'temp.gif');
    fs.writeFileSync(tempPath, buffer);

    return tempPath;
}

async function deepFry(url) {
    try {

        const tempPath = await getAndWriteTempFiles(url);

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
        console.error('An error occured while deepfrying the gif: ', error);
    }
}

async function sovietize(url) {
    try {

        const tempPath = await getAndWriteTempFiles(url);

        // Sovietize
        await new Promise((resolve, reject) => {
            /* 

            */
            gm(tempPath)
                .coalesce()
                .out('-fill', 'rgba(255, 0, 0, 0.6)')
                .out('-colorize', '100,0,0')
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
        console.error('An error occured while sovietizing the gif: ', error);
    }
}

module.exports = { deepFry, sovietize };