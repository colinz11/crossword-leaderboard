import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { color, ordinalSuffix, mobile, colWidth } from '../formats';
import { getRanks, getCompetitiveRanks, getCounts } from '../util';

function Ranks({ adjusted, names }) {
    const containerRef = useRef();
    useEffect(() => {
        const ranks = getRanks(adjusted);
        const competitiveRanks = getCompetitiveRanks(ranks);
        const counts = getCounts(competitiveRanks);
        const countBars = Plot.plot({
            color,
            marks: [
              Plot.barX(
                adjusted,
                Plot.groupY({ x: "count" }, { y: "name", fill: "name" })
              ),
              Plot.text(
                adjusted,
                Plot.groupY(
                  { x: "count", text: "count" },
                  { y: "name", textAnchor: "start", dx: 4 }
                )
              )
            ],
            x: {
              label: "Minis completed",
              labelAnchor: "center",
              labelOffset: 35,
              domain: [0, 365],
              axis: "top"
            },
            y: { label: null, domain: names },
            marginTop: 35,
            marginRight: 30,
            marginBottom: 0,
            marginLeft: 45,
            width: colWidth + 60
          });

        const plot = Plot.plot({
            marks: [
                Plot.dot(
                    competitiveRanks,
                    Plot.group(
                        { r: (d) => d.length / (counts.get(d[0].name) || 1) },
                        {
                            y: "name",
                            x: "rank",
                            stroke: "name"
                        }
                    )
                )
            ],
            color,
            
            y: {
                ...countBars.scale("y"),
                tickSize: mobile ? undefined : 0,
                grid: true
            },
            x: {
                type: "band",
                tickFormat: ordinalSuffix,
                label: "How often each person ranks in each place",
                labelOffset: 35,
                axis: "top"
            },
            r: { range: [0, 12] },
            width: colWidth,
            marginTop: 35,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: mobile ? 45 : 0
        });
        // Append the plot to the container element
        containerRef.current.appendChild(plot);

        return () => {
            plot.remove();
        };
    }, []);
    return <div ref={containerRef} />;
}

export default Ranks;
