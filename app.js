var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
const mercadopago = require("mercadopago");

// Int

// Agrega credenciales

// Settings

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Router

app.get("/", function (req, res) {
  res.render("home", { global: global });
});

// http://alepiumetti-mp-commerce-nodejs.herokuapp.com/success?
// collection_id=12063062643&
// collection_status=approved&
// payment_id=12063062643&
// status=approved&
// external_reference=null&
// payment_type=credit_card&
// merchant_order_id=1910872933&
// preference_id=469485398-8129c4c8-3f27-4955-904a-fefa2c29fa04&
// site_id=MLA&processing_mode=aggregator&merchant_account_id=null

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

app.post("/notifications", function (req, res) {});

app.get("/detail", function (req, res) {
  mercadopago.configure({
    access_token:
      "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
  });

  let preference = {
    items: [
      {
        id: "1234",
        title: req.query.title,
        description: "Dispositivo móvil de Tienda e-commerce",
        picture_url: req.query.img,
        unit_price: parseInt(req.query.price),
        quantity: parseInt(req.query.unit),
        currency_id: "ARS",
      },
    ],
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_63274575@testuser.com",
      phome: {
        area_code: "11",
        number: "22223333",
      },
      adress: {
        street_name: "False",
        street_number: "123",
        zip_code: "1111",
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
      res.render("detail", {
        id: response.body.id,
        query: req.query,
        link: response.body.init_point,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 3000);
