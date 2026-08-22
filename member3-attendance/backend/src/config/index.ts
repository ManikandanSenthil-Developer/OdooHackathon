import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret:
    process.env.JWT_SECRET || "dayflow_super_secret_jwt_key_2026_hrms",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  databaseUrl: process.env.DATABASE_URL || "",
};