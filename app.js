var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
const mercadopago = require("mercadopago");

// Int

// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
});

// Settings

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Router

app.get("/", function (req, res) {
  res.render("home", { global: global });
});

app.get("/detail", function (req, res) {
  let preference = {
    items: [
      {
        title: req.query.title,
        unit_price: parseInt(req.query.price),
        quantity: parseInt(req.query.unit),
        currency_id: "ARS",
      },
    ],
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      console.log(response.body);
      res.render("detail", {
        id: response.body.id,
        query: req.query,
        link: response.body.sandbox_init_point,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
