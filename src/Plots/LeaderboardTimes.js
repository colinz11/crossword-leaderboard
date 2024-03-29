import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { color, tickFormat, width } from '../formats';
import { getRanks, getTrailing } from '../util';


function LeaderboardTimes({ adjusted, date, names }) {
  const containerRef = useRef();
  useEffect(() => {
    const ranks = getRanks(adjusted);
    const trailing = getTrailing(ranks, date);
    const plot = Plot.plot({
      marks: [
        Plot.ruleY(trailing, {
          x: (d) => d.calcs.secondsSpentSolving,
          y: "name",
          stroke: "name",
          dx: 50
        }),
        Plot.text(trailing, {
          x: (d) => d.calcs.secondsSpentSolving,
          y: "name",
          fill: "name",
          text: (d) => tickFormat(d.calcs.secondsSpentSolving),
          textAnchor: "start",
          dx: 50
        })
      ],
      facet: { data: trailing, x: (d) => d.date },
      x: { axis: false, range: [0, 25] },
      y: { label: null, domain: names },
      color,
      fx: { type: "time" },
      width,
      height: names.length * 22 + 30,
      marginTop: 0,
      marginLeft: 45,
      marginRight: 0
    })

    containerRef.current.appendChild(plot);

    return () => {
      plot.remove();
    };
  }, []);
  return <div ref={containerRef} />;
}

export default LeaderboardTimes;