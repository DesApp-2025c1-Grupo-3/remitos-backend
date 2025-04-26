/* eslint-disable no-console */
const express = require("express");

const compression = require("compression");

const cookieParser = require("cookie-parser");

const cors = require("cors"); //const helmet = require("helmet");

const logger = require("morgan");

const routes = require("./routes/estado.routes"); // <-- después vemos si hay que ajustar más adentro de routes

const config = require("./config/config.js");

const app = express();
/**
 * Get port from environment and store in Express.
 */

app.set("port", config.port || "3002");
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser()); //app.use(helmet());

app.use(cors());
app.use(compression());
app.use("/", routes);
module.exports = app;
//# sourceMappingURL=app.js.map
