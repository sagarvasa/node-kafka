import {
  KafkaClient,
  KafkaClientOptions,
  HighLevelProducer,
  ConsumerGroup,
  ConsumerGroupOptions,
  ProduceRequest,
} from "kafka-node";
import loggerfn from "../utilities/winston";
const logger = loggerfn(__filename);

interface KafkaConfig {
  kafkaHost: string;
  sessionTimeout?: number;
  retryLimit?: number;
  retryWaitTime?: number;
  consumerWaitTime?: number;
}

interface ICallback {
  (error: Error | null, status?: number | string | object | boolean): void;
}

function initHighLevelProducer(config: KafkaConfig) {
  const { kafkaHost } = config;
  const kafkaClientOptions: KafkaClientOptions = { kafkaHost };
  const kafkaClient = new KafkaClient(kafkaClientOptions);
  const highLevelProducer = new HighLevelProducer(kafkaClient);
  highLevelProducer.on("ready", () => {
    logger.info(
      "[node-kafka][datasource][kafka][initHighLevelProducer] Producer spawned"
    );
  });
  highLevelProducer.on("error", (err) => {
    logger.error(
      "[node-kafka][datasource][kafka][initHighLevelProducer][error] " +
        err.message
    );
  });

  return highLevelProducer;
}

function initConsumerGroup(config: KafkaConfig, topics: string | string[]) {
  const { kafkaHost } = config;
  const consumerGroupOptions: ConsumerGroupOptions = {
    kafkaHost,
    sessionTimeout: config.sessionTimeout ?? 15000,
    protocol: ["roundrobin"],
    migrateRolling: true,
    groupId: "1",
  };
  const consumerGroup = new ConsumerGroup(consumerGroupOptions, topics);
  consumerGroup.on("connect", () => {
    logger.info(
      "[node-kafka][datasource][kafka][initConsumerGroup] Consumer group spawned"
    );
  });
  consumerGroup.on("error", (err) => {
    logger.error(
      "[node-kafka][datasource][kafka][initConsumerGroup][error] " +
        JSON.stringify(err)
    );
  });
  return consumerGroup;
}

function refreshConsumerMetadata(
  consumerGroup: ConsumerGroup,
  topics: string[],
  config: KafkaConfig
) {
  const consumerWaitTime = config.consumerWaitTime ?? 60000;
  setTimeout(() => {
    consumerGroup.client.refreshMetadata(topics, (err) => {
      logger.error(
        "[node-kafka][datasource][kafka][refreshConsumerMetadata][error] " +
          err.message
      );
      throw err;
    });
  }, consumerWaitTime);
}

function sendPayload(
  highLevelProducer: HighLevelProducer,
  payload: ProduceRequest[],
  callback: ICallback
) {
  highLevelProducer.send(payload, (error, data) => {
    if (error) {
      return callback(error);
    } else {
      return callback(null, data);
    }
  });
}

function retrySendingPayload(
  highLevelProducer: HighLevelProducer,
  payload: ProduceRequest[],
  retryLimit: number,
  callback: ICallback
) {
  highLevelProducer.send(payload, (error, data) => {
    if (error) {
      if (retryLimit <= 0) {
        logger.error(
          "[node-kafka][datasource][kafka][retrySendingPayload][finalLimit][error] " +
            error.message
        );
        return callback(error);
      } else {
        return retrySendingPayload(
          highLevelProducer,
          payload,
          retryLimit - 1,
          callback
        );
      }
    } else {
      return callback(null, data);
    }
  });
}

export {
  initHighLevelProducer,
  initConsumerGroup,
  refreshConsumerMetadata,
  sendPayload,
  retrySendingPayload,
};
