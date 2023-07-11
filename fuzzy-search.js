let terms;

fetch("./terms.json")
  .then((response) => response.json())
  .then((data) => (terms = data));

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

const monge_elkan = function (s1, s2) {
  const a1 = s1.split(" ");
  const a2 = s2.split(" ");

  let cummax = 0;

  for (let i in a1) {
    let maxscore = 0;
    for (let j in a2) {
      maxscore = Math.max(maxscore, jaro_winkler(a1[i], a2[j]));
    }
    cummax += maxscore;
  }

  return cummax / a1.length;
};

const search = document.getElementById("search");
const result1 = document.getElementById("result-1");
const result2 = document.getElementById("result-2");
const result3 = document.getElementById("result-3");
const result4 = document.getElementById("result-4");
const result5 = document.getElementById("result-5");

const time = document.getElementById("time");

const avgTimeEl = document.getElementById("avgTime");

let totalTime = 0;
let totalSearches = 0;
let avgTime = 0;

search.addEventListener("keyup", async () => {
  const start = Date.now();
  const topFive = [
    [null, 0.85],
    [null, 0.85],
    [null, 0.85],
    [null, 0.85],
    [null, 0.85],
  ];
  const searched = search.value;
  for (let i = 0; i < terms.length; i++) {
    const result = jaro_winkler(searched, terms[i]);
    if (result > 0.85) {
      if (result > topFive[4][1]) {
        topFive.pop();
        topFive.push([terms[i], result]);
        topFive.sort(function (a, b) {
          return b[1] - a[1];
        });
      }
    }
  }
  result1.textContent = topFive[0][0];
  result2.textContent = topFive[1][0];
  result3.textContent = topFive[2][0];
  result4.textContent = topFive[3][0];
  result5.textContent = topFive[4][0];
  const end = Date.now();

  time.textContent = `Time spent: ${end - start}ms`;
  totalTime += end - start;
  totalSearches++;
  avgTime = totalTime / totalSearches;
  avgTimeEl.textContent = `Average time spent: ${avgTime}ms`;
});
