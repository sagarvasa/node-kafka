import { KafkaHelper } from "../helpers";
import { Constants } from "../utilities/constants";
import loggerFn from "../utilities/winston";
const logger = loggerFn(__filename);

const consumerGroup = KafkaHelper.getConsumerGroup();

consumerGroup.on("message", (message) => {
  logger.info(`${__dirname}:::: message :::: ${JSON.stringify(message)}`);

  let payload = <any>message.value;
  if (typeof payload === "string") {
    payload = JSON.parse(payload);
  } else {
    payload = JSON.parse(message.value.toString());
  }

  switch (payload.type) {
    case Constants.EVENT_SEND_NOTIFICATION:
      logger.info(
        `data sent from producer is ::::::::::: ${JSON.stringify(payload.data)}`
      );
      break;
  }
});
