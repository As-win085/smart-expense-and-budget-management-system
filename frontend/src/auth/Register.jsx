import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
  try {
    const res = await api.post("register/", {
      username,
      email,
      password,
    });
    console.log(res.data);
    alert("Registration successful. Please login.");
    navigate("/");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(JSON.stringify(err.response?.data || "Unknown error"));
  }
};


  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
