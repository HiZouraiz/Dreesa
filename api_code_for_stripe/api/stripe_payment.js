require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51MfltGLxy1IjoLHfADATcTaEtey8n3admxkXs4gt2Bd0FQNctiyEJi6Nie3VOOVgAB7bP5ydYsAtahNpsYPvPNn100iwVitVPF"
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
