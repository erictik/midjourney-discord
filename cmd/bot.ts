
import 'dotenv/config'
import { MidjourneyBot } from '../src/index'

async function main(){
    const client = new MidjourneyBot( <string>process.env.DAVINCI_TOKEN, <string>process.env.SALAI_TOKEN, <string>process.env.SERVER_ID, <string>process.env.CHANNEL_ID)
    await client.start()
}

main().catch(console.error)