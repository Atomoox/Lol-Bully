import got from 'got';
import { GameStats } from './types';

const championImage = (champion: string) => `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/champion/${champion}.png`;
const userImage = (userIcon: string) => `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${userIcon}.png`;

const generateWebhookPayload = (gameStats: GameStats) => {
    return {
        "title": gameStats.justwon ? "A gagné une partie" : "Est une merde",
        "description": gameStats.justwon ? "(surement la chatte)" : "Mérité + ratio",
        "color": gameStats.justwon ? 1964042 : 16734296,
        "fields": [
            {
                "name": "Score",
                "value": gameStats.kda,
                "inline": true
            },
            {
                "name": "Champion",
                "value": gameStats.champion,
                "inline": true
            },
            {
                "name": "Total damages dealt",
                "value": gameStats.damages,
                "inline": true
            }
        ],
        "author": {
            "name": `${gameStats.userName} [${gameStats.wins}W - ${gameStats.losses}L] (${Math.ceil((gameStats.wins / (gameStats.wins + gameStats.losses)) * 100)}%)`,
            "icon_url": gameStats.profileIcon
        },
        "footer": {
            "text": "Lol bully • 0.0.1",
            icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png"
        },
        "timestamp": new Date().toISOString(),
        "thumbnail": {
            "url": `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/champion/${gameStats.champion}.png`,
        }
    }
}


class DiscordWrapper {
    private webhook: string = 'https://discord.com/api/webhooks/944165432657600562/JBd8D6qpT9T5wNlILdqiBG4wbd_xhUDPcHNTj9bQmsldMCiGv8B4iBKPswPpcq2kQv0X';

    private token: string;

    constructor(token: string, publicWebhook: string) {
        this.token = token;
        this.webhook = publicWebhook;
    }

    public submitWebhook(gameStats: GameStats) {
        got.post(this.webhook, {
            headers: {
                'content-type': 'application/json'
            },
            json: {
                content: null,
                embeds: [generateWebhookPayload(gameStats)]
            },
            throwHttpErrors: false
        });
    }
}

export { DiscordWrapper };