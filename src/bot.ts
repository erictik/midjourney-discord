import { Client, GatewayIntentBits, ApplicationCommandOptionType, Interaction, CacheType, TextChannel, ChannelType, Message } from 'discord.js';
import { Midjourney } from 'midjourney'

export class MidjourneyBot extends Midjourney {
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
        ]
    });
    constructor(public DAVINCI_TOKEN: string, public SALAI_TOKEN: string, public SERVER_ID: string, public CHANNEL_ID: string) {
        super(SERVER_ID, CHANNEL_ID, SALAI_TOKEN, true)
    }

    async start() {
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('messageCreate', this.onMessage.bind(this));
        this.client.on('interactionCreate', this.onInteraction.bind(this));
        await this.client.login(this.DAVINCI_TOKEN);
        this.log('Bot started');
    }
    async onInteraction(interaction: Interaction<CacheType>) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === 'oh_imagine') {
            this.ImagineCmd(interaction);
        }
    }

    async ImagineCmd(interaction: Interaction<CacheType>) {
        if (!interaction.isChatInputCommand()) return;
        const prompt = interaction.options.getString('prompt');
        if (prompt === null) {
            return
        }
        this.log("prompt", prompt);
        const httpStatus = await this.ImagineApi(prompt);
        if (httpStatus !== 204) {
            await interaction.reply('Request has failed; please try later');
        } else {
            await interaction.reply('Your image is being prepared, please wait a moment...');
        }
    }

    async onReady() {
        await this.client.application?.commands.create({
            name: 'oh_imagine',
            description: 'This command is a wrapper of MidJourneyAI',
            options: [{
                name: 'prompt',
                type: ApplicationCommandOptionType.String,
                description: 'The prompt for the AI to imagine',
                required: true,
            }],
        });
    }

    async getMessage(channelId: string, messageId: string) {
        const channel = await this.client.channels.fetch(channelId);
        if (!channel || channel.type !== ChannelType.GuildText) return;
        const message = await channel.messages.fetch(messageId);
        return message;
    }

    async upscale(index: number, messageID: string) {
        const msg = await this.getMessage(this.CHANNEL_ID, messageID)
        if (!msg) return;
        console.log(msg?.attachments.first()?.url)
        const messageHash = this.UriToHash(<string>msg.attachments.first()?.url)
        const httpStatus = await this.UpscaleApi(index, messageID, messageHash)
        if (httpStatus !== 204) {
            await (<TextChannel>this.client.channels.cache.get(this.CHANNEL_ID)).send('Request has failed; please try later');
        } else {
            await (<TextChannel>this.client.channels.cache.get(this.CHANNEL_ID)).send('Your upscale image is being prepared, please wait a moment...');
        }
    }

    async variation(index: number, messageID: string) {
        const msg = await this.getMessage(this.CHANNEL_ID, messageID)
        if (!msg) return;
        console.log(msg?.attachments.first()?.url)
        const messageHash = this.UriToHash(<string>msg.attachments.first()?.url)
        const httpStatus = await this.VariationApi(index, messageID, messageHash)
        if (httpStatus !== 204) {
            await (<TextChannel>this.client.channels.cache.get(this.CHANNEL_ID)).send('Request has failed; please try later');
        } else {
            await (<TextChannel>this.client.channels.cache.get(this.CHANNEL_ID)).send('Your variations image is being prepared, please wait a moment...');
        }
    }


    private async onMessage(message: Message<boolean>) {
        if (message.author.bot) return; // Ignore messages from bots
        if (message.content === '') return;
        if (message.reference === null) return;
        if (message.reference.messageId === undefined) return;
        if (message.mentions.repliedUser?.id !== "936929561302675456") return;
        const option = message.content
        switch (option) {
            case 'v1':
                this.variation(1, message.reference.messageId)
                break;
            case 'v2':
                this.variation(2, message.reference.messageId)
                break;
            case 'v3':
                this.variation(3, message.reference.messageId)
                break;
            case 'v4':
                this.variation(4, message.reference.messageId)
                break;
            case 'u1':
                this.upscale(1, message.reference.messageId)
                break;
            case 'u2':
                this.upscale(2, message.reference.messageId)
                break;
            case 'u3':
                this.upscale(3, message.reference.messageId)
                break;
            case 'u4':
                this.upscale(4, message.reference.messageId)
                break;
        }
    }
}