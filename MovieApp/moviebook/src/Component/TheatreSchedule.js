import React from 'react';
import "../assets/theaterSchedule.css";
import Navbar from './Nav';
import theaterImage from "../assets/banner04.jpg";
import { useNavigate,useParams } from "react-router-dom";


const TheaterSchedule = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const scheduleData = [
    { id: 1, theater: 'GENESIS CINEMA', timings: ['10:00 AM', '2:00 PM', '6:00 PM'] },
    { id: 2, theater: 'THE BEACH', timings: ['11:00 AM', '3:00 PM', '7:00 PM'] },
    { id: 3, theater: 'WANTED', timings: ['12:00 PM', '4:00 PM', '8:00 PM'] },
    { id: 4, theater: 'LA MER', timings: ['1:00 PM', '5:00 PM', '9:00 PM'] },
    { id: 5, theater: 'BOX PARK', timings: ['2:00 PM', '6:00 PM', '10:00 PM'] },
    { id: 6, theater: 'CITY WORK', timings: ['3:00 PM', '7:00 PM', '11:00 PM'] },
  ];

  const handleTimingsClick = (theaterId, timing) => {

    const url = `/seatbook/${movieId}/${theaterId}/${timing}`;
    
    
    navigate(url);
  };


return (
  <div className="theater-schedule-container">
    <Navbar />
    <div className="theater-image-container">
      <img src={theaterImage} alt="Theater Image" />
      <h1 className="theater-schedule-text" style={{ marginTop: '20px', marginBottom: '10px' }}>
        Theater Schedule
      </h1>
    </div>
    {movieId}

    <table className="schedule-table">
      <thead>
        <tr>
          <th>Theater</th>
          <th>Timings</th>
        </tr>
      </thead>
      <tbody>
        {scheduleData.map(({ id, theater, timings }) => (
          <tr
            key={id}
            className="schedule-row"
            onClick={() => handleTimingsClick(id, timings)}
          >
            <td className="theater-name">{theater}</td>
            <td className="movie-timings">{timings.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
        }
export default TheaterSchedule;
