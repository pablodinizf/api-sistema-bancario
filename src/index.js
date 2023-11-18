require("dotenv/config");
const express = require("express");
const rotas = require("./roteador");

const app = express();

app.use(express.json());

app.use(rotas);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT);
