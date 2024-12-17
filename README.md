# Soviet-Server

This is the server that will handle the magic for the s/o/viet regex on discord. Proper README will follow once proper skeleton code exists!

# Installation

To locally run sovietcord-server, you will need to clone the repository and install all of the necessary npm packages:
```sh
# Clone the repository
git clone --recursive https://github.com/SovietCord/soviet-server.git

# Install the npm packages
npm i
```
You can then run it with:
```sh
npm start
```
If you want to use `start.sh`, give it the correct permissions with:
```sh
chmod +x ./start.sh
```

# CDN proxy
You will need to have the CDN proxy running in order to make SovietCord process Discord images/gifs properly.
By default, SovietCord will assume it's running at port 8090 on localhost. If you wish to change that, as this value is hardcoded (yes, I know, poor code, whatever, doing this works, nothing needs to be extremely flexible at all time), you will need to modify main.js at line 101.

> [!NOTE]
> You will need to have `imagemagick` (for `gm`) and `gifsicle` installed on your system