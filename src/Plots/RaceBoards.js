import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { color, width, tickFormat } from '../formats';
import { useEffect, useRef, useState } from 'react';
import { filterAndSortByDateAndTime, calculateMaxTime } from '../util';

const RaceBoards = ({ adjusted, date, ts }) => {
  const containerRef = useRef();
  useEffect(() => {
    const today = filterAndSortByDateAndTime(adjusted, date);
    const maxTime = calculateMaxTime(today);
  
    const colorScale = d3.scaleOrdinal(color.domain, color.range);

    // Clear existing plots
    containerRef.current.innerHTML = "";

    // Draw a plot for each person
    today.forEach((person) => {
      const div = document.createElement('div');
      div.style.padding = "10px";
      const h4 = document.createElement('h4');
      h4.style.fontFamily = "var(--sans-serif)";
      h4.style.fontVariant = "small-caps";
      h4.style.color = colorScale(person.name);
      h4.textContent = person.name;
      div.appendChild(h4);
      containerRef.current.appendChild(div);

      // Draw plot for the person
      const plot = draw(div, person.board.cells, ts, maxTime);
      return () => plot.remove();
    });
  }, [ts]);

  return (
    <div ref={containerRef} style={{ display: "flex", flexWrap: "wrap" }}></div>
  );
}

function getRowLength(arrayLength) {
  const root = Math.sqrt(arrayLength);
  if (!(root % 1)) return root;
  return [Math.ceil, Math.floor].find(
    (fn) => !((arrayLength / fn(root)) % 1)
  )(root);
}

function draw(container, cells, timestamp, maxTime) {
  const bandWidth = 27;
  const size = getRowLength(cells.length);
  const x = (d, i) => i % size;
  const y = (d, i) => ~~(i / size);
  const done = d3.max(cells, (d) => d.timestamp) <= timestamp;
  const plot = Plot.plot({
    width: size * bandWidth,
    height: (cells.length / size) * bandWidth,
    marks: [
      Plot.cell(cells, {
        // cells
        x,
        y,
        stroke: "black",
        strokeWidth: 2,
        fill: (d) => (d.timestamp <= timestamp ? d.timestamp : 0),
        fillOpacity: 0.5
      }),
      Plot.cell(cells, {
        // blanks
        x,
        y,
        filter: (d) => d.blank,
        stroke: "black",
        fill: "black"
      }),
      Plot.text(cells, {
        // guess
        x,
        y,
        text: "guess",
        filter: (d) => d.timestamp <= timestamp,
        fill: done ? "black" : "gray",
        fontSize: bandWidth / 2
      })
    ],
    x: { type: "band", axis: false, padding: 0 },
    y: { type: "band", axis: false, padding: 0 },
    color: {
      scheme: "blues",
      domain: [0, maxTime]
    }
  });
  container.appendChild(plot);

}

export default RaceBoards;
