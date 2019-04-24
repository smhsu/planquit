const BLOCK_TIMES_KEY = "blockTimes";

export enum BlockMode {
    alwaysOn,
    alwaysOff,
    scheduled
}

interface BlockConfig {
    mode: BlockMode;
    schedule: {
        daysOfWeek: number[];
        startHour: number;
        startMinute: number;
        endHour: number;
        endMinute: number;
    };
}

const DEFAULT_PLAN = {
    mode: BlockMode.scheduled,
    schedule: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0
    }
};

export function getBlockConfig(): BlockConfig {
    const data = window.localStorage.getItem(BLOCK_TIMES_KEY);
    return data ? JSON.parse(data) : DEFAULT_PLAN;
}

export function setBlockConfig(config: BlockConfig) {
    window.localStorage.setItem(BLOCK_TIMES_KEY, JSON.stringify(config));
}

export function isBlockingActive() {
    const config = getBlockConfig();
    switch (config.mode) {
        case BlockMode.alwaysOn:
            return true;
        case BlockMode.scheduled:
            const now = new Date();
            const {daysOfWeek, startHour, startMinute, endHour, endMinute} = config.schedule;
            const startTime = new Date();
            startTime.setHours(startHour);
            startTime.setMinutes(startMinute);
            const endTime = new Date();
            endTime.setHours(endHour);
            endTime.setMinutes(endMinute);
            return (daysOfWeek.indexOf(now.getDay()) !== -1 && startTime <= now && now < endTime);
        case BlockMode.alwaysOff:
        default:
            return false;
    }
}
