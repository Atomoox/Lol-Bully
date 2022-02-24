# Lol bully

    Prolly the only repo you need to lose all your friends.

## I. Roadmap
    
- [x] Posting webhooks on losing / winning
- [X] Get the score / damage / KDA of the game 
- [ ] Rewrite everything in english
- [ ] Add all api clusters / region
- [ ] Add different messages depending on the KDA
- [ ] Make the Api Wrapper it's own repo

## II. How can you bully your own friends ?

The concept of ``Having friends`` may be disturbing for some of you, but having friends is a critical milestone when running this script.

### 2.1 - Get your own RIOT DEV api key
The riot api uses API KEY for authentification, the keys expires 24 hours after their generations.

### 2.2 - Generate a discord webhook
Of course the whole point of this script is to alert your friends they just lost a game, to do so, we're using discord to send them reminders.

**MAKE SURE THEY HAVE ACCESS TO THE CHANNEL YOU'RE GENERATING THE WEBHOOK IN**

If you have no idea on how to generate a webhook using discord, here is the [official discord tutorial](https://support.discord.com/hc/fr/articles/228383668-Utiliser-les-Webhooks)

### 2.3 - Getting to code !

Here's a code snippet (also availible in the index.ts of the repo) for a quick and easy use.

```
import { ApiWrapper } from './apiWrapper';
import { DiscordWrapper } from './discordWrappper';
import { Events } from './types';

class Application {
    public static async run(API_KEY: string, userName: string, webhook: string) {
        const apiWrapper = new ApiWrapper(API_KEY);
        const discordWrapper = new DiscordWrapper(webhook);

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

        await apiWrapper.start(userName);
    }
};
```

### 2.4 - Starting the script
Once you've done all the previous steps, you should be able to run the script using the following command in your terminal.
    
    $ cd ./YourDirectory
    
    $ ts-node index.ts

## What's next ?

Tbh idk if i'm going to maintain this for a long time, i'll just push updates whenever i feel like coding on this project.
I'll probably make a similar project for Clash Royale as my friend **sucks**.

## Support me
If you're crazy enough to support a degenrate like me, feel free to send some ETH to the address below ❤️
    
    0xa602d2cc5cb1123BD34c1D1ffCF61e403d262074


