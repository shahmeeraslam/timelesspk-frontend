import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiGoogleFill, RiArrowLeftLine } from "@remixicon/react";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useCart } from "../context/CartContext"; 
import PageTransition from "../components/PageTransition";

const Register = () => {
  const { setUser } = useCart(); 
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- REUSABLE SUCCESS HANDLER (Copied from Login.jsx logic) ---
  const handleAuthSuccess = (data) => {
    try {
      const token = data.token;
      // Note: If your register/verify API sends user inside a 'user' key, 
      // use data.user. Otherwise use data.
      const userData = data.user || data; 

      if (!token || !userData) {
        throw new Error("Missing credentials");
      }

      // 1. Clear stale data
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // 2. Commit to Storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. Sync React Context
      if (setUser) setUser(userData);

      // 4. Force Redirect (This ensures the Navbar fetches the new data)
      const target = userData.role === "admin" ? "/admin/inventory" : "/";
      window.location.replace(target);

    } catch (err) {
      console.error("Auth Success Error:", err);
      setError("Account created, but failed to sync session. Please login manually.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp: otp
      });
      
      // Use the shared logic
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { data } = await axios.post("http://localhost:5000/api/auth/google", {
          token: tokenResponse.access_token,
        });
        handleAuthSuccess(data);
      } catch (err) {
        setError("Google signup failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageTransition>
      <div style={{ backgroundColor: "var(--brand-alt)", color: "var(--brand-main)" }} className="min-h-screen flex items-center justify-center pt-2 px-6">
        <div className="max-w-md w-full space-y-12">
          
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              <RiArrowLeftLine size={14} /> Back to details
            </button>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-serif italic mb-4 text-[var(--brand-main)]">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--brand-muted)]">
              {step === 1 ? "Join the Bold_Comfort Heritage" : `Code sent to ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input name="name" type="text" placeholder="Full Name" required className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors placeholder:text-[var(--brand-muted)]" onChange={handleChange} />
                  <input name="email" type="email" placeholder="Email Address" required className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors placeholder:text-[var(--brand-muted)]" onChange={handleChange} />
                  <input name="password" type="password" placeholder="Create Password" required className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors placeholder:text-[var(--brand-muted)]" onChange={handleChange} />
                </div>
                {error && <p className="text-red-800 text-[9px] uppercase tracking-widest">{error}</p>}
                <button type="submit" disabled={loading} style={{ backgroundColor: "var(--brand-main)", color: "var(--brand-alt)" }} className="w-full py-4 text-[10px] uppercase tracking-[0.4em] hover:opacity-90 transition-all disabled:opacity-50">
                  {loading ? "Sending Code..." : "Register"}
                </button>
              </form>
              <button onClick={() => handleGoogleSignup()} style={{ borderColor: "var(--brand-border)" }} className="w-full border py-4 flex items-center justify-center gap-3 hover:bg-[var(--brand-soft-bg)] transition-all text-[var(--brand-main)]">
                <RiGoogleFill size={18} /><span className="text-[10px] uppercase tracking-[0.3em]">Sign up with Google</span>
              </button>
            </div>
          ) : (
            <form className="space-y-10 animate-in slide-in-from-bottom-4 duration-500" onSubmit={handleVerifyOTP}>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoFocus
                  className="w-full max-w-[200px] bg-transparent border-b border-[var(--brand-main)] py-4 outline-none text-center text-3xl tracking-[0.5em] font-light text-[var(--brand-main)]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              {error && <p className="text-center text-red-800 text-[9px] uppercase tracking-widest">{error}</p>}
              <button type="submit" disabled={loading} style={{ backgroundColor: "var(--brand-main)", color: "var(--brand-alt)" }} className="w-full py-4 text-[10px] uppercase tracking-[0.4em] hover:opacity-90 transition-all">
                {loading ? "Verifying..." : "Confirm & Access"}
              </button>
            </form>
          )}

          <p className="text-center text-[10px] uppercase tracking-widest text-[var(--brand-muted)]">
            Already a member? <Link to="/login" className="font-bold border-b border-[var(--brand-main)] text-[var(--brand-main)] ml-1 pb-1">Sign In</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;