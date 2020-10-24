var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var cors = require("cors");
const mercadopago = require("mercadopago");

// Int

// Agrega credenciales
mercadopago.configure({
  access_token:
    "TEST-290701534392819-092401-381de3c84fb7cc1f6fb78bb0b56687b6-350651466",
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

app.use(cors());

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
