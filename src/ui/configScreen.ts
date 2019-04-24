import * as moment from "moment";

const TIME_FORMAT = "hh:mm a";

function parseTime(time: string) {
    const parsed = moment.utc(this.startTime, TIME_FORMAT);
    return {
        hours: parsed.hours(),
        minutes: parsed.minutes()
    };
}

/**
 * Renders the config screen. 
 * 
 * @param {HTMLElement} element - the element to append the plan editor UI to
 */

 export function renderConfigScreen(element: HTMLElement) {
     element.innerHTML = '<strong><br>When do you want active discouragement?</strong><br>We will put up a warning screen when you visit a site that you want to visit less. <br><br>';
    
     var form = document.createElement("FORM");
     element.appendChild(form);

     var alwaysRadio = <HTMLInputElement>document.createElement("INPUT");
     alwaysRadio.setAttribute("type", "radio");
     alwaysRadio.setAttribute("name", "config");
     alwaysRadio.setAttribute("value", "always");
     alwaysRadio.setAttribute("id", "always");
     var alwaysLabel = document.createElement("label");
     alwaysLabel.setAttribute("for", "always");
     alwaysLabel.appendChild(alwaysRadio);
     alwaysLabel.appendChild(document.createTextNode("Always"));
     alwaysLabel.appendChild(document.createElement("br"));
     form.appendChild(alwaysLabel);

     var scheduledRadio = <HTMLInputElement>document.createElement("input");
     scheduledRadio.setAttribute("type", "radio");
     scheduledRadio.setAttribute("name", "config");
     scheduledRadio.setAttribute("value", "scheduled");
     scheduledRadio.setAttribute("id", "scheduled");
     var scheduledLabel = document.createElement("label");
     scheduledLabel.setAttribute("for", "scheduled");
     scheduledLabel.appendChild(scheduledRadio);
     scheduledLabel.appendChild(document.createTextNode("Scheduled"));
     scheduledLabel.appendChild(document.createElement("br"));
     form.appendChild(scheduledLabel);

     var manualRadio = <HTMLInputElement>document.createElement("input");
     manualRadio.setAttribute("type", "radio");
     manualRadio.setAttribute("name", "config");
     manualRadio.setAttribute("value", "manual");
     var manualLabel = document.createElement("label");
     manualLabel.setAttribute("for", "manual");
     manualLabel.appendChild(manualRadio);
     manualLabel.appendChild(document.createTextNode("Manual Control"));
     manualLabel.appendChild(document.createElement("br"));
     form.appendChild(manualLabel);
 }