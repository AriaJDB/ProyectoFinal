const express = require("express");
const path = require("path");
const rutas = require("./routes/rutas");
const app = express();
const bodyParser = require('body-parser');

app.use("/", express.static(path.join(__dirname, "/web")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", rutas);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor en http://127.0.0.1:" + port);
});
