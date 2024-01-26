import React, { useState } from "react";
import "../assets/set.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import Navbar from "./Nav";
// import ConfirmationComponent from "./UserDetails";


const SeatBooking = () => {


  const [seatAvailability, setSeatAvailability] = useState([
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ]);

  // Placeholder selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Function to handle seat selection
  const handleSeatClick = (rowIndex, seatIndex) => {
    if (seatAvailability[rowIndex][seatIndex] === 1) {
      const seat = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
      if (!selectedSeats.includes(seat)) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        setSelectedSeats(
          selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
        );
      }
    }
  };
  const navigate = useNavigate();


  const redirectToConfirmation = () => {
    navigate(`/confirmation/${movieId}/${theatreId}/${timing}`, {
      state: {
        username: sessionStorage.getItem('username'),
        selectedSeats,
        selectedMovie: movieId,
        selectedDate: '2024-01-27', 
      },
    });
  };
  
  const renderSeats = () => {
    return seatAvailability.map((row, rowIndex) => (
      <div key={rowIndex} className="seat-row">
        {row.map((seat, seatIndex) => (
          <div
            key={seatIndex}
            className={`seat ${seat === 1 ? "available" : "unavailable"} ${
              selectedSeats.includes(
                `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`
              )
                ? "selected"
                : ""
            }`}
            onClick={() => handleSeatClick(rowIndex, seatIndex)}
          >
            {seat === 1 ? (
              <img
                src={require("../assets/seat01.png")}
                alt={`Seat ${String.fromCharCode(65 + rowIndex)}${
                  seatIndex + 1
                }`}
              />
            ) : (
              <img
                src={require("../assets/seat01-free.png")}
                alt="Unavailable Seat"
              />
            )}
          </div>
        ))}
      </div>
    ));
  };
  const { movieId, theatreId, timing } = useParams();
  console.log(movieId, theatreId, timing, "data");
  const confirmBooking = async () => {
    try {
      const apiUrl = 'http://127.0.0.1:8000/api/movies/book-seat/';
      

const storedToken = sessionStorage.getItem('token');

      const requestBody = {
        theater: parseInt(theatreId),
        seats: selectedSeats,
        category: "thriller", 
        movie: parseInt(movieId),
  
        price: 300.00, 
        movie_timing: timing,
        date: "2024-01-18", 
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Booking confirmed!', responseData);
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: 'Your seats have been booked successfully.',
        });

        
      } else {
        console.error('Failed to confirm booking');
        
      }
    } catch (error) {
      console.error('Error during booking confirmation:', error);
     
    }
  };

  return (
    <div className="seat-booking-container">
      <Navbar />
      <h1 style={{ color: "white" }}>Screen</h1>
      <div className="seat-arrangement">
        {renderSeats()}
      </div>
      {selectedSeats.length > 0 && (
        <div className="selected-seats">
          <p style={{ color: "white" }}>
            Selected Seats: {selectedSeats.join(", ")}
          </p>
        </div>
      )}
      <div className="button-container">
        <button onClick={confirmBooking}>Confirm Booking</button>
        
        <button onClick={redirectToConfirmation}>View UserDetails</button>
      </div>
    </div>
  );
      }  
      export default SeatBooking;