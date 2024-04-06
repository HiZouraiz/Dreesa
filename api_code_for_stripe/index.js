const express = require("express");
const cors = require("cors");
const stripePaymentRouter = require("./api/stripe_payment");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Stripe payment router
app.use("/api/v1/stripe_payment", stripePaymentRouter);

// Define root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Listen to the port
app.listen(port, () => {
  console.log("Express Server is running at port : " + port);
});

module.exports = app;
