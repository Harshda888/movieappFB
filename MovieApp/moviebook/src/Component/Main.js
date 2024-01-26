import React, { useState } from "react";
import "../assets/nav.css";
import Navbar from "./Nav";
import MovieList from "./MovieList";

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [enteredLanguage, setEnteredLanguage] = useState("");
  const [enteredgenre, setEnteredgenre] = useState("");
  const [enteredcity, setEnteredcity] = useState("");

  const handleSearch = () => {
    
    const apiUrl = `http://127.0.0.1:8000/api/movies/?language=${enteredLanguage}&genre=${enteredgenre}&city=${enteredcity}`;

  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Movies data:", data);
        
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      
      });
  };

  
  return (
    <main>
      <Navbar />
      <div className="main-background">
        <h1>GET MOVIE TICKETS!!</h1>
        <h3 style={{ color: "aquamarine" }}>Find and Book Movies</h3>
        <div className="search-bar">
          
          <input
            type="text"
            placeholder="Enter Language"
            value={enteredLanguage}
            onChange={(e) => setEnteredLanguage(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Enter Genre"
            value={enteredgenre}
            onChange={(e) => setEnteredgenre(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Enter City"
            value={enteredcity}
            onChange={(e) => setEnteredcity(e.target.value)}
          />

          <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
            Search Movies
          </button>
        </div>
      </div>
      <MovieList enteredLanguage={enteredLanguage} />
      <MovieList enteredgenre={enteredgenre} />
      <MovieList enteredcity={enteredcity} />
    </main>
  );
};
export default Main;
