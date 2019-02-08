const converter = require('./currency-converter');
const express = require("express");
const path = require('path');
  
const app = express();
  
app.set("view engine", "pug");
 
app.use(express.static(path.join(__dirname, "public")));

app.use("/list", async (request, response)=>{
  var res =
  {
    list: await converter.getCountriesList(),
    response: await converter.convertCurrency("USD","RUB",20),
    url: "http://localhost:3000"
  }
    response.render("list", {
        title: "список",
        res: res,
        url: "http://localhost:3000"
    });
});
app.use("/", async (request, response)=>{
    response.render("index", {
        title: "Мои контакты",
        res: await GetResponceData(request)
    });
});
app.listen(3000);

async function GetResponceData(request) {
  if (request.query.from !== undefined && request.query.to !== undefined && (request.query.ammount !== undefined || request.query.ammount === 0)) {
    var res = {
      list: await converter.getCountriesList(),
      defaultResponse: false,
      prevState:{
        ammount:request.query.ammount,
        from:request.query.from,
        to:request.query.to,
      },
      response: await converter.convertCurrency(request.query.from, request.query.to, Number.parseFloat(request.query.ammount)),
      url: "http://localhost:3000"
    };
  }
  else {
    var res = {
      list: await converter.getCountriesList(),
      defaultResponse: true,
      prevState:{
        ammount:0,
        from:"",
        to:"",
      },
      response: await converter.convertCurrency("USD", "RUB", 1),
      url: "http://localhost:3000"
    };
  }
  return res;
}
