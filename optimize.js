const { spawn } = require('child_process');

async function compressGIF(gifBuffer, optimization, loss) {
    return new Promise((resolve, reject) => {
        const gifsicle = spawn('gifsicle', [
            `--optimize=${optimization}`, 
            '--colors=128',
            `--lossy=${loss}`
        ]);

        let output = Buffer.alloc(0);

        gifsicle.stdin.write(gifBuffer);
        gifsicle.stdin.end();

        gifsicle.stdout.on('data', (chunk) => {
            output = Buffer.concat([output, chunk]);
        });

        gifsicle.stderr.on('data', (data) => {
            console.error('Gifsicle stderr:', data.toString());
        });

        gifsicle.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Gifsicle process failed with code ${code}.`));
            }
        });

        gifsicle.on('error', (err) => {
            console.error('Gifsicle error:', err);
            reject(err);
        });
    });
}

module.exports = { compressGIF };