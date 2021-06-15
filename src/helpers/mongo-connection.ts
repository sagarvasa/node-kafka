import { Connection, ConnectionOptions } from "mongoose";
import loggerfn from "../utilities/winston";
const logger = loggerfn(__filename);
import { createMongoConnection, closeMongoConnection } from "../datasources";
import mongodbConfig from "../config/mongodb";

export class MongoConnectionHelper {
  private connectionObj: Connection | undefined;

  constructor() {}

  public async establishConnection(): Promise<Connection> {
    try {
      const { host, port, database, username, password, poolSize } =
        mongodbConfig;
      const options: ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      };
      if (poolSize) {
        options["poolSize"] = poolSize;
      }
      this.connectionObj = await createMongoConnection(
        { host, port, database, username, password },
        options
      );
      return this.connectionObj;
    } catch (error) {
      logger.error("[node-kafka] Establish connection error: " + error.message);
      return Promise.reject(error);
    }
  }

  public async getConnection(): Promise<object> {
    try {
      if (!this.connectionObj) {
        throw new Error("Please establish connection first");
      }
      const db = this.connectionObj.db;
      return { client: this.connectionObj, db };
    } catch (err) {
      logger.error("[node-kafka] Get connection error: " + err.message);
      throw err;
    }
  }

  public closeConnection(connectionObj?: Connection): void {
    try {
      if (connectionObj) {
        closeMongoConnection(connectionObj);
      }
    } catch (err) {
      logger.warn("[node-kafka] Close connection error: " + err.message);
    }
  }
}
