import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    try {

      setLoading(true);

      await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      navigate("/chat");

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <AuthLayout
      title="Login"
      subtitle="Welcome back to Aurex AI"
    >

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 text-sm text-zinc-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-300">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <p className="text-center text-zinc-400 mt-6 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-white hover:underline"
        >
          Register
        </Link>
      </p>

    </AuthLayout>
  );
}

export default LoginPage;