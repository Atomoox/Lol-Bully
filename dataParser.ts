import { Account, UserStats, GameTypes, FormattedStats } from './types';

const rankCalc = (division: string, rank: string) => {
    let score: number = 0;
    switch (rank) {
        case 'IRON':
            score += 10
            break;
        case 'BRONZE':
            score += 20
            break;
        case 'SILVER':
            score += 30
            break;
        case 'GOLD':
            score += 40
            break;
        case 'PLATINIUM':
            score += 50
            break;
        case 'DIAMOND':
            score += 60
            break;
        case 'MASTER':
            score += 70
            break;
        case 'GRANDMASTER':
            score += 80
            break;
        case 'CHALLENGER':
            score += 90
            break;
    }

    switch(division) {
        case 'I':
            score += 1;
            break;
        case 'II':
            score += 2;
            break;
        case 'III':
            score += 3;
            break;
        case 'IV':
            score += 4;
            break;
    }
    return score;
}


const parseUserData = (stats: UserStats[]): FormattedStats | null => {
    const soloDuoDatas = stats.find(x => x.queueType === GameTypes.RankedSoloDuo);
    if (!soloDuoDatas)
        return null;
    return {
        lp: soloDuoDatas.leaguePoints,
        wins: soloDuoDatas.wins,
        losses: soloDuoDatas.losses,
        rank: `${soloDuoDatas.tier} ${soloDuoDatas.rank}`
    };
}

export { parseUserData };