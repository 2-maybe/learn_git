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

const map = hashMap();
map.add("abhiral");
map.add("hello");
map.add("world");
map.add("insert");
map.add("winston");
map.add("logger");
map.add("afjlasfj3#4343kfjkdfj");

const val = map.get("afjlasfj3#4343kfjkdfj");
console.log(val);
