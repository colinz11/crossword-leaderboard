// Profile.js
import React, { useEffect, useRef, useState } from 'react';
import RaceBoards from './Plots/RaceBoards';
import Racelines from './Plots/Racelines';
import CountBars from './Plots/CountBars';
import BoxPlot from './Plots/Boxplot';
import { adjustData, filterByUserID, filterAndSortByDateAndTime, calculateMaxTime } from './util';
import { useParams } from 'react-router-dom';
import ScrubberComponent from './Plots/Scrubber';


const Profile = ({ data }) => {
    const [value, setValue] = useState(0);
    const [state, setState] = useState('None');

    const { id } = useParams();

    if (!data) {
        return <p>Loading...</p>
    }
    const date = "2024-03-25";
    const adjusted = filterByUserID(adjustData(data), id);
    const today = filterAndSortByDateAndTime(adjusted, date);
    const maxTime = calculateMaxTime(today);
    const names = [adjusted[0].name];
    return (
        <div className="profile">
            <h1>Profile Stats</h1>
            <ScrubberComponent value={value} setState={setState} setValue={setValue} max={maxTime}></ScrubberComponent>
            <Racelines adjusted={adjusted} date={date} ts={value}></Racelines>
            <RaceBoards adjusted={adjusted} date={date} ts={value}></RaceBoards>
            <CountBars adjusted={adjusted} names={names}></CountBars>
            <BoxPlot adjusted={adjusted} names={names}></BoxPlot>
        </div>
    );

};


export default Profile;
