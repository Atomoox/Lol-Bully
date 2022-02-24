import { ApiWrapper } from './apiWrapper';
import { DiscordWrapper } from './discordWrappper';
import { Events } from './types';

class Application {
    public static async run() {
        const apiWrapper = new ApiWrapper('RGAPI-b9dfc610-b8b5-4668-a18f-cb3fda766522');
        const discordWrapper = new DiscordWrapper("", "https://discord.com/api/webhooks/944165432657600562/JBd8D6qpT9T5wNlILdqiBG4wbd_xhUDPcHNTj9bQmsldMCiGv8B4iBKPswPpcq2kQv0X");

        apiWrapper.on(Events.Loss, (matchData: any, parsedDatas: any) => {
            discordWrapper.submitWebhook(matchData);
           console.log(matchData);
           console.log(parsedDatas);
        })
        apiWrapper.on(Events.Win, (matchData: any, parsedDatas: any) => {
            discordWrapper.submitWebhook(matchData);
            console.log(matchData);
            console.log(parsedDatas);
         })

        await apiWrapper.start("EMDDD")
    }
};

Application.run();