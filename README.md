# Midjourney-Wrapper

node.js client for MidJourney wrapper in Discord.


## Implemented commands documentation
Generating idea
```
/oh_imagine [ MT : prompt (string)]
```
Upscaling   
Reply `u1` `u2` `u3` `u4` 

Variations  
Reply  `v1` `v2` `v3` `v4`

## Example
To run the included example, you must have [Node.js](https://nodejs.org/en) installed. Then, run the following commands in the root directory of this project:


1. clone the repository
```
git clone
```
2. install dependencies
```
npm install
```
3. set the environment variables
   [How to get your Discord SALAI_TOKEN:](https://www.androidauthority.com/get-discord-token-3149920/)
   [How to create a Discord bot and add it to your server:](https://www.xda-developers.com/how-to-create-discord-bot/)
```
export SERVER_ID="108250087147832934"
export CHANNEL_ID="109489299228171884"
export SALAI_TOKEN="your-salai-token"
export SALAI_DAVINCI_TOKENTOKEN="Token of Discord bot"
```
4. run the example
```
npm run dev
```

## Install
```
yarn add midjourney-discord
```
or
```
npm install midjourney-discord
```

## Usage
```js
import { MidjourneyBot } from 'midjourney-discord'
const client = new MidjourneyBot( process.env.DAVINCI_TOKEN, process.env.SALAI_TOKEN, process.env.SERVER_ID, process.env.CHANNEL_ID)
await client.start()
```



Inspired by [MidJourney-Wrapper](https://github.com/Wildric-Auric/MidJourney-Wrapper)
