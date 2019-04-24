import * as $ from "jquery";
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
     element.innerHTML = '<br><strong>When do you want active discouragement?</strong><br>We will put up a warning screen when you visit a site that you want to visit less. <br><br>';
    
     var form = document.createElement("div");
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

     var neverRadio = <HTMLInputElement>document.createElement("input");
     neverRadio.setAttribute("type", "radio");
     neverRadio.setAttribute("name", "config");
     neverRadio.setAttribute("value", "never");
     neverRadio.setAttribute("id", "never");
     var neverLabel = document.createElement("label");
     neverLabel.setAttribute("for", "never");
     neverLabel.appendChild(neverRadio);
     neverLabel.appendChild(document.createTextNode("Never"));
     neverLabel.appendChild(document.createElement("br"));
     form.appendChild(neverLabel);

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


     var scheduledTime = document.createElement("div");
     var fromTime = <HTMLInputElement>document.createElement("input");
     var toTime = <HTMLInputElement>document.createElement("input");
     fromTime.setAttribute("type", "time");
     toTime.setAttribute("type", "time");
     scheduledTime.appendChild(fromTime);
     scheduledTime.appendChild(toTime);
     scheduledTime.hidden = !scheduledRadio.checked;
     scheduledLabel.appendChild(scheduledTime);
     form.appendChild(scheduledLabel);

    $('input[type="radio"]').bind('click', function(){
        // Processing only those that match the name attribute of the currently clicked button...
        $('input[name="' + $(this).attr('name') + '"]').not($(this)).trigger('deselect'); // Every member of the current radio group except the clicked one...
    });
    
    $('input[type="radio"]').bind('deselect', function(){
        var id = ($(this).attr('id'));
        if (id == "scheduled") {
            scheduledTime.hidden = true;
        }
    });

    $('#scheduled').click(function() {
        scheduledTime.hidden = false;
    });
 }
 