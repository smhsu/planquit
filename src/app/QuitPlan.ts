export interface QuitPlan {
    tabReductionGoal: number; // Between 0 and 1, where 1 is no reduction and 0 is complete quitting
    minutesReductionGoal: number; // Ditto
    whyReason: string;
    badEffects: string;
    resistUrgePlan: string;
}
