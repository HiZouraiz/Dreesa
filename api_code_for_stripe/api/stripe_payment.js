require("dotenv").config();
const stripe = require("stripe")(
  ""
);

module.exports = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(req.body.amount * 100),
      currency: req.body.currency,
      payment_method_types: ["card"],
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      status: 200,
      key: clientSecret,
    });
  } catch (e) {
    res.json({
      status: 400,
      error: e.message,
    });
  }
};
