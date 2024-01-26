/* MovieDetails.js */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/moviedetails.css";
import { Link } from "react-router-dom";
const MovieDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/movies/${movieId}/`
        );
        if (response.ok) {
          const data = await response.json();
          setMovieDetails(data);
        } else {
          console.error("Failed to fetch movie details");
          setError("Failed to fetch movie details");
        }
      } catch (error) {
        console.error("Error during movie details fetch:", error);
        setError("Error during movie details fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="movie-details-wrapper">
      <div className="movie-details-container">
        <div className="movie-image-container">
          {movieDetails.image && (
            <img
              src={movieDetails.image}
              alt={`Movie: ${movieDetails.title}`}
              className="movie-image"
            />
          )}
        </div>
        <div className="movie-details">
          <h2>{movieDetails.title}</h2>
          <p>Genre: {movieDetails.genre}</p>
          <p>Director: {movieDetails.director}</p>
          <p>Description: {movieDetails.description}</p>
          
          <Link to={`/schedule/${movieId}`}>
            <button style={{ marginRight: "10px" }}>Book Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
