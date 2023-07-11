const terms = require('./terms');

const levenshtein = function(s1, s2){
    const matrice = [];

    for(let i = 0; i <= s2.length; i++){
        matrice[i] = [i];
    }
    for(let j = 0; j <= s1.length; j++){
        matrice[0][j] = j;
    }
    for(let j = 1; j <= s2.length; j++){
        for(let i = 1; i <= s1.length; i++){
            const cost = s1[i - 1] == s2[j - 1] ? 0 : 1;
            matrice[j][i] = Math.min(
                matrice[j][i - 1] + 1,
                matrice[j - 1][i] + 1,
                matrice[j - 1][i - 1] + cost
            );
        }
    }
    return matrice[s2.length][s1.length]
}


const start = Date.now();

const obj = {}
terms.forEach((term) => obj[term] = levenshtein(term, "pneis"));

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


const end = Date.now();

console.log(`Execution time: ${end - start}ms`);