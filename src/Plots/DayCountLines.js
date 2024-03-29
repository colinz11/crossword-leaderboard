import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import * as Plot from '@observablehq/plot';
import { color, tickFormat, frame, width } from '../formats';

function DayCountLines({ adjusted, names }) {
    const containerRef = useRef();
    const daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    useEffect(() => {
        const plot = Plot.plot({
            color,
            marks: [
                Plot.tickX(adjusted, {
                    x: (d) => d.calcs.secondsSpentSolving,
                    stroke: "name"
                }),
                frame
            ],
            facet: {
                data: adjusted,
                y: "name",
                x: (d) => d.date.getUTCDay(),
                marginLeft: 45
            },
            fx: { tickFormat: (d) => daysWeek[d], label: null },
            x: { domain: [0, 240], ticks: [0, 30, 60, 120, 180], tickFormat, clamp: true },
            fy: { label: null, domain: names },
            width,
            marginRight: 0
        });
        containerRef.current.appendChild(plot);

        return () => {
            plot.remove();
        };
    }, []);
    return <div ref={containerRef} />;
}

export default DayCountLines;
