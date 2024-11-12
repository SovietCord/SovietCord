require('dotenv').config();
const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');

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
        // Here are the available commands
        const commands = 's/menu/deepfry\n'
        + 's/menu/sovietize\n\n'
        + 'To revert:\n'
        + 'If you entered s/menu/deepfry,\n enter s/deepfry/menu\n'
        + 'If you entered s/menu/sovietize,\n enter s/sovietize/menu';
        
        const gif = await getGif(url);

        // using titlePosSize[1] does nothing for some
        // fucking reason and i don't want to know why,
        // it looks fine without it
        let titlePosSize = [30, 130, 60];
        let textPosSize = [30, 100, 20];
        // Handle if gif is smol
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
            .fill('black')
            .drawText(titlePosSize[0] + 1, titlePosSize[2] + 1, 'Welcome!')
            .drawText(titlePosSize[0] - 1, titlePosSize[2] + 1, 'Welcome!')
            .drawText(titlePosSize[0] + 1, titlePosSize[2] - 1, 'Welcome!')
            .drawText(titlePosSize[0] - 1, titlePosSize[2] - 1, 'Welcome!')
            .fill('#ffffff')
            .drawText(titlePosSize[0], titlePosSize[2], 'Welcome!')

            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), textPosSize[2])
            .fill('black')
            .drawText(textPosSize[0] + 1, textPosSize[1] + 1, 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands)
            .drawText(textPosSize[0] - 1, textPosSize[1] - 1, 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands)
            .drawText(textPosSize[0] + 1, textPosSize[1] - 1, 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands)
            .drawText(textPosSize[0] - 1, textPosSize[1] + 1, 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands)
            .fill('#ffffff')
            .drawText(textPosSize[0], textPosSize[1], 'It seems like you found Sovietcord\'s hub.\nHere\'s a list of every commands:\n' + commands)

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

// the same as hub, except for welcome
async function welcome(url, tenor) {
    try {
        const gif = await getGif(url);
        let titlePosSize = [30, 130, 60];
        let textPosSize = [30, 100, 20];
        let userSend;
        if(tenor) {
            userSend = 's/view/menu'
        } else {
            userSend = 's/attachments/menu'
        }
        // Handle if gif is smol
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
            .out('-fill', 'rgba(255, 0, 0, 0.8)')
            .out('-colorize', '100,0,0')

            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), titlePosSize[2])
            .fill('black')
            .drawText(titlePosSize[0] - 1, titlePosSize[2] - 1, 'Welcome!')
            .drawText(titlePosSize[0] + 1, titlePosSize[2] - 1, 'Welcome!')
            .drawText(titlePosSize[0] - 1, titlePosSize[2] + 1, 'Welcome!')
            .drawText(titlePosSize[0] + 1, titlePosSize[2] + 1, 'Welcome!')
            .fill('#d1c300')
            .drawText(titlePosSize[0], titlePosSize[2], 'Welcome!')

            .font(path.join(__dirname, 'Fonts', 'Arial.ttf'), textPosSize[2])
            .fill('black')
            .drawText(textPosSize[0] - 1, textPosSize[1] - 1, 'To get started, enter "' + userSend + '".')
            .drawText(textPosSize[0] - 1, textPosSize[1] - 1, 'To get started, enter "' + userSend + '".')
            .drawText(textPosSize[0] - 1, textPosSize[1] + 1, 'To get started, enter "' + userSend + '".')
            .drawText(textPosSize[0] + 1, textPosSize[1] + 1, 'To get started, enter "' + userSend + '".')
            .fill('#d1c300')
            .drawText(textPosSize[0], textPosSize[1], 'To get started, enter "' + userSend + '".')

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



module.exports = { deepFry, sovietize, hub, welcome };