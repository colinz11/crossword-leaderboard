import React, { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import RaceBoards from './Plots/RaceBoards';
import Racelines from './Plots/Racelines';
import CountBars from './Plots/CountBars';
import BoxPlot from './Plots/Boxplot';
import { adjustData } from './util';
import Ranks from './Plots/Ranks';
import { names } from './formats';
import DayRanks from './Plots/DayRanks';
import DayCountLines from './Plots/DayCountLines';
import ScrubberComponent from './Plots/Scrubber';
import { filterAndSortByDateAndTime, calculateMaxTime } from './util';
import Domain from './Plots/Domain';

const Leaderboard = ({ data }) => {
    const [value, setValue] = useState(0);
    const [state, setState] = useState('None');

    if (!data) {
        return <p>Loading ...</p>; // Handle loading state
    }
    const date = "2024-03-27"
    const adjusted = adjustData(data);
    const today = filterAndSortByDateAndTime(adjusted, date);
    const maxTime = calculateMaxTime(today);

    return (
        <div className="profile" style={styles.container}>
            <h1 style={styles.header}>Crossword Stats</h1>
            <ScrubberComponent value={value} setState={setState} setValue={setValue} max={maxTime}></ScrubberComponent>
            <Racelines adjusted={adjusted} date={date} ts={value}></Racelines>
            <RaceBoards adjusted={adjusted} date={date} ts={value}></RaceBoards>
            <CountBars adjusted={adjusted} names={names}></CountBars>
            <BoxPlot adjusted={adjusted} names={names}></BoxPlot>
            <Domain adjusted={adjusted} names={names}></Domain>
            <Ranks adjusted={adjusted} names={names}></Ranks>
            <DayRanks adjusted={adjusted}></DayRanks>
            <DayCountLines adjusted={adjusted} names={names}></DayCountLines>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        textAlign: 'center',
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px'
    }
};

export default Leaderboard;
