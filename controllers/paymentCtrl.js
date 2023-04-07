const Razorpay = require("razorpay");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.credit * 0.25 * 100), // amount in the smallest currency unit
    currency: "INR",
  };
  const order = await instance?.orders?.create(options);
  try {
    // const userId = req.bearerId;
    const userId = "6415789655586416d24b045e";
    if (userId) {
      const user = await userModel.findOne({ _id: userId });
      user.countUsed = user.countUsed + req.body.credit;
      await user.save();
    } else {
      res.status(200).send({ success: false, message: "add userId" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching user data",
      success: false,
      error,
    });
  }
  res.status(200).send({
    success: true,
    order: order,
  });
};

const paymentVerification = async (req, res) => {
  console.log(req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    res.redirect(
      `https://silver-clafoutis-a44fda.netlify.app/`
    );
  } else {
    res.status(400).send({
      success: false,
    });
  }
};

module.exports = { checkout, paymentVerification };
