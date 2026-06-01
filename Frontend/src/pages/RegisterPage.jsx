import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import api from "../services/api";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);



  async function handleRegister(e) {
    e.preventDefault();

    try {

      setLoading(true);

      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts[1] || "";

      await api.post("/api/auth/register", {
        fullName: {
          firstName,
          lastName
        },
        email: formData.email,
        password: formData.password,
      });

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Registration failed"
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
      title="Register"
      subtitle="Create your Aurex AI account"
    >

      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 text-sm text-zinc-300">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
          />
        </div>

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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

      <p className="text-center text-zinc-400 mt-6 text-sm">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-white hover:underline"
        >
          Login
        </Link>
      </p>

    </AuthLayout>
  );
}

export default RegisterPage;