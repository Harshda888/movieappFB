
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../assets/res.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          name,
        }),
      });

      if (response.ok) {
        
        console.log("User registered successfully");

    
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You have successfully registered!",
        });
        navigate("/login");
      } else {
        
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="background-image">
      <div className="form-container">
        <h1 style={{ color: "#00FFFF" }}>Welcome to BookMyShow</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegistration();
          }}
        >
         

          <div className="form-group">
            <label htmlFor="formBasicName">User Name</label>
            <input
              type="text"
              id="formBasicName"
              className="transparent-input"
              placeholder="Enter your user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="formBasicEmail">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="formBasicEmail"
              className="transparent-input"
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="formBasicPassword">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="formBasicPassword"
              className="transparent-input"
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="formBasicName">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="formBasicName"
              className="transparent-input"
              placeholder="Enter your  name"
            />
          </div>

          <button
            type="submit"
            onClick={handleRegistration}
            className="btn-primary"
          >
            Register
          </button>
        </form>

        <p style={{ color: "#00FFFF" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "white" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
