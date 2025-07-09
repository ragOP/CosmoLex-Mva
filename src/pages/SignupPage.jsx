import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import CustomButton from "../components/CustomButton";
import { Alert } from "../components/ui/alert";
import { isMobile } from "@/utils/isMobile";

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email || !password || !confirmPassword) {
      setInfo('Please enter all credentials!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Simulate signup success
    setTimeout(() => {
      setInfo('Account created! Please log in.');
    }, 800);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`
      }}
    >
      {/* Brand Logo */}
      <div className="absolute top-6 left-8">
        <img src="/brand-logo.png" alt="Brand Logo" className="h-8 w-8 md:h-10 md:w-10 drop-shadow" />
      </div>
      {/* Login Link */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-dark">Already have an account?</span>
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: "#25282D" }}
        >
          Log In
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
      {/* Alert/Info */}
      {(error || info) && (
        <div className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert color="error" className="w-fit rounded-xl md:rounded-2xl">{error}</Alert>
            )}
            {info && (
              <Alert color="warning" className="w-fit rounded-xl md:rounded-2xl">{info}</Alert>
            )}
          </div>
        </div>
      )}
      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-10 flex flex-col items-center border border-gray-100 shadow-none md:shadow"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0) -9.58%, rgba(255,255,255,0.052) 100%)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: isMobile() ? 'none' : [
            "0px 10px 10px 0px #0000001A",
            "0px 4px 4px 0px #0000000D",
            "0px 1px 0px 0px #0000000D",
            "0px 20px 50px 0px #FFFFFF26 inset",
          ].join(", "),
        }}
      >
        <div className="flex flex-col items-start w-full mb-7">
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem]">Sign up</h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569]">Create your account to get started!</p>
        </div>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <CustomButton
            type="submit"
            className="mt-2"
            icon={ChevronRight}
            iconPosition="right"
          >
            Sign Up
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
