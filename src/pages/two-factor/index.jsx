import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "@/components/CustomButton";
import { ChevronRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { isMobile } from "@/utils/isMobile";
import postTwoFactor from "./helper";
import { getBrowserInfo } from "@/utils/deviceDetection";

const TwoFactorPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = localStorage.getItem("login_temp_data");
    if (tempData) {
      try {
        const parsedData = JSON.parse(tempData);
        setLoginData(parsedData);
        setInfo(parsedData.message || "OTP sent to your registered number");
      } catch (error) {
        console.error("Error parsing login temp data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit code sent to your registered number.");
      return;
    }

    if (!loginData) {
      setError("Session expired. Please login again.");
      return;
    }

    setIsSubmitting(true);

    const browserInfo = await getBrowserInfo();

    try {
      const payload = {
        email: loginData.email,
        otp_code: parseInt(code),
        trust_device: trustDevice,
        token: browserInfo.token
      };

      console.log(payload, "payload");

      const result = await postTwoFactor(payload);

      if (result.response && result.response.Apistatus) {
        if (result.response.token) {
          localStorage.setItem("auth_token", result.response.token);

          const rememberLogin = localStorage.getItem("remember_login");
          if (rememberLogin === "true") {
            localStorage.setItem("remember_login", "true");
          }
        }

        localStorage.removeItem("login_temp_data");

        setInfo("2FA successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        setError(result.response?.message || "Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute top-6 left-8">
        <img
          src="/brand-logo.png"
          alt="Brand Logo"
          className="h-8 w-8 md:h-10 md:w-10 drop-shadow"
        />
      </div>
      {/* Back to Login Link */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: "#25282D" }}
        >
          Back to Login
          <ChevronRight className="w-5 h-5 rotate-180" />
        </Link>
      </div>
      {/* Alert/Info */}
      {(error || info) && (
        <div className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert color="error" className="w-fit rounded-xl md:rounded-2xl">
                {error}
              </Alert>
            )}
            {info && (
              <Alert
                color="warning"
                className="w-fit rounded-xl md:rounded-2xl"
              >
                {info}
              </Alert>
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
          boxShadow: isMobile()
            ? "none"
            : [
                "0px 10px 10px 0px #0000001A",
                "0px 4px 4px 0px #0000000D",
                "0px 1px 0px 0px #0000000D",
                "0px 20px 50px 0px #FFFFFF26 inset",
              ].join(", "),
        }}
      >
        <div className="flex flex-col items-start w-full mb-7">
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem]">
            Two-Factor Authentication
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569]">
            {loginData?.message ||
              "Enter the 6-digit code sent to your registered number."}
          </p>
        </div>
        <form
          className="w-full flex flex-col gap-6"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <label
              className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
              htmlFor="code"
            >
              2FA Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB] tracking-[0.2em] text-center"
              placeholder="000000"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              autoComplete="one-time-code"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="trustDevice"
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="w-4 h-4 text-primary-700 bg-white border-gray-300 rounded focus:ring-primary-700 focus:ring-2"
              disabled={isSubmitting}
            />
            <label
              htmlFor="trustDevice"
              className="text-sm font-medium text-gray-dark tracking-[-0.01em] cursor-pointer"
            >
              Trust this device
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="text-sm font-medium text-primary-700 hover:text-primary-800 tracking-[-0.01em]"
              disabled={isSubmitting}
            >
              Didn't receive code? Resend OTP
            </button>
          </div>

          <CustomButton
            type="submit"
            className="mt-2"
            icon={ChevronRight}
            iconPosition="right"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </CustomButton>
        </form>

        {/* Development helper - remove in production */}
        {loginData?.otp && import.meta.env.DEV && (
          <div className="mt-4 p-2 bg-yellow-100 rounded text-xs text-center">
            Dev mode - OTP: {loginData.otp}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorPage;
