import React from 'react';
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from 'react';
import { filterAndSortByDateAndTime, calculateTodayOverTime, calculateMaxTime } from '../util';
import { color, width, tickFormat } from '../formats';


const Racelines = ({ adjusted, date, ts }) => {
  const containerRef = useRef();
  useEffect(() => {
    const today = filterAndSortByDateAndTime(adjusted, date);
    const maxTime = calculateMaxTime(today);
    const todayOverTime = calculateTodayOverTime(today);
    const maxCells = d3.max(todayOverTime, (d) => d.cells);
    const plot = Plot.plot({
      marks: [
        Plot.ruleY([maxCells], { strokeDasharray: "2 2", stroke: "gray" }),
        Plot.line(todayOverTime, {
          x: "seconds",
          y: "cells",
          stroke: "name",
          filter: (d) => d.seconds <= ts,
          curve: "bump-x",
        }),
        Plot.dot(
          todayOverTime,
          Plot.selectLast({
            x: "seconds",
            y: "cells",
            stroke: "name",
            fill: "white",
            filter: (d) => d.seconds <= ts
          })
        ),
        Plot.text(
          todayOverTime,
          Plot.selectLast({
            x: "seconds",
            y: "cells",
            fill: "name",
            text: "name",
            textAnchor: "start",
            rotate: -45,
            filter: (d) => d.seconds <= ts,
            dx: 6
          })
        ),
      ],
      x: {
        type: "linear",
        ticks: d3.range(0, maxTime, 15),
        tickFormat,
        domain: [0, maxTime],
        label: null
      },
      marginLeft: 70,
      marginTop: 30,
      marginRight: 30,
      width,
      height: maxCells * 8,
      color,
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [ts]);

  return <div ref={containerRef} />
}
export default Racelines;