
import React,{useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import "../assets/res.css";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const navigate = useNavigate();



const handleLogin = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/signin/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
    
      const responseData = await response.json();
      console.log('User logged in successfully:', responseData);
      // const jsonString = JSON.parse(responseData);
      // console.log(jsonString,"jsonString")

      // Set refresh_token in local storage
      // localStorage.setItem('access', responseData.access);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      sessionStorage.setItem('token', responseData.access);
      navigate("/main")
   
    } else {

      const errorData = await response.json(); 
      console.error('Failed to log in:', errorData);
   
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  return (
    <div className="background-image">
      <div className="form-container">
      <h2 style={{ color: '#00FFFF' }}>Hello</h2>

        <h1 style={{ color: 'white' }}>Welcome Back</h1>
        <form onSubmit={(e) => {
  e.preventDefault();
  handleLogin();
}}>

          <div className="form-group">
            <label htmlFor="formBasicEmail">Username</label>
            <input type="text" value={username}
  onChange={(e) => setUsername(e.target.value)} id="formBasicEmail" className="transparent-input" placeholder="Enter email" />
          </div>

          <div className="form-group">
            <label htmlFor="formBasicPassword">Password</label>
            <input type="password" id="formBasicPassword" value={password}
              onChange={(e) => setPassword(e.target.value)} className="transparent-input" placeholder="Password" />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p style={{ color: '#00FFFF' }}>
          Don't have an account? <a href="/" style={{ color: 'white' }}>SignUp here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
