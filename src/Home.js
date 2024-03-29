import React, { useState, Component } from 'react';
import { Link } from "react-router-dom";


const Home = () => {
    return (
        <div className="home">
            <h1>hello world</h1>
            <Link to="/Leaderboard">Leaderboard</Link>
        </div>
    );
};



export default Home;
