import * as $ from "jquery";
import { getPlan, setPlan } from "../app/QuitPlan";

const whyInput = $("#why-reason");
const badEffectsInput = $("#bad-effects");
const resistUrgeInput = $("#resist-urge");

const plan = getPlan();
whyInput.val(plan.whyReason);
badEffectsInput.val(plan.badEffects);
resistUrgeInput.val(plan.resistUrgePlan);

$("#save").click(() => {
    const plan = getPlan();
    plan.whyReason = whyInput.val() as string;
    plan.badEffects = badEffectsInput.val() as string;
    plan.resistUrgePlan = resistUrgeInput.val() as string;
    setPlan(plan);
    window.history.back();
});
