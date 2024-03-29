import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import * as Plot from '@observablehq/plot';
import { color, ordinalSuffix, tickFormat, frame, width } from '../formats';
import { getDayRanks } from '../util';

function DayRanks({ adjusted }) {
    const containerRef = useRef();
    const daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    useEffect(() => {
        const dateFormat = d3.utcFormat("%b %-d");
        const dayRanks = getDayRanks(adjusted);
        const plot = Plot.plot({
            marks: [
                Plot.barY(dayRanks, {
                    x: "rank",
                    y: (d) => d.calcs.secondsSpentSolving,
                    fill: "name"
                }),
                Plot.text(dayRanks, {
                    x: "rank",
                    y: (d) => d.calcs.secondsSpentSolving,
                    title: (d) => `${d.name} • ${dateFormat(d.date)}`,
                    text: (d) => `${d.name} • ${dateFormat(d.date)}`,
                    textAnchor: "start",
                    dx: 6,
                    rotate: -90,
                    fill: "white"
                }),
                Plot.text(dayRanks, {
                    x: "rank",
                    y: (d) => d.calcs.secondsSpentSolving,
                    text: (d) => tickFormat(d.calcs.secondsSpentSolving),
                    dy: 11
                }),
                frame
            ],
            facet: { data: dayRanks, x: "day" },
            fx: { tickFormat: (d) => daysWeek[d], label: null },
            x: { tickFormat: ordinalSuffix, label: null },
            y: {
                tickFormat,
                grid: true,
                reverse: true,
                insetBottom: 15
            },
            color,
            width,
            height: 250,
            marginLeft: 45,
            marginRight: 0
        }); 
        containerRef.current.appendChild(plot);

        return () => {
            plot.remove();
        };
    }, []);
    return <div ref={containerRef} />;
}

export default DayRanks;