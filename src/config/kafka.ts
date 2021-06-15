const env: keyof typeof config = global.env as keyof typeof config;

/* Kafka configuration based on environment
   replace with original values to get connected with database
*/
const local = {
  eventedHost: {
    kafkaHost: "localhost:9092",
    retryWaitTime: 180000,
    consumerWaitTime: 300000,
    sessionTimeout: 15000,
    retryLimit: 10,
  },
  publish_topics: {
    topicMessaging: "test",
  },
  subscribed_topics: ["test"],
};

const staging = {
  eventedHost: {
    kafkaHost: "kafka-dev.test:9092",
    retryWaitTime: 180000,
    consumerWaitTime: 300000,
    sessionTimeout: 15000,
    retryLimit: 10,
  },
  publish_topics: {
    topicMessaging: "test",
  },
  subscribed_topics: ["test"],
};

const dev = {
  eventedHost: {
    kafkaHost: "kafka-dev.test:9092",
    retryWaitTime: 180000,
    consumerWaitTime: 300000,
    sessionTimeout: 15000,
    retryLimit: 10,
  },
  publish_topics: {
    topicMessaging: "test",
  },
  subscribed_topics: ["test"],
};

const production = {
  eventedHost: {
    kafkaHost: "kafka-dev.test:9092",
    retryWaitTime: 180000,
    consumerWaitTime: 300000,
    sessionTimeout: 15000,
    retryLimit: 10,
  },
  publish_topics: {
    topicMessaging: "test",
  },
  subscribed_topics: ["test"],
};

const config = { local, staging, production, dev };

export default config[env];
