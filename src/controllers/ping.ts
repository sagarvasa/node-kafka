import { Request, Response } from "express";

export class PingController {
  getPing(req: Request, res: Response) {
    res.status(200).send({ message: "pong" });
  }
}
