import mongoose, { Connection, ConnectionOptions } from "mongoose";
import loggerfn from "../utilities/winston";
const logger = loggerfn(__filename);

interface MongoConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  poolSize?: number;
}

async function createMongoConnection(
  dbConfigObj: MongoConfig,
  options: ConnectionOptions
): Promise<Connection> {
  const { host, port, database, username, password } = dbConfigObj;
  const url =
    "mongodb://" +
    username +
    ":" +
    password +
    "@" +
    host +
    ":" +
    port +
    "/" +
    database;
  let connection: Connection;
  try {
    await mongoose.connect(url, options);
    connection = mongoose.connection;
    return connection;
  } catch (e) {
    logger.error("[node-kafka] db connection error: " + e.message);
    throw e;
  }
}

function closeMongoConnection(connection: Connection) {
  connection
    .close()
    .then(() => {})
    .catch(() => {});
}

export { createMongoConnection, closeMongoConnection };
