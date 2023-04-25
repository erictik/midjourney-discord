# Midjourney-Wrapper

node.js client for MidJourney wrapper in Discord.
<div align="center">
	<p>
		<a href="https://discord.gg/dP95gZ8z"><img src="https://img.shields.io/discord/1082500871478329374?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/midjourney-discord"><img src="https://img.shields.io/npm/v/midjourney-discord.svg?maxAge=3600" alt="npm version" /></a>
	</p>
</div>


## Implemented commands documentation
Generating idea
```
/oh_imagine [ MT : prompt (string)]
```
![prompt_pwz2u1](https://res.cloudinary.com/dfswecori/image/upload/v1682423171/eric/prompt_pwz2u1.gif)
Upscaling   
Reply `u1` `u2` `u3` `u4` 
![upscale](https://res.cloudinary.com/dfswecori/image/upload/v1682423366/eric/upscale_n5b4go.gif)
Variations  
Reply  `v1` `v2` `v3` `v4`
![variation](https://res.cloudinary.com/dfswecori/image/upload/v1682423164/eric/variation_hkpsx0.gif)
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
