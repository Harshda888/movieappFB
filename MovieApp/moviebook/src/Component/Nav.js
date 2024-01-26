
import React from 'react';
import { Link } from 'react-router-dom'; 
import "../assets/nav.css"
import iconImage from "../assets/favicon.png";
import Main from './Main';
const Navbar = () => {
  return (
    <nav>
      <ul>
      <li className="icon">
          <img src={iconImage} alt="Icon" />
          
        </li>
      <li ><Link to="/" style={{color:"red"}}>Boleto</Link></li>

        <li><Link to="/main">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/">Join Us</Link></li>
        
      </ul>
      
    </nav>
    
  );
};

export default Navbar;
