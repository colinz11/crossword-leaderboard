import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { color, tickFormat, width } from '../formats';


function BoxPlot({ adjusted, names }) {
    const containerRef = useRef();

    useEffect(() => {
        const plot = Plot.plot({
            marks: [
                Plot.boxX(adjusted, {
                    x: (d) => d.calcs.secondsSpentSolving,
                    y: "name",
                    fill: "name",
                    stroke: "#333",
                    strokeWidth: 1,
                    r: 0.5
                })
            ],
            y: { label: null, domain: names },
            x: {
                domain: [0, 240],
                ticks: [15, 30, 45, 60, 90, 120, 150, 180, 240],
                tickFormat: tickFormat,
                grid: true
            },
            color,
            width,
            marginLeft: 45,
            marginTop: 0
        });

        // Append the plot to the container element
        containerRef.current.appendChild(plot);

        // Clean up function to remove the plot when the component unmounts
        return () => {
            plot.remove();
        };
    }, []);

    return <div ref={containerRef} />;
}

export default BoxPlot;
