const terms = require("./terms");

const jaro = function (s1, s2) {
  if (s1 == s2) return 1.0;

  const maxDist = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;

  let match = 0;

  let arrOne = Array(s1.length).fill(0);
  let arrTwo = Array(s1.length).fill(0);

  for (let i = 0; i < s1.length; i++) {
    for (
      let j = Math.max(0, i - maxDist);
      j < Math.min(s2.length, i + maxDist + 1);
      j++
    ) {
      if (s1[i] == s2[j] && arrTwo[j] == 0) {
        arrOne[i] = 1;
        arrTwo[i] = 1;
        match++;
        break;
      }
    }
  }

  if (match == 0) return 0.0;

  let t = 0;
  let point = 0;

  for (let i = 0; i < s1.length; i++) {
    if (arrOne[i]) {
      while (arrTwo[point] == 0) point++;
      if (s1[i] != s2[point++]) t++;
    }
  }

  t /= 2;

  return (match / s1.length + match / s2.length + (match - t) / match) / 3;
};

const obj = {};
const start = Date.now();
terms.forEach((term) => (obj[term] = jaro(term, "pneis")));

const end = Date.now();
let sortable = [];
for (let key in obj) {
  sortable.push([key, obj[key]]);
}

sortable.sort(function (a, b) {
  return b[1] - a[1];
});

for (let i = 0; i < 15; i++) {
  console.log(sortable[i][0], sortable[i][1]);
}

console.log(`Execution time: ${end - start}ms`);
