import { Response } from "express";
import axios, {
  /*AxiosError, AxiosInstance, AxiosResponse,*/ AxiosRequestConfig,
  AxiosBasicCredentials,
} from "axios";
import { ErrorConst } from "./errors";
import { HttpError } from "http-errors";

export interface IHTTPRequest {
  get<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T>;
  post<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T>;
  put<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T>;
  postForm<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T>;
}

export interface IHTTPRequestParameters {
  url: string;
  baseURL?: string;
  headers?: object;
  data?: object | string;
  form?: FormData;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  auth?: AxiosBasicCredentials;
  queryParams?: object;
}

export default class HTTPRequest implements IHTTPRequest {
  get<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const { url, headers, queryParams } = parameters;
      const options: AxiosRequestConfig = {
        headers: {},
        params: {},
      };
      Object.assign(options.params, queryParams);
      Object.assign(options.headers, headers);
      if (res?.get("watchdog_cr_id")) {
        options.headers["watchdog_cr_id"] = res?.get("watchdog_cr_id");
      }

      axios
        .get(url, options)
        .then((response) => {
          resolve(response.data as T);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          } else if (err.request) {
            reject(this.formRequestError());
          } else {
            reject(err);
          }
        });
    });
  }

  post<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const { url, data = {}, headers } = parameters;
      const options: AxiosRequestConfig = {
        headers: {},
      };
      Object.assign(options.headers, headers);
      if (res?.get("watchdog_cr_id")) {
        options.headers["watchdog_cr_id"] = res?.get("watchdog_cr_id");
      }

      axios
        .post(url, data, options)
        .then((response) => {
          resolve(response.data as T);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          } else if (err.request) {
            reject(this.formRequestError());
          } else {
            reject(err);
          }
        });
    });
  }

  put<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const { url, data = {}, headers } = parameters;
      const options: AxiosRequestConfig = {
        headers: {},
      };
      Object.assign(options.headers, headers);
      if (res?.get("watchdog_cr_id")) {
        options.headers["watchdog_cr_id"] = res?.get("watchdog_cr_id");
      }

      axios
        .put(url, data, options)
        .then((response) => {
          resolve(response.data as T);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          } else if (err.request) {
            reject(this.formRequestError());
          } else {
            reject(err);
          }
        });
    });
  }

  postForm<T>(parameters: IHTTPRequestParameters, res?: Response): Promise<T> {
    return new Promise((resolve, reject) => {
      const { url, form = {}, headers } = parameters;
      const options: AxiosRequestConfig = {
        headers: {},
      };
      Object.assign(options.headers, headers);
      if (res?.get("watchdog_cr_id")) {
        options.headers["watchdog_cr_id"] = res?.get("watchdog_cr_id");
      }

      axios
        .post(url, form, options)
        .then((response) => {
          resolve(response.data as T);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          } else if (err.request) {
            reject(this.formRequestError());
          } else {
            reject(err);
          }
        });
    });
  }

  private formRequestError() {
    const err = new Error(ErrorConst.REQUEST_ERROR);
    const error = <HttpError>err;
    error.status = ErrorConst.SERVICE_UNAVAILABLE;
    return error;
  }
}
