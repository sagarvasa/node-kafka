import express, { Application, NextFunction, Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as shortid from "shortid";
import { HttpError } from "http-errors";
import { Constants } from "./utilities/constants";
import { ErrorConst } from "./utilities/errors";

export class ServerApplication {
  public app: Application;
  public port: number;
  public logger: any;

  constructor(restConfig: { rest: { port: number } }) {
    this.app = express();
    this.port = restConfig.rest.port;
  }

  public async init() {
    // Dynamically Import loggers
    this.logger = await this.configureLoggingImport();

    // Initialize Default Middlewares needed for application
    this.initializeDefaultMiddlewares();

    // Parse Request URL to check valid format
    this.parseRequestURL();

    // Set Headers on Response, register process exception events
    this.setResponseHeader();

    // Log incoming requests
    this.logRequest();

    // Initialize Database
    this.initializeDatabase();

    // Serve incoming routes
    this.serveRequest();
  }

  public listen() {
    this.app.listen(this.port);
  }

  private async configureLoggingImport() {
    const logger = require("./utilities/winston")(__filename);
    return logger;
  }

  private async initializeDatabase() {
    try {
      const connection = await import("./helpers/mongo-connection");
      const mongoHelper = new connection.MongoConnectionHelper();
      await mongoHelper.establishConnection();
    } catch (e) {
      this.logger.error(
        "[boilerplate] Error in connecting database:: [error]: " + e.message
      );
    }
  }

  private initializeDefaultMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
  }

  private parseRequestURL() {
    this.app.use((req, res, next) => {
      const parsedArray = req.url.match("\b*(?:json)");
      if (parsedArray?.length && parsedArray[0] !== "") {
        req.url = req.url.replace("." + parsedArray[0], "");
        req.query.format = parsedArray[0];
        next();
      } else {
        return res
          .status(ErrorConst.BAD_REQUEST)
          .send({ message: ErrorConst.INVALID_URI_FORMAT });
      }
    });
  }

  private setResponseHeader() {
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
      );
      res.setHeader("Cache-Control", "no-cache");

      res.setHeader(Constants.INIT_TIME, Date.now());
      res.setHeader(
        Constants.CORR_ID,
        req.get(Constants.CORR_ID) ?? shortid.generate()
      );

      // Assigning res to custom object on process to use it unhandledRejection
      Object.assign(process, { currentRes: res });

      // Node Process Exception handlers
      this.handleNodeExceptions(res);

      next();
    });
  }

  private logRequest() {
    this.app.use((req, res, next) => {
      if (req.originalUrl === "/ping") {
        return next();
      }

      if (req.body && Object.keys(req.body).length) {
        this.logger.info(
          "[boilerplate][URL]: " +
            req.path +
            " [Body] : " +
            JSON.stringify(req.body),
          res,
          true
        );
      }
      if (req.headers && Object.keys(req.headers).length) {
        this.logger.info(
          "[boilerplate][URL]: " +
            req.path +
            " [Headers]: " +
            JSON.stringify(req.headers),
          res,
          true
        );
      }
      if (req.query && Object.keys(req.query).length) {
        this.logger.info(
          "[boilerplate][URL]: " +
            req.path +
            " [Query] : " +
            JSON.stringify(req.query),
          res,
          true
        );
      }
      if (req.params && Object.keys(req.params).length) {
        this.logger.info(
          "[boilerplate][URL]: " +
            req.path +
            " [Params] : " +
            JSON.stringify(req.params),
          res,
          true
        );
      }

      next();
    });
  }

  private serveRequest() {
    const routes = require("./routes");
    this.app.use("/", routes);

    // Not Found Route
    this.app.use(function (req, res, next) {
      const err = new Error(ErrorConst.HANDLER_NOT_FOUND);
      const error = <HttpError>err;
      error.status = ErrorConst.NOT_FOUND;
      next(error);
    });

    // Default Error Handler route
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        this.logger.info(
          "[boilerplate][app][error] " + error.message,
          res,
          true,
          error
        );
        return res.status(error.status || 500).jsonp({
          message: error.message,
          code: error.status,
          CRID: res.get(Constants.CORR_ID),
          errors: error.errors,
          timestamp: new Date().toISOString(),
          ip: req.ip,
          url: req.originalUrl,
        });
      }
    );
  }

  private handleNodeExceptions(res: Response) {
    process.on("uncaughtException", (error) => {
      if (process.currentRes) {
        error.message =
          `${error.message} CRID : ` +
          process.currentRes.get(Constants.CORR_ID);
      }
      this.logger.info(
        "[boilerplate][uncaughtException][reason] " + error.message
      );
    });

    process.on("unhandledRejection", (reason, promise) => {
      let error = new Error(`reason:: ${reason}`);
      if (reason instanceof Error) {
        error = reason;
      }
      if (process.currentRes) {
        error.message =
          `${error.message} CRID : ` +
          process.currentRes.get(Constants.CORR_ID);
      }
      this.logger.info(
        "[boilerplate][unhandledRejection][reason] " + error.message
      );
      return res.status(500).send({ message: ErrorConst.GENERAL_ERROR_MSG });
    });
  }
}
