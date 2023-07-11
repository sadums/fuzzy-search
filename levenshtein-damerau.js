const terms = require('./terms');

function levenshtein_damerau(a, b) {
    const sigma = 256;
  
    const da = new Array(sigma).fill(0);
  
    const d = [];
    const maxDist = a.length + b.length;
    for (let i = 0; i <= a.length; i++) {
      d[i] = new Array(b.length + 1);
      d[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
      d[0][j] = j;
    }
  
    for (let i = 1; i <= a.length; i++) {
      let db = 0;
      for (let j = 1; j <= b.length; j++) {
        const k = da[b[j - 1]];
        const l = db;
        let cost;
        if (a[i - 1] === b[j - 1]) {
          cost = 0;
          db = j;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(
          d[i - 1][j - 1] + cost,
          d[i][j - 1] + 1,
          d[i - 1][j] + 1,
          (k > 0 && l > 0) ? (d[k - 1][l - 1] + (i - k - 1) + 1 + (j - l - 1)) : maxDist
        );
      }
      da[a[i - 1]] = i;
    }
  
    return d[a.length][b.length];
  }


  
  const obj = {}
  const start = Date.now();
  terms.forEach((term) => obj[term] = levenshtein_damerau(term, "pneis"));
  
  const end = Date.now();
  let sortable = [];
  for (let key in obj) {
      sortable.push([key, obj[key]]);
  }
  
  sortable.sort(function(a, b) {
      return a[1] - b[1];
  });
  
  for(let i = 0; i < 20; i++){
    console.log(sortable[i][0], sortable[i][1]);
  }
  
  
  
  console.log(`Execution time: ${end - start}ms`);