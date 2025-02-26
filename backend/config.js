import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

export const config = {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

console.log('Config:', config);
