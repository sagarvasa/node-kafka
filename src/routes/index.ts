import { Router } from "express";
const validate = require("express-validation");
import { PingValidator } from "../validators";
import { PingController } from "../controllers";

const router = Router();
const pingValidator = new PingValidator();
const pingController = new PingController();

router.get("/ping", validate(pingValidator.getPing()), pingController.getPing);

export = router;
