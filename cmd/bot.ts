import "dotenv/config";
import { MidjourneyBot } from "../src/index";

async function main() {
  const client = new MidjourneyBot({
    DavinciToken: <string>process.env.DAVINCI_TOKEN,
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    Ws: true,
  });

  await client.start();
}

main().catch(console.error);
