import React from 'react';
import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from 'react';
import { color, width, tickFormat } from '../formats';

const Domain = ({ adjusted, names }) => {
    const containerRef = useRef();
    const withinDomain = adjusted.filter(
        (d) => d.calcs.secondsSpentSolving <= 270
    );
    useEffect(() => {
        const plot = Plot.plot({
            marks: [
                Plot.rect(
                    withinDomain,
                    Plot.binX(
                        { fillOpacity: "count" },
                        {
                            x: (d) => d.calcs?.secondsSpentSolving,
                            thresholds: width / 5,
                            fill: "name"
                        }
                    )
                )
            ],
            facet: { data: withinDomain, y: "name", marginLeft: 45 },
            x: {
                domain: [0, 240],
                ticks: [15, 30, 45, 60, 90, 120, 150, 180, 240],
                tickFormat,
                grid: true
            },
            fy: { label: null, domain: names },
            color: { ...color },
            opacity: { domain: [0, 8] },
            width,
            marginTop: 0
        });
        containerRef.current.append(plot);
        return () => plot.remove();
    }, []);
    return <div ref={containerRef} />;
}

export default Domain;