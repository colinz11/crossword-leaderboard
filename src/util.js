import * as d3 from "d3";
import { width } from "./formats";


export let getAverageSolveTime = (data) => {
    var total = 0

    data.forEach(item => {
        total += item.calcs.secondsSpentSolving
    });

    var avg = total / data.length
    return avg
}


export let getAverageSolveTimeByDay = (data) => {

    const sumByDay = {};
    const countByDay = {};


    data.forEach(item => {

        const dayOfWeek = new Date(item.puzzle.print_date).getDay();

        sumByDay[dayOfWeek] = (sumByDay[dayOfWeek] || 0) + item.calcs.secondsSpentSolving;

        countByDay[dayOfWeek] = (countByDay[dayOfWeek] || 0) + 1;
    });


    const averageByDay = {};
    for (const day in sumByDay) {
        averageByDay[day] = sumByDay[day] / countByDay[day];
    }

    return averageByDay;
};

export let filterAndSortByDateAndTime = (adjusted, date) => {
    return adjusted
        .filter((d) => d.puzzle.print_date === date)
        .sort((a, b) => a.calcs.secondsSpentSolving - b.calcs.secondsSpentSolving);
}

export let filterByUserID = (adjusted, userID) => {
    return adjusted
        .filter((d) => d.userID == userID)
}

export let adjustData = (data) => {
    const confusing = new Set(["revealed", "timerReset"]);
    return data
        .filter((d) => !Object.keys(d.firsts).some((s) => confusing.has(s)))
        .map((d) => {
            const delta =
                d.calcs.secondsSpentSolving - d3.max(d.board.cells, (c) => c.timestamp);
            return {
                ...d,
                board: {
                    cells: d.board.cells.map((c) =>
                        c.blank
                            ? c
                            : {
                                ...c,
                                timestamp: c.timestamp + delta
                            }
                    )
                }
            };
        });
}

export let calculateTodayOverTime = (today) => {
    return today.flatMap(({ name, board: { cells } }) =>
        d3.range(0, d3.max(cells, (c) => c.timestamp) + 1).map((seconds) => ({
            name,
            seconds,
            cells: cells.filter((c) => c.timestamp <= seconds).length
        }))
    );
}

export let calculateMaxTime = (today) => {
    return Math.min(
        d3.max(
            today.flatMap((d) => d.board.cells),
            (d) => d.timestamp
        ),
        240 // guard against real epoch-based timestamps
    ) + 1;
}


export let getRanks = (data) => {
    return d3.rollup(
        data,
        (r) =>
            r
                .sort((a, b) => a.calcs.secondsSpentSolving - b.calcs.secondsSpentSolving)
                .map((d, i) => ({ ...d, rank: i + 1 })),
        (d) => d.puzzle.print_date
    )
}

export let getTrailing = (ranks, date) => {
    const dates = getPreviousNDays(date, 10);
    return dates
        .flatMap((d) => ranks.get(d)) // Fetch values for each date from the map
        .filter((d) => d);
};

function getPreviousNDays(dateString, n) {
    const date = new Date(dateString);
    const dates = [];

    for (let i = 0; i < n; i++) {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - i - 1); // Subtract i + 1 days to get previous days
        const formattedDate = prevDate.toISOString().split('T')[0]; // Get date in "YYYY-MM-DD" format
        dates.push(formattedDate);
    }

    return dates;
}

export let getCompetitiveRanks = (ranks) => {
    return Array.from(ranks.values()).filter(r => r.length > 1).flat()
}

export let getCounts = (competitiveRanks) => {
    return d3.rollup(
        competitiveRanks,
        (r) => r.length,
        (d) => d.name
    );
}

export let getDayRanks = (data) => {

    return Array.from(
        d3
            .rollup(
                data,
                (r) =>
                    r
                        .sort(
                            (a, b) => a.calcs.secondsSpentSolving - b.calcs.secondsSpentSolving
                        )
                        .map((d, i) => ({
                            ...d,
                            day: d.date.getUTCDay(),
                            rank: i + 1
                        }))
                        .slice(0, Math.floor(width / 7 / 30)),
                (d) => d.date.getUTCDay()
            )
            .values()
    ).flat()
}
