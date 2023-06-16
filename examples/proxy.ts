import "dotenv/config";
import { FetchFn, Midjourney } from "midjourney";
import fetch from "node-fetch";
import { SocksProxyAgent } from "socks-proxy-agent";
import WebSocket from "isomorphic-ws";
/**
 *
 * a simple example of using the proxy with ws
 * ```
 * npx tsx examples/proxy.ts
 * ```
 */

const proxyFetch: FetchFn = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> => {
  const agent = new SocksProxyAgent("socks5://127.0.0.1:7890", {
    keepAlive: true,
  });
  if (!init) init = {};
  // @ts-ignore
  init.agent = agent;
  // @ts-ignore
  return fetch(input, init);
};

class ProxyWebSocket extends WebSocket {
  constructor(address: string | URL, options?: WebSocket.ClientOptions) {
    const agent = new SocksProxyAgent("socks5://127.0.0.1:7890", {
      keepAlive: true,
    });
    if (!options) options = {};
    options.agent = agent;
    super(address, options);
  }
}

async function main() {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    HuggingFaceToken: <string>process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: true,
    fetch: proxyFetch,
    WebSocket: ProxyWebSocket as typeof WebSocket,
  });
  await client.init();
  const Imagine = await client.Imagine(
    "Red hamster smoking a cigaret, https://media.discordapp.net/attachments/1108515696385720410/1118385339732590682/DanielH_A_giant_hamster_monster._Friendly_in_a_business_suit_si_d4be1836-a4e1-41a8-b1d7-99eebc521220.png?width=1878&height=1878 ",
    (uri: string, progress: string) => {
      console.log("Imagine.loading", uri, "progress", progress);
    }
  );
  console.log({ Imagine });
  if (!Imagine) {
    return;
  }
  const Variation = await client.Variation(
    Imagine.content,
    2,
    <string>Imagine.id,
    <string>Imagine.hash,
    (uri: string, progress: string) => {
      console.log("Variation.loading", uri, "progress", progress);
    }
  );
  console.log({ Variation });
  if (!Variation) {
    return;
  }
  const Upscale = await client.Upscale(
    Variation.content,
    2,
    <string>Variation.id,
    <string>Variation.hash,
    (uri: string, progress: string) => {
      console.log("Upscale.loading", uri, "progress", progress);
    }
  );
  console.log({ Upscale });
  client.Close();
}
main()
  .then(() => {
    console.log("finished");
    process.exit(0);
  })
  .catch((err) => {
    console.log("finished");
    console.error(err);
    process.exit(1);
  });
