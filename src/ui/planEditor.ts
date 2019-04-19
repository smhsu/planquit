import { getPlan, setPlan } from "../app/QuitPlan";

/**
 * Renders the plan editor UI in a specified HTML element.
 * 
 * @param {HTMLElement} element - the element to append the plan editor UI to
 */
export function renderPlanEditor(element: HTMLElement) {
    // read plan from storage, it will be of type QuitPlan
    // render UI to read and edit.
    const plan = getPlan();
    setPlan(plan);
    console.log(plan);

    element.innerHTML = "Edit your plan: <br><br>";
    
    var tabsElement = document.createElement("div");
    var tabsSlider = <HTMLInputElement>document.createElement("input");
    tabsSlider.setAttribute("type", "range");
    //tabsSlider.value = "" + plan.tabReductionGoal;
    tabsSlider.value = "33";
    tabsElement.innerText = "Tabs to reduce\n";
    tabsElement.appendChild(tabsSlider);
    element.appendChild(tabsElement);


    var timeElement = document.createElement("div");
    var timeSlider = <HTMLInputElement>document.createElement("input");
    timeSlider.setAttribute("type", "range");
    //timeSlider.value = "" + plan.minutesReductionGoal;
    timeSlider.value = "22";
    console.log(timeSlider.value);
    timeElement.innerText = "\nTime to reduce\n";
    timeElement.appendChild(timeSlider);
    element.appendChild(timeElement);

    var timeConf = document.createElement("input");

    
    var whyReason = document.createElement("div");
    var whyReasonInput = <HTMLInputElement>document.createElement("input");
    whyReasonInput.value = plan.whyReason;
    whyReason.innerText = "\nWhy do you want to quit?\n";
    whyReason.appendChild(whyReasonInput);
    element.appendChild(whyReason);

    var badEffects = document.createElement("div");
    var badEffectsInput = <HTMLInputElement>document.createElement("input");
    badEffectsInput.value = plan.badEffects;
    badEffects.innerText = "\nBad Effects?\n";
    badEffects.appendChild(badEffectsInput);
    element.appendChild(badEffects);

    var resistUrge = document.createElement("div");
    var resistUrgeInput = <HTMLInputElement>document.createElement("input");
    resistUrgeInput.value = plan.resistUrgePlan;
    resistUrge.innerText = "\nYour plan to resist urge?\n";
    resistUrge.appendChild(resistUrgeInput);
    element.appendChild(resistUrge);

    var newLine = document.createElement("div");
    newLine.innerText = "\n";
    element.appendChild(newLine);

    var savePlanButton = <HTMLButtonElement>document.createElement('button');
    savePlanButton.textContent = "Save Plan";
    savePlanButton.onclick = function() {
        console.log(tabsSlider.value);
        plan.tabReductionGoal = +tabsSlider.value;
        plan.minutesReductionGoal = +timeSlider.value;
        plan.resistUrgePlan = resistUrgeInput.value;
        plan.badEffects = badEffectsInput.value;
        plan.whyReason = whyReasonInput.value;
        console.log(plan);
        setPlan(plan);
    }
    element.appendChild(savePlanButton);
}
