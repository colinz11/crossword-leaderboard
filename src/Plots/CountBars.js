import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { color, colWidth } from '../formats';



function CountBars({ adjusted, names }) {
  const containerRef = useRef();

  useEffect(() => {
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
        domain: [0, 800],
        axis: "top"
      },
      y: { label: null, domain: names },
      marginTop: 35,
      marginRight: 30,
      marginBottom: 0,
      marginLeft: 45,
      width: colWidth + 60
    });

    // Append the plot to the container element
    containerRef.current.appendChild(countBars);

    // Remove the plot when the component unmounts
    return () => {
      countBars.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}

export default CountBars;
