import axios from 'axios';
import * as d3 from "d3";

import { utcParse } from './formats';

const fetchData = async (token, type, start, end) => {
  try {
    const response = await axios.get(`http://localhost:9000/?name=${token[0]}&token=${token[1]}&type=${type}&start=${start}&end=${end}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


function generateQuarters() {
  const dateFormat = d3.utcFormat("%Y-%m-%d");
  const starts = d3.utcMonth
    .every(3)
    .range(new Date("2022-01-01"), new Date("2024-03-01"));
  return starts.map((start) =>
    [start, d3.utcDay.offset(d3.utcMonth.offset(start, 3), -1)].map(dateFormat)
  );
}

export const fetchDataAll = async (token, type) => {
  try {
    const quarters = generateQuarters();
    const response = await Promise.all(quarters.map(([start, end]) =>
      fetchData(token, type, start, end)
    ))
    return response.flat().map((puzzle) => ({ ...puzzle, date: utcParse(puzzle.puzzle.print_date)}))
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
