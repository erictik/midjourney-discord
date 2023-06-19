import {
  Client,
  GatewayIntentBits,
  ApplicationCommandOptionType,
  Interaction,
  CacheType,
  TextChannel,
  ChannelType,
  Message,
} from "discord.js";
import { Midjourney, MidjourneyApi } from "midjourney";
import { BotConfig, BotConfigParam, DefaultBotConfig } from "./interfaces";

export class MidjourneyBot extends Midjourney {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
    ],
  });
  public config: BotConfig;

  constructor(defaults: BotConfigParam) {
    const config = {
      ...DefaultBotConfig,
      ...defaults,
    };
    super(config);
    this.config = config;
  }

  async start() {
    this.client.on("ready", this.onReady.bind(this));
    this.client.on("messageCreate", this.onMessage.bind(this));
    this.client.on("interactionCreate", this.onInteraction.bind(this));
    await this.init();
    await this.client.login(this.config.DavinciToken);
    this.log("Bot started");
  }
  async onInteraction(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "oh_imagine") {
      this.ImagineCmd(interaction);
    }
  }

  async ImagineCmd(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const prompt = interaction.options.getString("prompt");
    if (prompt === null) {
      return;
    }
    this.log("prompt", prompt);
    this.MJApi.config.ChannelId = interaction.channelId;
    const httpStatus = await this.MJApi.ImagineApi(prompt);
    if (httpStatus !== 204) {
      await interaction.reply("Request has failed; please try later");
    } else {
      await interaction.reply(
        "Your image is being prepared, please wait a moment..."
      );
    }
  }

  async onReady() {
    await this.client.application?.commands.create({
      name: "oh_imagine",
      description: "This command is a wrapper of MidJourneyAI",
      options: [
        {
          name: "prompt",
          type: ApplicationCommandOptionType.String,
          description: "The prompt for the AI to imagine",
          required: true,
        },
      ],
    });
  }

  async getMessage(channelId: string, messageId: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;
    const message = await channel.messages.fetch(messageId);
    return message;
  }

  async upscale(index: 1 | 2 | 3 | 4, channelId: string, messageID: string) {
    const msg = await this.getMessage(channelId, messageID);
    if (!msg) return;
    this.log(msg?.attachments.first()?.url);
    const messageHash = this.UriToHash(<string>msg.attachments.first()?.url);
    this.MJApi.config.ChannelId = channelId;
    const httpStatus = await this.MJApi.UpscaleApi({
      index,
      msgId: messageID,
      hash: messageHash,
      flags: 0
    });
    if (httpStatus !== 204) {
      await (<TextChannel>this.client.channels.cache.get(channelId)).send(
        "Request has failed; please try later"
      );
    } else {
      await (<TextChannel>this.client.channels.cache.get(channelId)).send(
        "Your upscale image is being prepared, please wait a moment..."
      );
    }
  }

  async variation(index: 1 | 2 | 3 | 4, channelId: string, messageID: string) {
    const msg = await this.getMessage(channelId, messageID);
    if (!msg) return;
    this.log(msg?.attachments.first()?.url);
    const messageHash = this.UriToHash(<string>msg.attachments.first()?.url);
    this.MJApi.config.ChannelId = channelId;
    const httpStatus = await this.MJApi.VariationApi({
      index,
      msgId: messageID,
      hash: messageHash,
      flags: 0
    });
    if (httpStatus !== 204) {
      await (<TextChannel>this.client.channels.cache.get(channelId)).send(
        "Request has failed; please try later"
      );
    } else {
      await (<TextChannel>this.client.channels.cache.get(channelId)).send(
        "Your variations image is being prepared, please wait a moment..."
      );
    }
  }

  private async onMessage(message: Message<boolean>) {
    if (message.author.bot) return; // Ignore messages from bots
    if (message.content === "") return;
    if (message.reference === null) return;
    if (message.reference.messageId === undefined) return;
    if (message.mentions.repliedUser?.id !== "936929561302675456") return;
    const option = message.content;
    const channelId = message.channelId;
    switch (option) {
      case "v1":
        this.variation(1, channelId, message.reference.messageId);
        break;
      case "v2":
        this.variation(2, channelId, message.reference.messageId);
        break;
      case "v3":
        this.variation(3, channelId, message.reference.messageId);
        break;
      case "v4":
        this.variation(4, channelId, message.reference.messageId);
        break;
      case "u1":
        this.upscale(1, channelId, message.reference.messageId);
        break;
      case "u2":
        this.upscale(2, channelId, message.reference.messageId);
        break;
      case "u3":
        this.upscale(3, channelId, message.reference.messageId);
        break;
      case "u4":
        this.upscale(4, channelId, message.reference.messageId);
        break;
    }
  }
}
