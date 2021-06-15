import { Request, Response } from "express";
import { KafkaHelper } from "../helpers/kafka-helper";
import loggerFn from "../utilities/winston";
const logger = loggerFn(__filename);

export class KafkaController {
  sendEventPayload(req: Request, res: Response) {
    KafkaHelper.sendMessageEvent(req.body, res, (error, status) => {
      if (error) {
        logger.error("Error occured in sending payload " + error.message);
        res.status(500).send({ message: error.message });
      } else {
        res.status(200).send({ status: status });
      }
    });
  }
}
