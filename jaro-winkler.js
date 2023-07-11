const terms = require("./terms");

function jaro_winkler(s1, s2) {
  if (s1 == s2) return 1.0;

  if (s1.length == 0 || s2.length == 0) return 0.0;

  let maxDist = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;

  let match = 0;

  let arrOne = new Array(s1.length).fill(0);
  let arrTwo = new Array(s2.length).fill(0);

  for (let i = 0; i < s1.length; i++) {
    for (
      let j = Math.max(0, i - maxDist);
      j < Math.min(s2.length, i + maxDist + 1);
      j++
    )
      if (s1[i] == s2[j] && arrTwo[j] == 0) {
        arrOne[i] = 1;
        arrTwo[j] = 1;
        match++;
        break;
      }
  }

  if (match == 0) return 0.0;

  let t = 0;
  let point = 0;

  for (let i = 0; i < s1.length; i++) {
    if (arrOne[i] == 1) {
      while (arrTwo[point] == 0) point++;
      if (s1[i] != s2[point++]) t++;
    }
  }

  t /= 2;

  let jaroDist =
    (match / s1.length + match / s2.length + (match - t) / match) / 3.0;

  if (jaroDist > 0.7) {
    let prefix = 0;

    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
      if (s1[i] == s2[i]) prefix++;
      else break;
    }
    prefix = Math.min(4, prefix);

    jaroDist += 0.1 * prefix * (1 - jaroDist);
  }
  return jaroDist.toFixed(6);
}

const obj = {};
const start = Date.now();
terms.forEach((term) => (obj[term] = jaro_winkler(term, "pneis")));

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

const end = Date.now();
console.log(`Execution time: ${end - start}ms`);


let counter = 0;
terms.forEach(() => counter++);

console.log(`Total terms: ${counter}`);


const s1 = "paul johnson"
const a1 = s1.split(" ");

const s2 = "johson paule" 
const a2 = s2.split(" ");
let cummax = 0;

for(let i in a1){
    let maxscore = 0;
    for(let j in a2){
        maxscore = Math.max(maxscore, jaro_winkler(a1[i], a2[j]));
    }
    cummax += maxscore
}

console.log(cummax/a1.length);