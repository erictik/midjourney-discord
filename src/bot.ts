import { Client, GatewayIntentBits, ApplicationCommandOptionType, Interaction, CacheType, TextChannel, ChannelType } from 'discord.js';
import { Midjourney } from 'midjourney'


import 'dotenv/config'
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessageReactions ,
    GatewayIntentBits.DirectMessageTyping,
] });

const MidJourneyAPi = new Midjourney(<string>process.env.SERVER_ID, <string>process.env.CHANNEL_ID, <string>process.env.SALAI_TOKEN)




client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'oh_imagine') {
        ImagineApi(interaction);
    }
});
async function ImagineApi(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const prompt = interaction.options.getString('prompt');
    if (prompt === null) {
        return
    }
    console.log("kjkjkjk", prompt);
    const httpStatus = await MidJourneyAPi.ImagineApi(prompt);
    if (httpStatus !== 204) {
        await interaction.reply('Request has failed; please try later');
    } else {
        await interaction.reply('Your image is being prepared, please wait a moment...');
    }
}

//

// client.on('message', async (message: Message) => {
//     console.log("kjkjkjk", message.content);
//     if (message.content === '') return;
//     console.log("kjkjkjk", message.content);
//     // if ('$mj_target' in message.content && message.content[0] === '$') {
//     // //   try {
//     // //     Globals.targetID = String(message.reference!.messageID);

//     // //     // Get the hash from the URL
//     // //     Globals.targetHash = String(
//     // //       message.reference!.resolved?.attachments?.first()?.url.split('_').pop()?.split('.')[0]
//     // //     );
//     // //   } catch {
//     // //     await message.channel.send("Exception has occured, maybe you didn't reply to MidJourney message");
//     // //     await message.delete();
//     // //     return;
//     // //   }

//     //   if (String(message.reference!.resolved!.author!.id) !== "936929561302675456") {
//     //     await message.channel.send('Use the command only when you reply to MidJourney');
//     //     await message.delete();
//     //     return;
//     //   }

//     await message.channel.send('Done');
//     await message.delete();
//     // }
// });


client.on('messageCreate',async  message => {
    if (message.author.bot) return; // Ignore messages from bots
    if (message.content === '') return;
    if (message.reference === null) return;
    if (message.reference.messageId === undefined) return;
    if (message.mentions.repliedUser?.id !== "936929561302675456") return;
    const option  = message.content
    switch (option) {
        case 'v1':
            variation(1,message.reference.messageId)
            break;
        case 'v2':
            variation(2,message.reference.messageId)
            break;
        case 'v3':
            variation(3,message.reference.messageId)
            break;
        case 'v4':
            variation(4,message.reference.messageId)
            break;
        case 'u1':
            upscale(1,message.reference.messageId)
            break;
        case 'u2':
            upscale(2,message.reference.messageId)
            break;
        case 'u3':
            upscale(3,message.reference.messageId)
            break;
        case 'u4':
            upscale(4,message.reference.messageId)
            break;
    }
});

client.on('ready', async () => {
    await client.application?.commands.create({
        name: 'oh_imagine',
        description: 'This command is a wrapper of MidJourneyAI',
        options: [{
            name: 'prompt',
            type: ApplicationCommandOptionType.String,
            description: 'The prompt for the AI to imagine',
            required: true,
        }],
    });
});

async function getMessage(channelId : string, messageId : string){
    const channel = await client.channels.fetch(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;
    const message = await channel.messages.fetch(messageId);
    return message;
}

async function upscale(index:number,messageID:string){
    const msg = await getMessage(<string>process.env.CHANNEL_ID,messageID)
    if (!msg) return;
    console.log(msg?.attachments.first()?.url)
    const messageHash = MidJourneyAPi.UriToHash(<string>msg.attachments.first()?.url)
    const httpStatus =  await MidJourneyAPi.UpscaleApi(index,messageID,messageHash)
    if (httpStatus !== 204) {
        await (<TextChannel>client.channels.cache.get(<string>process.env.CHANNEL_ID)).send('Request has failed; please try later');
    }else{
        await (<TextChannel>client.channels.cache.get(<string>process.env.CHANNEL_ID)).send('Your image is being prepared, please wait a moment...');
    }
}

async function variation(index:number,messageID:string){
    const msg = await getMessage(<string>process.env.CHANNEL_ID,messageID)
    if (!msg) return;
    console.log(msg?.attachments.first()?.url)
    const messageHash = MidJourneyAPi.UriToHash(<string>msg.attachments.first()?.url)
    const httpStatus =  await MidJourneyAPi.VariationApi(index,messageID,messageHash)
    if (httpStatus !== 204) {
        await (<TextChannel>client.channels.cache.get(<string>process.env.CHANNEL_ID)).send('Request has failed; please try later');
    }else{
        await (<TextChannel>client.channels.cache.get(<string>process.env.CHANNEL_ID)).send('Your image is being prepared, please wait a moment...');
    }
}
client.login(process.env.DAVINCI_TOKEN);