import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactTooltip from "react-tooltip";
import { SiteLog } from "../app/SiteLog";
import { OpenInterval } from "../app/OpenInterval";
import { queryBlockStatsByTime } from "../app/blockEffectiveness";

const MS_IN_ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function queryLogByTimeRange(timeRange: OpenInterval) {
    const log = new SiteLog().getData();
    return log.filter(visit => {
        const visitTime = new OpenInterval(visit.startTime, visit.endTime);
        return visitTime.hasOverlap(timeRange);
    });
}

function getStatsForTimeRange(timeRange: OpenInterval) {
    const logForRange = queryLogByTimeRange(timeRange);
    const blockEffectiveness = queryBlockStatsByTime(timeRange);
    return {
        timeSpent: _.sumBy(logForRange, entry => entry.endTime - entry.startTime),
        contextSwitches: logForRange.length,
        urgesResisted: blockEffectiveness.success.length,
        blocksIgnored: blockEffectiveness.ignored
    };
}

function formatDuration(milliseconds: number) {
    const seconds = milliseconds / 1000;
    if (seconds < 90) {
        return `${Math.round(seconds)}s`;
    }

    const minutes = seconds / 60;
    if (minutes < 90) {
        return `${Math.round(minutes)} min`;
    }

    const hours = minutes / 60;
    return `${Math.round(hours)} hrs`;
}

function ProgressPane(props: {}) {
    const now = Date.now();
    const timeRange14DaysAgo = new OpenInterval(now - MS_IN_ONE_WEEK - MS_IN_ONE_WEEK, now - MS_IN_ONE_WEEK);
    const timeRange7DaysAgo = new OpenInterval(now - MS_IN_ONE_WEEK, now);
    const statsCol1 = getStatsForTimeRange(timeRange14DaysAgo);
    const statsCol2 = getStatsForTimeRange(timeRange7DaysAgo);

    const col1Reasons = statsCol1.blocksIgnored.map(entry => entry.reason);
    const col2Reasons = statsCol2.blocksIgnored.map(entry => entry.reason);
    const ignoreReasons = col1Reasons.concat(col2Reasons);

    return <div>
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>14 to 7 days ago</th>
                    <th>Past 7 days</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <RowHeader
                        content="Time spent"
                        explanation="Time spent on blacklist sites"
                    />
                    <td>{formatDuration(statsCol1.timeSpent)}</td>
                    <td>{formatDuration(statsCol2.timeSpent)}</td>
                </tr>
                <tr>
                    <RowHeader
                        content="Number of navigations"
                        explanation="Number of times you opened or switched to tabs displaying blacklist sites"
                    />
                    <td>{statsCol1.contextSwitches}</td>
                    <td>{statsCol2.contextSwitches}</td>
                </tr>
                <tr>
                    <RowHeader
                        content="Urges resisted"
                        explanation="Number of times you avoided continuing after seeing the block screen"
                    />
                    <td>{statsCol1.urgesResisted}</td>
                    <td>{statsCol2.urgesResisted}</td>
                </tr>
                <tr>
                    <RowHeader
                        content="Blocks ignored"
                        explanation="Number of times you ignored the block screen and continued"
                    />
                    <td>{statsCol1.blocksIgnored.length}</td>
                    <td>{statsCol2.blocksIgnored.length}</td>
                </tr>
            </tbody>
        </table>
        <div>
            <p>Reasons you ignored blocks in the past 14 days (most recent first):</p>
            <ul style={{color: "red"}}>
                {ignoreReasons.reverse().map((reason, i) => <li key={i}>"{reason}"</li>)}
            </ul>
        </div>
    </div>;
}

let nextTooltipId = 0;
function RowHeader(props: {content: string, explanation?: string}) {
    const {content, explanation} = props;
    const dataTip = "explanation" + nextTooltipId;
    nextTooltipId++;
    return <td>
        {content} {explanation && <i className="fa fa-question-circle" data-tip data-for={dataTip}></i>}
        {explanation && <ReactTooltip id={dataTip} effect="solid" place="bottom">
            <div style={{maxWidth: 150}}>{explanation}</div>
        </ReactTooltip>
        }
    </td>;
}

ReactDOM.render(<ProgressPane />, document.getElementById("root"));
