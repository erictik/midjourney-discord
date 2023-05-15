import {
  DefaultMidjourneyConfig,
  MidjourneyConfig,
  MidjourneyConfigParam,
} from "midjourney";

export interface BotConfig extends MidjourneyConfig {
  DavinciToken: string;
}
export interface BotConfigParam extends MidjourneyConfigParam {
  DavinciToken: string;
}

export const DefaultBotConfig: BotConfig = {
  ...DefaultMidjourneyConfig,
  DavinciToken: "",
};
