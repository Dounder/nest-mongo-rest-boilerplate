export const ENV_CONFIG = () => ({
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  port: process.env.PORT,
  state: process.env.STATE,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  mongoUri: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/${process.env.DB_NAME}`,
});
