const { json } = require("express");

let arr = new Array();

let nameToSearch = "abhiral";

const hashMap = () => {
  let map = [];
  const calHash = (nameToSearch) => {
    let hash = 0;
    for (const key in nameToSearch) {
      hash += nameToSearch.charCodeAt(key);
    }
    return hash;
  };
  return {
    add: (name) => {
      let idx = calHash(name);
      map[idx] = name;
      console.log(name, " added successfully at index ", idx);
    },
    get: (name) => {
      let idx = calHash(name);
      console.log("Found at index", idx);
      return map[idx] + " return value";
    },
  };
};

// const map = hashMap();
// map.add("abhiral");
// map.add("hello");
// map.add("world");
// map.add("insert");
// map.add("winston");
// map.add("logger");
// map.add("afjlasfj3#4343kfjkdfj");

// const val = map.get("afjlasfj3#4343kfjkdfj");

// Hash



let dependecies = {
  bytes: "^3.1.2",
  content_type: "^1.0.5",
  debug: "^4.4.3",
  http_errors: "^2.0.0",
  iconv_lite: "^0.7.0",
  on_finished: "^2.4.1",
  qs: 6 ,
  raw_body: "^3.0.1",
  type_is: "^2.0.1",
};

let incomming = {
   bytes: "^3.1.3",
  content_type: "^1.0.5",
  debug: "^4.4.3",
  http_errors: "^2.0.0",
  iconv_lite: "^0.7.0",
  on_finished: "^2.4.1",
  qs: 6 ,
  raw_body: "^3.0.1",
  type_is: "^2.0.1",
};
let hashv1 = "";
let hashv2 = "";
for(const key in dependecies){
     hashv1 += dependecies[key]
};
for(const key in incomming){
     hashv2+= incomming[key]
};

console.log(hashv1 , "\n" , hashv2);
console.log(hashv1 == hashv2 ? "Same Dep" : "Changed Dep");
