import path from "path";
import { format, transports, createLogger } from "winston";
const { combine, timestamp, colorize, label, printf, uncolorize } = format;
import { IServerResponse } from "../types/http";
import { ServerResponse } from "http";
import DailyRotateFile from "winston-daily-rotate-file";
import { Constants } from "./constants";

const colors = {
  trace: "white",
  debug: "blue",
  info: "green",
  warn: "yellow",
  crit: "red",
  fatal: "red",
};

const options = (prefix: string) => ({
  level: "debug",
  format: combine(
    label({
      label: path.basename(prefix),
    }),
    colorize({
      //all: true,
      colors,
    }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    printf(function (info) {
      let msg = `${info.timestamp} [Worker - ${process.pid}][${info.level}][${info.label}] : ${info.message}`;
      const splatArgs = info[Object(Symbol.for("splat"))] || [];
      if (splatArgs[0] instanceof ServerResponse) {
        const IServerResp = <IServerResponse>splatArgs[0];
        msg = `${info.timestamp} [Request : ${
          IServerResp[Constants.CORR_ID]
        }][Worker - ${process.pid}][${info.level}][${info.label}] : ${
          info.message
        }`;
      }
      return msg;
    })
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "logs/server/%DATE%/combined.log",
      datePattern: "DD-MMM-YYYY",
      level: "debug",
      format: combine(uncolorize()),
    }),
    new DailyRotateFile({
      filename: "logs/server/%DATE%/errors.log",
      datePattern: "DD-MMM-YYYY",
      level: "error",
      format: combine(uncolorize()),
    }),
  ],
});

const logger = (prefix: string) => createLogger(options(prefix));

export = logger;
