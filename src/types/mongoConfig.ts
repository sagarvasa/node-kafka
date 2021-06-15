export interface MongoConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  poolSize?: number;
  timeout?: number;
}
