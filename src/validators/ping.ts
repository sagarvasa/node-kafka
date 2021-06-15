import Joi from "joi";

export class PingValidator {
  getPing() {
    return {
      body: {},
      query: {
        service: Joi.string().optional(),
      },
      param: {},
    };
  }
}
