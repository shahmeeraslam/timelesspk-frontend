import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiGoogleFill, RiMailLine, RiLockLine, RiArrowLeftLine } from "@remixicon/react";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useCart } from "../context/CartContext"; 
import PageTransition from "../components/PageTransition";

const Login = () => {
  // Pulling setUser from your CartContext
  const { setUser } = useCart(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * SUCCESS HANDLER
   * Orchestrates storage, context sync, and final redirect.
   */
  const handleAuthSuccess = (data) => {
    try {
      // 1. Robust Extraction
      // backend now sends: { token: "...", user: { ... } }
      const token = data.token;
      const userData = data.user;

      if (!token || !userData) {
        throw new Error("Missing authentication credentials in server response.");
      }

      // 2. Clear stale data to prevent 'role' or 'token' mismatches
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      // 3. Commit to Storage (Required before Context or Redirect)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 4. Sync React Context
      // Wrapped in try/catch to ensure a context crash doesn't stop the redirect
      try {
        if (setUser) setUser(userData);
      } catch (contextErr) {
        console.warn("CartContext update failed, but proceeding to redirect:", contextErr);
      }

      // 5. Final Redirect
      // Admin goes to inventory, standard user goes home
      const target = userData.role === "admin" ? "/admin/inventory" : "/";
      
      // replace prevents the user from clicking 'back' into the login screen
      window.location.replace(target);

    } catch (err) {
      console.error("Critical Auth Success Error:", err);
      setError("An unexpected error occurred during sign-in.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      if (data.requiresVerification) {
        setStep(2); // Show OTP input
      } else {
        handleAuthSuccess(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
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
        email,
        otp
      });
      handleAuthSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        // Sending the access_token to our backend to verify/create the user
        const { data } = await axios.post("http://localhost:5000/api/auth/google", {
          token: tokenResponse.access_token,
        });
        handleAuthSuccess(data);
      } catch (err) {
        console.error("Google Auth Error:", err.response?.data);
        setError("Google authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Login was interrupted."),
  });

  return (
    <PageTransition>
      <div style={{ backgroundColor: "var(--brand-alt)", color: "var(--brand-main)" }} className="min-h-screen flex items-center justify-center pt-2 px-6">
        <div className="max-w-md w-full space-y-12">
          
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              <RiArrowLeftLine size={14} /> Back to Login
            </button>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-serif italic mb-4">
              {step === 1 ? "Welcome Back" : "Security Challenge"}
            </h1>
            <p style={{ color: "var(--brand-muted)" }} className="text-[10px] uppercase tracking-[0.4em]">
              {step === 1 ? "Access Your Private Archive" : "Verify your identity to proceed"}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-12 animate-in fade-in duration-500">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="border-b py-2 flex items-center gap-3 focus-within:border-[var(--brand-main)] transition-colors">
                  <RiMailLine size={18} style={{ color: "var(--brand-muted)" }} />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full bg-transparent outline-none text-sm font-light py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="border-b py-2 flex items-center gap-3 focus-within:border-[var(--brand-main)] transition-colors">
                  <RiLockLine size={18} style={{ color: "var(--brand-muted)" }} />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-sm font-light py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-800 text-[9px] uppercase tracking-widest">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[10px] uppercase tracking-[0.4em] active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {loading ? "Checking Archive..." : "Sign In"}
                </button>
              </form>

              <div className="space-y-6">
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-[var(--brand-border)] opacity-50"></div>
                  <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest opacity-50">Or</span>
                  <div className="flex-grow border-t border-[var(--brand-border)] opacity-50"></div>
                </div>

                <button 
                  onClick={() => handleGoogleLogin()} 
                  disabled={loading} 
                  className="w-full border py-4 flex items-center justify-center gap-3 hover:bg-[var(--brand-soft-bg)] transition-all disabled:opacity-50"
                >
                  <RiGoogleFill size={18} />
                  <span className="text-[10px] uppercase tracking-[0.3em]">Continue with Google</span>
                </button>
              </div>
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
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[10px] uppercase tracking-[0.4em]"
              >
                {loading ? "Authenticating..." : "Verify Identity"}
              </button>
            </form>
          )}

          <p className="text-center text-[10px] uppercase tracking-widest pt-4 opacity-60">
            New to the house?{" "}
            <Link to="/register" className="text-[var(--brand-main)] font-bold border-b ml-1 pb-1">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;