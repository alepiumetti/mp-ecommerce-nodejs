var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
const mercadopago = require("mercadopago");
var bodyParser = require("body-parser");

// Int

// Agrega credenciales

// Settings

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Router

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("home", { global: global });
});

app.get("/success", function (req, res) {
  res.render("success", {
    payment_id: req.query.payment_id,
    external_reference: req.query.external_reference,
    payment_type: req.query.payment_type,
  });
});

app.get("/failure", function (req, res) {
  res.render("failure");
});

app.get("/pending", function (req, res) {
  res.render("pending");
});

app.post("/notifications", function (req, res) {
  console.log("req.body", req.body);
  res.end();
});

app.post("/detail", function (req, res) {
  console.log(req.body);

  mercadopago.configure({
    access_token:
      "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
  });

  let preference = {
    items: [
      {
        id: "1234",
        title: req.body.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: req.body.img,
        unit_price: parseInt(req.body.price),
        quantity: parseInt(req.body.unit),
        currency_id: "ARS",
      },
    ],
    payer: {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phome: {
        area_code: req.body.area_code,
        number: req.body.phone_number,
      },
      adress: {
        street_name: req.body.street_name,
        street_number: req.body.street_number,
        zip_code: req.body.zip_code,
      },
    },
    payment_methods: {
      excluded_payment_methods: [
        {
          id: "amex",
        },
      ],
      excluded_payment_types: [
        {
          id: "redlink",
        },
      ],
      installments: 6,
    },
    back_urls: {
      success: "alepiumetti-mp-commerce-nodejs.herokuapp.com/success",
      failure: "alepiumetti-mp-commerce-nodejs.herokuapp.com/failure",
      pending: "alepiumetti-mp-commerce-nodejs.herokuapp.com/pending",
    },
    auto_return: "approved",
    notification_url:
      "alepiumetti-mp-commerce-nodejs.herokuapp.com/notifications",
    external_reference: "alepiumetti@gmail.com",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      console.log(response.body);
      res.redirect(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/detail", (req, res) => {
  res.render("detail", { query: req.query });
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
