import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import { FaEye,FaBook } from 'react-icons/fa';
import "../assets/movielist.css"
import MovieDetails from './MovieDetails'
import { useEffect } from "react"


function MovieList({enteredLanguage,enteredgenre,enterRating}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moviesData, setMoviesData] = useState({});
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/movies/');
        if (response.ok) {
          const data = await response.json();
          setMoviesData(data);
        } else {
          console.error('Failed to fetch movies');
          setError('Failed to fetch movies');
        }
      } catch (error) {
        console.error('Error during movie fetch:', error);
        setError('Error during movie fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  
   
  return (

<div>
      <h1 style={{ color: 'red' }}>MOVIES LIST..</h1>
      <div className="movie-list-container">
        {moviesData.data.map((movie) => (
          <div key={movie.id} className="movie-container">
            
            {movie.image && (
              <img
                src={movie.image}
                alt={`Movie: ${movie.title}`}
                className="movie-image"
              />
            )}

            <h3>{movie.title}</h3>
            
            
            
            <p>Rating: {movie.rating}</p>
            
            <p>Language: {movie.language}</p>

            <Link to={`/schedule/${movie.id}`}>
             <button style={{ marginRight: '10px' }}>Book Now</button>
         </Link>
          <Link to={`/details/${movie.id}`}>            
           <button className="button-container">            
              <FaEye style={{ marginRight: '5px' }} />
              View Details
             </button>          
              </Link>
          </div>
        ))}
      </div>
    </div>   
      );
}

export default MovieList
