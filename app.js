const { createReadStream } = require("fs");
const csv = require("csvtojson");
const { createGunzip } = require("zlib");
const { Transform } = require("stream");

//Mark Tasaka

let profit = 0;

// -----Your filterByCountry function here:-----
function filterByCountry(input) {
  return new Transform({
    transform: (chunk, enc, callback) => {
      const parsedData = JSON.parse(chunk);

      if(parsedData.country === input)
        {
          callback(null, chunk);
        }
        else{
          callback(null);
        }
    },
  });
}
//----------------------------------------------

// --------Your sumProfit function here:--------
function sumProfit() {
  return new Transform({
    transform: (chunk, enc, callback) => {
      callback(null);
      
      const parsedData = JSON.parse(chunk);
      let eachProfit = 0;
      eachProfit = parseFloat(parsedData.profit);
      profit += eachProfit;
    },
    flush: (callback) => {
      const formatedProfitNumber = profit.toLocaleString();
      console.log("$" + formatedProfitNumber);
    }
  });
}
//----------------------------------------------

createReadStream("data.csv.gz")
  .pipe(createGunzip())
  .pipe(csv())
  .pipe(filterByCountry("Italy"))
  .pipe(sumProfit()).pipe(process.stdout);
