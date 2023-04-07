const Razorpay = require("razorpay");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkout = async (req, res) => {
  try {
    const options = {
      amount: parseInt(req.body.credit) * 100,
      currency: "INR",
    };
    const order = await instance?.orders?.create(options);

    const userId = req.bearerId;
    // const userId = "6415789655586416d24b045e";
    if (userId) {
      const user = await userModel.findOne({ _id: userId });
      user.countUsed = user.countUsed + parseInt(req.body.credit/0.25);
      await user.save();
    } else {
      res.status(200).send({ success: false, message: "add userId" });
    }
    res.status(200).send({
      success: true,
      order: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching user data",
      success: false,
      error,
    });
  }
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
    res.redirect(
      `https://silver-clafoutis-a44fda.netlify.app/`
     );
  
//   if (isAuthentic) {
//     res.redirect(
//       `https://silver-clafoutis-a44fda.netlify.app/`
//     );
//   } else {
//     res.status(400).send({
//       success: false,
//     });
//   }
};

module.exports = { checkout, paymentVerification };
