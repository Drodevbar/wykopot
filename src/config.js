import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV,
  wykopApiKey: process.env.WYKOP_API_KEY,
  wykopApiSecret: process.env.WYKOP_API_SECRET,
  wykopApiAccountKey: process.env.WYKOP_API_ACCOUNT_KEY,
  wykopApiAccountName: process.env.WYKOP_API_ACCOUNT_NAME,
  cronInterval: process.env.CRON_INTERVAL,
};
