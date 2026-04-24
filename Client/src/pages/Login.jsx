import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      console.log("LOGIN SUCCESS:", res.data);

      // store token manually
      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR FULL:", err);
      console.log("RESPONSE:", err.response?.data);

      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}