export const isDev = () => {
  return import.meta.env.MODE === "development";
};

export const BACKEND_URL = isDev()
  ? "https://maplelawpro.com/newapp/public/api"
  : "https://maplelawpro.com/newapp/public/api";

export const endpoints = {
  formData: "form-data",
  firmRegister: "firm/register",
  resendVerification: "firm/resend-link",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
  login: "login",
  verifyOtp: "verify-otp",
  resendOtp: "resend-otp",
  getEvent: "v2/event/show",
  getEvents: "v2/event/list",
  createEvent: "v2/event/store"
};
