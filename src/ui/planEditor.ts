import { getPlan, setPlan } from "../app/QuitPlan";

/**
 * Renders the plan editor UI in a specified HTML element.
 * 
 * @param {HTMLElement} element - the element to append the plan editor UI to
 */
function renderPlanEditor(element: HTMLElement) {
    // read plan from storage, it will be of type QuitPlan
    // render UI to read and edit.
    const plan = getPlan();
    setPlan(plan);
}
