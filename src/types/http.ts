import { ServerResponse } from "http";
import { Constants } from "../utilities/constants";

export class IServerResponse extends ServerResponse {
  [Constants.CORR_ID]: string;
}
