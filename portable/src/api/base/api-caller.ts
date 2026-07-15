type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const PROXY_URL = "https://proxy.attachment-aditya.workers.dev/";

interface ApiCallerConfig {
  baseApiUrl: string;
  defaultHeaders?: { [key: string]: string };
  referrer?: string;
  mode?: "cors" | "no-cors" | "same-origin";
  credentials?: "omit" | "same-origin" | "include";
  proxied?: boolean;
  lsCacheTTL?: number | null;
  lsCached?: boolean;
  retries?: number;
  retryDelay?: number;
}

export class ApiCaller {
  private baseApiUrl: string;
  private defaultHeaders: { [key: string]: string };
  private referrer?: string;
  private mode?: "cors" | "no-cors" | "same-origin";
  private credentials?: "omit" | "same-origin" | "include";
  private proxied: boolean;
  private lsCacheTTL: number | null;
  private lsCached: boolean;
  private retries: number;
  private retryDelay: number;

  constructor({
    baseApiUrl,
    defaultHeaders = {},
    referrer,
    mode = "cors",
    credentials = "same-origin",
    proxied=false,
    lsCacheTTL = null,
    lsCached = false,
    retries = 0,
    retryDelay = 1000,
  }: ApiCallerConfig) {
    this.baseApiUrl = baseApiUrl;
    this.defaultHeaders = defaultHeaders;
    this.referrer = referrer;
    this.mode = mode;
    this.credentials = credentials;
    this.proxied = proxied;
    this.lsCacheTTL = lsCacheTTL;
    this.lsCached = lsCached;
    this.retries = retries;
    this.retryDelay = retryDelay;
  }

  async callApi(
    endpoint: string,
    method: Method = "GET",
    body: string | undefined = undefined,
    extraOptions: Partial<{
      headers: { [key: string]: string };
      referrer: string;
      mode: "cors" | "no-cors" | "same-origin";
      credentials: "omit" | "same-origin" | "include";
    }> = {},
    config: {
      proxied?: boolean;
      lsCached?: boolean;
      lsCacheTTL?: number | null;
      retries?: number | null;
    } = {}
  ): Promise<unknown> {
    const keyStatic = `${this.baseApiUrl}:${endpoint}`
    const keyDynamic = `${method}:${body}`;
    const lsCacheKey = `apiCache::${keyStatic}:${keyDynamic}`;
    const lsCachedData = localStorage.getItem(lsCacheKey);
    let lsCached = config.lsCached || this.lsCached;
    let lsCacheTTL = config.lsCacheTTL || this.lsCacheTTL;
    let proxied = config.proxied || this.proxied;

    if (lsCachedData) {
      const { timestamp, data } = JSON.parse(lsCachedData);
      const alive = lsCacheTTL
        ? (Date.now() - timestamp < lsCacheTTL)
        : true;

      if (!alive) {
        localStorage.removeItem(lsCacheKey);
      } else {
        return data;
      }
    }

    const finalUrl = this.baseApiUrl + endpoint;

    const finalHeaders = {
      method,
      body,
      headers: this.defaultHeaders,
      referrer: this.referrer,
      mode: this.mode,
      credentials: this.credentials,
      ...extraOptions,
    }

    let response: Response;

    if (!proxied) {
      response = await fetch(finalUrl, finalHeaders);
    } else {
      response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: finalUrl,
          options: finalHeaders,
        }),
      });
    }

    if (!response.ok) {
      let retries = config.retries || 0;

      if (retries === null || retries === undefined) {
        retries = this.retries;
      }

      if (retries <= 0) {
        throw new Error(`API call failed with status ${response.status}`);
      } else {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));

        return this.callApi(
          endpoint,
          method,
          body,
          extraOptions,
          {
            ...config,
            retries: retries - 1
          }
        );
      }
    }

    const responseData = await response.json();

    if (lsCached) {
      localStorage.setItem(lsCacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: responseData,
      }));
    }

    return responseData;
  }
}

