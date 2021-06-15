import { HighLevelProducer, ConsumerGroup } from "kafka-node";
import { Response } from "express";
import {
  initHighLevelProducer,
  initConsumerGroup,
  sendPayload,
  retrySendingPayload,
} from "../datasources";
import { Constants } from "../utilities/constants";
import loggerfn from "../utilities/winston";
import config from "../config/kafka";
const logger = loggerfn(__filename);

const kafkaConfig = config?.eventedHost;
const subscribedTopics = config?.subscribed_topics;
const publishTopics = config?.publish_topics;

interface ICallback {
  (error: Error | null, status?: any): any;
}

export class KafkaHelper {
  static highLevelProducer: HighLevelProducer;
  static consumerGroup: ConsumerGroup;

  constructor() {
    this.initKafkaHighLevelProducer();
    this.initKafkaConsumerGroup();
  }

  private initKafkaHighLevelProducer() {
    KafkaHelper.highLevelProducer = initHighLevelProducer({
      kafkaHost: kafkaConfig.kafkaHost,
    });
  }

  private initKafkaConsumerGroup() {
    KafkaHelper.consumerGroup = initConsumerGroup(
      kafkaConfig,
      subscribedTopics
    );
  }

  static getConsumerGroup() {
    return KafkaHelper.consumerGroup;
  }

  static sendMessageEvent(
    dataForNotification: object,
    res: Response,
    callback: ICallback
  ) {
    const topicName = publishTopics.topicMessaging;
    const dataToSend = {
      type: Constants.EVENT_SEND_NOTIFICATION,
      data: dataForNotification,
      topic: topicName,
    };
    const payload = [
      {
        topic: topicName,
        messages: JSON.stringify(dataToSend),
      },
    ];

    sendPayload(
      KafkaHelper.highLevelProducer,
      payload,
      (err: any, status?: any) => {
        if (err) {
          logger.error(
            "[node-kafka][helpers][kafka][sendMessageEvent][error] " +
              err.message,
            res
          );
          const retryWaitTime = kafkaConfig.retryWaitTime;
          const retryLimit = kafkaConfig.retryLimit ?? 5;
          setTimeout(() => {
            logger.warn(
              "[node-kafka][helpers][kafka][sendMessageEvent][error][setTimeout]",
              res
            );
            retrySendingPayload(
              KafkaHelper.highLevelProducer,
              payload,
              retryLimit,
              callback
            );
          }, retryWaitTime);
        } else {
          return callback(null, status);
        }
      }
    );
  }
}
