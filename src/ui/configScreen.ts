import * as $ from "jquery";
import * as moment from "moment";
import { BlockMode, getBlockConfig, setBlockConfig } from "../app/blockTimes";

const TIME_FORMAT = "hh:mm a";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
const DAYS_CSS_CLASS = "days-of-week";

function makeCheckboxes() {
    const element = $("<div>");
    for (let day of DAYS) {
        const checkbox = $(`<div class="${DAYS_CSS_CLASS}"><input type="checkbox" /> ${day} </div>`);
        element.append(checkbox);
    }
    return element[0];
}

(document.getElementById("scheduler") as HTMLElement).appendChild(makeCheckboxes());

function showHideScheduler() {
    if ($("#scheduled").prop("checked")) {
        $("#scheduler").css("display", "block");
    } else {
        $("#scheduler").css("display", "none");
    }
}

function fillInInputs() {
    const config = getBlockConfig();
    let radioToCheck = $();
    switch (config.mode) {
        case BlockMode.alwaysOn:
            radioToCheck = $("#always");
            break;
        case BlockMode.alwaysOff:
            radioToCheck = $("#never");
            break;
        case BlockMode.scheduled:
            radioToCheck = $("#scheduled");
            break;
        default:
            ;
    }
    radioToCheck.prop("checked", true);
    showHideScheduler();

    const start = moment().hours(config.schedule.startHour).minutes(config.schedule.startMinute);
    const end = moment().hours(config.schedule.endHour).minutes(config.schedule.endMinute);
    $("#from-time").val(start.format("HH:mm"));
    $("#to-time").val(end.format("HH:mm"));

    const daysCheckboxes = $(`.${DAYS_CSS_CLASS} input[type="checkbox"]`);
    for (let checkedIndex of config.schedule.daysOfWeek) {
        (daysCheckboxes[checkedIndex] as HTMLInputElement).checked = true;
    }
}

fillInInputs();
$('input[type="radio"]').click(showHideScheduler);

function parseSchedule() {
    const daysCheckboxes = $(`.${DAYS_CSS_CLASS} input[type="checkbox"]`);
    const daysOfWeek = [];
    for (let i = 0; i < daysCheckboxes.length; i++) {
        if ((<HTMLInputElement> daysCheckboxes[i]).checked) {
            daysOfWeek.push(i);
        }
    }

    if (daysOfWeek.length === 0) {
        throw new Error("Check at least one day");
    }

    const startTime = moment.utc($("#from-time").val(), TIME_FORMAT);
    if (!startTime.isValid()) {
        throw new Error("Enter a valid start time");
    }
    const endTime = moment.utc($("#to-time").val(), TIME_FORMAT);
    if (!endTime.isValid()) {
        throw new Error("Enter a valid end time");
    }

    if (endTime.isSameOrBefore(startTime)) {
        throw new Error("Start time must be before end time");
    }

    return {
        daysOfWeek,
        startHour: startTime.hours(),
        startMinute: startTime.minutes(),
        endHour: endTime.hours(),
        endMinute: endTime.minutes()
    };
}

$("#save").click(() => {
    const config = getBlockConfig();
    if ($("#always").prop("checked")) {
        config.mode = BlockMode.alwaysOn;
    } else if ($("#never").prop("checked")) {
        config.mode = BlockMode.alwaysOff;
    } else {
        config.mode = BlockMode.scheduled;
    }

    if (config.mode === BlockMode.scheduled) {
        try {
            config.schedule = parseSchedule();
        } catch (e) {
            $("#messages").text(e.message).css("color", "red");
            return;
        }
    }

    setBlockConfig(config);
    $("#messages").text("Saved!").css("color", "green");
});
