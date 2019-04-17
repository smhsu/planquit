const PLAN_STORAGE_KEY = "PLAN";

export interface QuitPlan {
    tabReductionGoal: number; // Between 0 and 1, where 1 is no reduction and 0 is complete quitting
    minutesReductionGoal: number; // Ditto
    whyReason: string;
    badEffects: string;
    resistUrgePlan: string;
}

export function getPlan(): QuitPlan {
    const data = window.localStorage.getItem(PLAN_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    } else {
        return {
            tabReductionGoal: 1,
            minutesReductionGoal: 1,
            whyReason: "",
            badEffects: "",
            resistUrgePlan: ""
        };
    }
}

export function setPlan(plan: QuitPlan) {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}
