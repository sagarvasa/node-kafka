import { Router } from "express";
const validate = require("express-validation");
import { PingValidator } from "../validators";
import { PingController, KafkaController } from "../controllers";

const router = Router();
const pingValidator = new PingValidator();
const pingController = new PingController();
const kafkaController = new KafkaController();

router.get("/ping", validate(pingValidator.getPing()), pingController.getPing);
router.post("/sendEventPayload", kafkaController.sendEventPayload);

export = router;
