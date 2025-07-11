import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Mail, RefreshCw } from "lucide-react";
import CustomButton from "../../components/CustomButton";
import { Alert } from "../../components/ui/alert";
import { isMobile } from "@/utils/isMobile";
import postVerification from "./helper/postverification";

const VerificationPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldownTime, setCooldownTime] = useState(120);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let interval;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const urlParams = new URLSearchParams(window.location.search);
  const email =
    urlParams.get("email") || localStorage.getItem("signup_email") || "";

  const handleResendLink = async () => {
    if (!email) {
      setError("Email not found. Please try signing up again.");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      const result = await postVerification({ email });

      if (
        result.response &&
        (result.response.Apistatus === true || result.response.success === true)
      ) {
        setMessage(
          "Verification link sent successfully! Please check your inbox and spam folder."
        );
        setCooldownTime(120);
      } else {
        let errorMessage =
          "Failed to resend verification link. Please try again.";

        if (result.response?.errors) {
          const errors = result.response.errors;
          if (typeof errors === "object") {
            const errorMessages = Object.values(errors).flat();
            errorMessage = errorMessages.join(". ");
          } else {
            errorMessage = errors;
          }
        } else if (result.response?.message) {
          errorMessage = result.response.message;
        } else if (result.response?.data?.message) {
          errorMessage = result.response.data.message;
        } else if (result.response?.data?.errors) {
          const errors = result.response.data.errors;
          if (typeof errors === "object") {
            errorMessage = Object.values(errors).flat().join(". ");
          } else {
            errorMessage = errors;
          }
        }

        setError(errorMessage);
        setCooldownTime(120);
      }
    } catch (error) {
      console.error("Resend verification error:", error);

      if (error.response?.status === 404) {
        setError(
          "Email not found. Please check your email address or sign up again."
        );
      } else if (error.response?.status === 429) {
        setError(
          "Too many requests. Please wait a few minutes before trying again."
        );
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          "An error occurred while resending the verification link. Please try again."
        );
      }
      setCooldownTime(120);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-8"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`,
      }}
    >
      <div className="absolute top-6 left-8">
        <img
          src="/brand-logo.png"
          alt="Brand Logo"
          className="h-8 w-8 md:h-10 md:w-10 drop-shadow"
        />
      </div>

      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-dark">Back to</span>
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: "#25282D" }}
        >
          Log In
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {(error || message) && (
        <div className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert
                color="error"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {error}
              </Alert>
            )}
            {message && (
              <Alert
                color="green"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {message}
              </Alert>
            )}
          </div>
        </div>
      )}

      <div
        className="w-full max-w-2xl rounded-2xl p-10 flex flex-col items-center border border-gray-100 shadow-none md:shadow mx-4"
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
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem] mb-4">
            Check Your Email
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569] mb-4">
            You're almost there! We've sent a verification link to your
            registered email address. Please check your inbox and verify to
            complete the registration.
          </p>
          {email && (
            <p className="text-sm text-gray-600 mb-6">
              Verification email sent to:{" "}
              <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <CustomButton
            type="button"
            onClick={handleResendLink}
            disabled={isResending || cooldownTime > 0}
            className={`bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 ${
              isResending ? "animate-pulse" : ""
            }`}
            icon={isResending ? RefreshCw : Mail}
            iconPosition="left"
          >
            {isResending
              ? "Sending..."
              : cooldownTime > 0
              ? `Resend in ${cooldownTime}s`
              : "Resend Verification Link"}
          </CustomButton>

          <Link to="/login">
            <CustomButton
              type="button"
              className="w-full"
              icon={ChevronRight}
              iconPosition="right"
            >
              Back to Login
            </CustomButton>
          </Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Can't find the email? Check your spam folder or contact support if
            you continue to have issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
