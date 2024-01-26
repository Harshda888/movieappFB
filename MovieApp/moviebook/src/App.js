import logo from './logo.svg';
import './App.css';
import Register from './Component/Registration';
import Login from './Component/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Component/Nav';
import Main from './Component/Main';
import MovieList from './Component/MovieList';
import TheaterSchedule from './Component/TheatreSchedule';
import SeatBooking from './Component/SeatBooking';
import MovieDetails from './Component/MovieDetails';
import ConfirmationComponent from './Component/UserDetails';

function App() {
  return (
    <div className="App">
      <BrowserRouter><Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        {/* <Route path="/main" element={<Navbar/>}/> */}
        <Route path="/main" element={<Main/>}/>
        {/* <Route path="/main" element={<MovieList/>}/> */}

        <Route path="/schedule/:movieId" element={<TheaterSchedule/>}/>
        <Route path="/seatbook/:movieId/:theatreId/:timing" element={<SeatBooking/>}/>
        <Route path="/details/:movieId" element={<MovieDetails/>} />
        
        <Route path="/movies" element={<MovieList/>} />
        <Route path="/confirmation/:movieId/:theatreId/:timing" element={<ConfirmationComponent />} />

       



        </Routes></BrowserRouter>
      
      
    </div>
  );
}

export default App;
