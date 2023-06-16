import { DefaultMJConfig, MJConfig, MJConfigParam } from "midjourney";

export interface BotConfig extends MJConfig {
  DavinciToken: string;
}
export interface BotConfigParam extends MJConfigParam {
  DavinciToken: string;
}

export const DefaultBotConfig: BotConfig = {
  ...DefaultMJConfig,
  DavinciToken: "",
};
