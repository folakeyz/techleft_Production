const path = require("path");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");

const app = express();

//Boy Parser
app.use(express.json());

app.use(morgan("dev"));

//Set static folder
app.get("*", function (req, res, next) {
  if (req.headers["x-forwarded-proto"] != "https")
    res.redirect(`https://${req.hostname}` + req.url);
  else next(); /* Continue to other routes if we're not redirecting */
});
app.use(express.static(path.join(__dirname, "public")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(
  PORT,
  console.log(`Server running in Production mode on port ${PORT}`.yellow)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close Server & exit Process

  server.close(() => process.exit(1));
});
