require('dotenv').config();
const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');

// Some functions to simplify the code and avoid repetitions
async function drawSmallText(buffer, text) {
    let height;
    
    return new Promise((resolve, reject) => {
        gm(buffer)
        .size((err, size) => {
            height = err ?  '10' : size.height;
            if(err) console.log(err);
    
            gm(buffer)
            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), 10)
            .fill('black')
            .drawText(10, height - 10, text)
            .toBuffer('GIF', (err, buffer) => {
                if(err) reject(err);
                else resolve(buffer);
            });
        });
    });
}

async function drawTextWithBorder(buffer, text, textColor, borderColor, size, x, y) {
    return new Promise((resolve, reject) => {
        gm(buffer)
        .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), size)
        .fill(borderColor)
        .drawText(x + 1, y + 1, text)
        .drawText(x - 1, y + 1, text)
        .drawText(x + 1, y - 1, text)
        .drawText(x - 1, y - 1, text)
        .fill(textColor)
        .drawText(x, y, text)
        .toBuffer('GIF', (err, buffer) => {
            if(err) reject(err);
            else resolve(buffer);
        });
    });
}

// Takes in the URL of the GIF, writes it to a temporary file, 
// returns the buffer of that file
async function getGif(url) {
    // Get the GIF
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'SovietCord/1.0 (Debian12; x64) PrivateKit/420.69 (KHTML, like Gecko)',
        }
    });

    if (!response.ok) throw new Error('Failed to fetch GIF');

    // Convert arrayBuffer to Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
}

async function deepFry(url) {
    try {
        let height;
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
                else {
                    resolve(drawSmallText(buffer, 'Enter "s/deepfry/menu" to go back to the hub'));
                }
            });
        });
    } catch (error) {
        console.error('An error occurred while deep frying the gif:', error);
        throw error;
    }
}

async function sovietize(url) {
    try {
        let height;

        const gifBuffer = await getGif(url);

        // Sovietize the GIF
        return new Promise((resolve, reject) => {
            gm(gifBuffer)
            .coalesce()
            .out('-fill', 'rgba(255, 0, 0, 0.6)')
            .out('-colorize', '100,0,0')
            
            .toBuffer('GIF', (err, buffer) => {
                if (err) reject(err);
                else resolve(drawSmallText(buffer, 'Enter "s/sovietize/menu" to go back to the hub'));
            });
        });
    } catch (error) {
        console.error('An error occurred while sovietizing the gif:', error);
        throw error;
    }
}

async function hub(url) {
    try {
        // Here are the available commands
        const commands = 's/menu/deepfry\n'
        + 's/menu/sovietize\n\n'
        
        const gif = await getGif(url);

        // i found why it wasn't working and i feel very stupid now
        // (no you won't look at the last commit to see what was wrong)
        let titlePosSize = [30, 60, 60];
        let textPosSize = [30, 100, 20];
        // Handle if gif is smol
        await new Promise((resolve, reject) => {
            gm(gif).identify((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (data.size.width < 400) {
                        titlePosSize = [10, 40, 34];
                        textPosSize = [10, 60, 15];
                    }
                    resolve(); 
                }
            });
        });        
    
        const initialBuffer = await new Promise((resolve, reject) => {
            gm(gif)
            .coalesce()
            .out('-fill', 'rgba(0, 0, 0, 0.8)')
            .out('-colorize', '100,0,0')

            .toBuffer('GIF', (err, buffer) => {
                if (err) reject(err);
                else {
                    resolve(buffer);
                }
            });
        });

        const bufferPt1 = await drawTextWithBorder(initialBuffer, 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands,
            'white', 'black', textPosSize[2], textPosSize[0], textPosSize[1])
        return await drawTextWithBorder(bufferPt1, 'Welcome!',
                        'white', 'black', titlePosSize[2], titlePosSize[0], titlePosSize[1]);
    } catch (err) {
        console.error('Error in hub function:', err);
        throw err;
    }
}

// the same as hub, except for welcome
async function welcome(url, tenor) {
    try {
        const gif = await getGif(url);
        let titlePosSize = [30, 60, 60];
        let textPosSize = [30, 100, 20];
        let userSend;
        userSend = (tenor) ? 's/view/menu' : 's/attachments/menu';
        // Handle if gif is smol
        await new Promise((resolve, reject) => {
            gm(gif).identify((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    if (data.size.width < 400) {
                        titlePosSize = [10, 40, 34];
                        textPosSize = [10, 60, 15];
                    }
                    resolve();
                }
            });
        });        
    
        const initialBuffer = await new Promise((resolve, reject) => {
            gm(gif)
            .coalesce()
            .out('-fill', 'rgba(255, 0, 0, 0.8)')
            .out('-colorize', '100,0,0')

            .toBuffer('GIF', (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer);
                }
            });
        });

        const bufferPt1 = await drawTextWithBorder(initialBuffer, 'Welcome!',
            '#d1c300', 'black', titlePosSize[2], titlePosSize[0], titlePosSize[1]);
        return await drawTextWithBorder(bufferPt1, 'To get started, enter "' + userSend + '".',
            '#d1c300', 'black', textPosSize[2], textPosSize[0], textPosSize[1]);
    } catch (err) {
        console.error('Error in hub function:', err);
        throw err;
    }
}



module.exports = { deepFry, sovietize, hub, welcome };