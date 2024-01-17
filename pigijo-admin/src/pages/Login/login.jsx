import { useEffect } from "react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../custom-hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_LOGIN, {
        email,
        password,
      });

      const accessToken = response.data.accessToken;

      if (accessToken) {
        await login(email, password);
        navigate("/");
        toast.success("Success Login!");
      } else {
        console.error("No access token received from the server");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <h1>
          Welcome to <span className="text-primary">Pigijo Admin</span>
        </h1>
        <p>We make it easy for everyone to use this panel</p>
        <form action="" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email col-form-label">Email</label>
            <input
              type="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password col-form-label">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary text-light form-control">
            LOGIN
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
