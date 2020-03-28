const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = app;
/*
Em produção trocar para:
app.use(cors({
  origin: 'https://meulink.com'
}))

*/
