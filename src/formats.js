import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export const names = ["Colin", "Praj", "Jaewon", "Zach", "Allison", "Amanda"]
export const width = 1000;
export const mobile = width < 480;
export const colWidth = mobile ? width : Math.max(width / 3 - 20, 200);

export const utcParse = d3.utcParse("%Y-%m-%d")
export const utcFormat = d3.utcFormat("%Y-%m-%d")
export const color = Plot.scale({ color: { type: "ordinal", domain: names } })
export const frame = Plot.frame({ stroke: "lightgray" })

export const tickFormat = (d) => {
    const minutes = Math.floor(d / 60);
    const seconds = d % 60;
    return minutes === 0
        ? `${seconds}`
        : seconds === 0
            ? `${minutes}m`
            : `${minutes}:${seconds.toFixed(0).padStart(2, "0")}`;
}

export const ordinalSuffix = (n) => {
    switch (n % 100) {
        case 11:
        case 12:
        case 13:
            return `${n}th`;
    }
    switch (n % 10) {
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
    }
}