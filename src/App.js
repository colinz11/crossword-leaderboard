import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Profile from './Profile';

import { fetchDataAll } from './client-api';
import Leaderboard from './Leaderboard';
import Home from './Home';


const tokens = [
  ["Colin", "0^CBcSMQizwLasBhDCuoKwBhoSMS0p3qjz5vf4Fz2d_S43eM3UINTnn1UqAh5DOOWpw40GQgAaQNZtY-5GLEQb5tvokCaVEvkevmpJcl7ZuKEuKK08FZWkeKKrm-MKjRJ-Qb1gSRvEdYxZevR8y18XYjm-KkU_FQo="],
  ["Praj", "0^CBcSMQjb1vyvBhDT1_yvBhoSMS3hwYLMUI1Hzx-FsEWm2pwPIJr84jMqAgACOLnDvfEFQgAaQJ-0oo4Anna2vmgMklap9U-TzLSoeuiGf2zpJnc9rrK4fuY1L27uS45_QBuBsQB6Lh5UXkU-9ay9jzTZi-7_IA0="],
  ["Jaewon", "0^CBcSLQjJxZOwBhDBxpOwBhoSMS3PCxGmDayQy0HQZdmE_KkzIPTcsWs4wIDiqwZCABpAQhQBmTIDLxm1dsyVx1m32pea4DQRSJIgFHWP4WE-0suvpLAqHmAPEiISjQ_Qc5pQXfLaBTS93zJFWU_Mru7eBQ=="],
  ["Zach", "0^CBcSMQi_vpOwBhC3v5OwBhoSMS2Q417u0YaY2-lAQuv38vBOIIiumUUqAgACOOXOz_sFQgAaQFTHuHZqawTT8VQ04yk6OvHLHsRB7JLwV_hIoKwmLN001hcZLZCMpYSl8pRewraRc51oy1V6pG81m3IR12USRgA="],
  ["Allison", "0^CBcSMQj1xMGvBhD1vpOwBhoSMS1wUDTSbnr4sr_rOovoHoh-IIuL7VIqAh5BOPOk0ooGQgAaQIAaFiz96VUWurmtkySNKosytXRrXHetKmkDQHZeGGaPbClJZ41a2bYCNWcPSWIAh3pxd4ng8ePVOdmxpoZaBQY="],
  ["Amanda", "0^CBcSMQjg_8KnBhC5wZOwBhoSMS0makmeaBAJKmTMU-qEV9M8IPaK7VIqAh5BOOyk0ooGQgAaQKpwdPK3haAemKRkn04VEU3lMTdev3AdWKIBdWFMSHoJkKAoPQJk2mfiTqCIBmDzZICdxYtbEr86QGVBl_jE4w8="]
]
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all(tokens.map((token) =>
          fetchDataAll(token, "mini")
        ))

        setData(response.flat());

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (

    <BrowserRouter >
      <Routes>
        <Route
          path="/leaderboard"
          element={<Leaderboard data={data} />}
        />
        <Route path="/" element={<Home></Home>}/>
        <Route path="user/:id" element={<Profile data={data}></Profile>}/>
      
      </Routes>
    </BrowserRouter >

  );
}



export default App;
