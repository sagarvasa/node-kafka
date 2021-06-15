import { MongoConfig } from "../types";
const env: keyof typeof config = global.env as keyof typeof config;

/* database configuration based on environment
   replace with original values to get connected with database
*/
const local: MongoConfig = {
  host: "127.16.240.244",
  port: 27017,
  database: "RL_METADATA_dev",
  username: "admin" || process.env.DB_USER,
  password: "admin" || process.env.DB_PASS,
  poolSize: 3,
};

const staging: MongoConfig = {
  host: "staging-abc.docdb.amazonaws.com",
  port: 27017,
  database: "cinema",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 5,
};

const dev: MongoConfig = {
  host: "dev-abc.docdb.amazonaws.com",
  port: 27017,
  database: "cinema",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 10,
};

const production: MongoConfig = {
  host: "prd-abc.docdb.amazonaws.com",
  port: 27017,
  database: "cinema",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  poolSize: 10,
};

const config = { local, staging, production, dev };

export default config[env];
