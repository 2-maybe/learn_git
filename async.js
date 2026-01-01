const file = require("fs");

const url = [
  "https://dummyjson.com/users",
  "https://dummyjson.com/recipes",
  "https://dummyjson.com/quotes",
  "https://dummyjson.com/todos",
  "https://dummyjson.com/posts",
];

const sleep = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

class RateLimiter {
  constructor({ tokenDetailes }) {
    this.newDuration = tokenDetailes.newDuration;
    this.prevDuration = tokenDetailes.newDuration;
    this.maxTokenReq = tokenDetailes.reqWindow; // MaxTokens
    this.perTimeFrame = tokenDetailes.perTimeFrame;
    this.token = 1;
  }
  _IssueToken() {
    let newTime = Date.now();
    this.prevDuration = this.newDuration;
    this.newDuration = newTime;
    let Tokens = (this.prevDuration - this.newDuration) / 1000;
    let TokensToBeIssued = Math.min(
      Tokens * this.perTimeFrame,
      this.maxTokenReq
    );
    return new Promise((res) => res(TokensToBeIssued));
  }

  async _Limiter() {
    while (true) {
      try {
        this.token = await this._IssueToken();
      } catch (error) {
        throw new Error("Error in line no 38 || Limitter err");
      }
      if (this.token >= 1) {
        this.token -= 1;
        return;
      }
      await sleep(this.perTimeFrames);
    }
  }
}

const response = (e, url,  body) => {
  return {
    name: e.name,
    statusCode: e.status,
    message: e.message,
    ErrorOccured: e.status >= 300 ? true : false,
    errUrl: url,
    body: body,
  };
};

const IsretryAbleErr = ({ err }) => {
  if (err.statusCode >= 500 || err.name == "AbortError" || !err.status) {
    return true;
  }
  return false;
};

const fetchWithRetry = async (url, signal) => {
  try {
    const dataPromise = url.map((val) =>
      fetch(val, { signal })
        .then(async(v) => {
          return response("ApiData", v.url ,  ( await v.json() ));
        })
        .catch((e) => {
          return response(e, val, "");
        })
    );
    return await Promise.all(dataPromise);
  } catch (e) {
    return response(e, "Unknnow",  "");
  }
};

const retry = async (retryUrl, retryCount, passedData = [], err = []) => {
  let aborter = new AbortController();
  let signal = aborter.signal;
  while (retryCount != 0) {
    let dataFromRetry = await fetchWithRetry(retryUrl , signal);
     if(!dataFromRetry.ErrorOccured){
         passedData.push(...dataFromRetry);
         return;
     }else{
        err.push(...dataFromRetry);
     }
     retryCount--;
  }
};

const integrityIsErrCheck = async (
  data,
  passedData = [],
  errData = [],
  retriesPerErr = 2
) => {
    let currUrl;
  try {
    // Like i wanna create a newAborter for retry which waits a bit longer
    for (let i = 0; i < data.length; ++i) {
      currUrl = data[i];
      if (data[i]?.statusCode >= 300){
        if (IsretryAbleErr(data[i])) {
               await retry(data[i]?.errUrl , retriesPerErr , passedData , errData) 
        }else{
           errData.push(...data[i]);
        }
      }
       passedData.push(...data[i]);
    }
    return;
  } catch (error) {
     if(IsretryAbleErr(error)){
         await retry(currUrl , retriesPerErr , passedData , errData);
        return
     }
       return response(error , currUrl , true , "");
  }
};

const PromisePool = async (rateLImier, howmuch, url, retries) => {
  let PassedVlauearrBlock = new Array();
  let errvaluesBlock = new Array();
  let dummyRl = new rateLImier();
  const abort = new AbortController();
  const signal = abort.signal;
  let ts = howmuch;
  let exeFetchWith_Retry = new Array.from(
    { length: url.length },
    () => fetchWithRetry
  );

  while (ts != 0) {
    try {
      await dummyRl._Limiter();
      console.log("Starting to fetch");
      for (let i = 0; i < url.length; i++) {
        let valueReceived = await exeFetchWith_Retry[i](url, signal);
        await integrityIsErrCheck(
          valueReceived,
          PassedVlauearrBlock,
          errvaluesBlock
        );
      }
    } catch (error) {}
  }
};

const main = async () => {
  let detailes = {
    // Max Token
    reqWindow: 1,
    newDuration: Date.now(),
    perTimeFrame: 1,
  };
  let rateLImier = new RateLimiter(detailes);
  const totalScrape = 5;
  console.log("Starting Time");
  let result = await PromisePool(rateLImier, totalScrape, url);
  let end = Date.now();
  console.log("Took a total tim of ", (start - end) / 1000);
};
