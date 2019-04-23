const BLOCK_EFFECTIVENESS_KEY = "ignoreStats";

/**
 * Statistics on how effective our blocking is.
 */
interface BlockEffectiveness {
    success: {url: string, time: number}[]; // Times when blocking was successful
    ignored: {url: string, time: number, reason: string}[]; // Times when blocking was ignored
}

function getBlockEffectiveness(): BlockEffectiveness {
    const data = window.localStorage.getItem(BLOCK_EFFECTIVENESS_KEY);
    return data ? JSON.parse(data) : {success: [], ignored: []};
}

function setBlockEffectiveness(stats: BlockEffectiveness) {
    window.localStorage.setItem(BLOCK_EFFECTIVENESS_KEY, JSON.stringify(stats));
}

export function logBlockEffective(url: string) {
    const stats = getBlockEffectiveness();
    stats.success.push({url, time: Date.now()});
    setBlockEffectiveness(stats);
}

export function logBlockIgnored(url: string, reason: string) {
    const stats = getBlockEffectiveness();
    stats.ignored.push({url, reason, time: Date.now()});
    setBlockEffectiveness(stats);
}
