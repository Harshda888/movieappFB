import React from "react";
import { useLocation } from "react-router-dom";



const ConfirmationComponent = () => {
  const location = useLocation();
  const {
    state: { username, selectedSeats, selectedMovie, selectedDate},
  } = location;

  return (
    <div>
      <h1>Confirmation Details</h1>

      <h3>Username: {username}</h3>
      <h3>Selected Seats: {selectedSeats.join(", ")}</h3>
      <h3>Selected Movie: {selectedMovie}</h3>
      <h3>Selected Date: {selectedDate}</h3>
      {/* <h2>Selected Price: {price}</h2> */}
    </div>
  );
};

export default ConfirmationComponent;