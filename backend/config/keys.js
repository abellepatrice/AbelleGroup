require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,

  MPESA_ENV: process.env.MPESA_ENV, 
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  MPESA_PAYBILL: process.env.MPESA_PAYBILL, 
  MPESA_PASSKEY: process.env.MPESA_PASSKEY, 
  MPESA_ACCOUNT: process.env.MPESA_ACCOUNT, 
  MPESA_CALLBACK_URL: `${process.env.APP_BASE_URL}/api/rtest/callback`,
};
