const userModel = require("../models/userModel");
const { Configuration, OpenAIApi } = require("openai");
const session = require("express-session");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

// app.use(
//   session({
//     secret: "0Y8Yh7t1g1XqyMRc",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// user details controller
const userDetails = async (req, res) => {
  try {
    const { name, email, occupation, found, referral, hope } = req.body;
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      const newUser = new userModel({
        name,
        email,
        occupation,
        found,
        hope,
      });
      const user = await newUser?.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
      });
      if (referral) {
        const userRef = await userModel.findOne({ _id: referral });
        if (userRef) {
          const count = userRef?.countUsed + 50;
          userRef.countUsed = count;
          await userRef?.save();

          const count2 = user?.countUsed + 25;
          user.countUsed = count2;
          await user?.save();
        }
      }
      res.status(201).send({
        success: true,
        message: "Details Saved Successfully",
        token: token,
        data: user,
      });
    } else {
      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET);
      res.status(201).send({
        success: true,
        message: "Email already exists",
        token: token,
        data: userExist,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error ${error.message}`,
    });
  }
};

//get user details controller
const getUserCtrl = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const user = await userModel.findOne({ _id: userId });
      const data = {
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        profileURL: user.profileURL,
        countUsed: user.countUsed,
      };
      res.status(200).send({ success: true, data: data });
    } else {
      res.status(200).send({ success: false, message: "add userId in params" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching user data",
      success: false,
      error,
    });
  }
};

//get user id controller
const getCurrentUserCtrl = async (req, res) => {
  try {
    const userId = req.bearerId;
    res.status(201).send({ success: true, id: userId });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching user",
      success: false,
      error,
    });
  }
};

// is copied or not Ctrl
const copiedCtrl = async (req, res) => {
  try {
    // console.log(req,"eeeeeeeeeeeeeeeeeeeeeeee")
    console.log(res, "fffffffffffffffffffffff");
    // const { commentId } = req.body;
    const commentId = "64229e80f6ed2dc103338bd0";
    const user = await userModel.updateOne(
      { "results._id": commentId },
      { $set: { "results.$.copied": true } }
    );
    res.status(200).send({ success: true, message: "updated boolean value" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in updating copied",
      success: false,
      error,
    });
  }
};

//comment controller
var final = "";
const commentCtrl = async (req, res) => {
  try {
    const { data, drop, length } = req.body;
    const userId = req.bearerId;
    // const userId = "6440d8b0e2a9c5366ab8f718";
    // console.log(JSON.stringify(data));
    const ans = await runCompletion(data, drop, length);

    //adding in user database
    const user = await userModel.findOne({ _id: userId });
    const count = user?.countUsed - 1;
    if (user.countUsed != null) {
      user.countUsed = count;
    }
    const results = user?.results;
    const details = {
      emotion: drop,
      length: length,
      textbox: data,
      output: final,
    };
    results?.push(details);
    const updatedUser = await user.save();
    res.send({ message: `${final}` });
    // console.log(final);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in updating",
      success: false,
      error,
    });
  }
};

//paraphrasing controller
var para = "";
const paraphrasingCtrl = async (req, res) => {
  const { message } = req.body;
  const userId = req.bearerId;
  // const userId = "6440d659a45812f296475d40";
  // console.log(JSON.stringify(data));
  const ans = await generatePara(message);
  //adding in user database
  const user = await userModel.findOne({ _id: userId });
  const count = user?.countUsed - 1;
  user.countUsed = count;
  const paraphrase = user?.paraphrase;
  const details = {
    textbox: message,
    output: para,
  };
  paraphrase?.push(details);
  const updatedUser = await user.save();
  // const s = JSON.stringify(ans);
  res.send({ message: ans });
  // console.log(para);
};

//how many times user used website
// count used
const countUsed = async (req, res) => {
  try {
    const userId = req.bearerId;

    const user = await userModel.findOne({ _id: userId });
    if (user) {
      res.status(200).send({ success: true, count: user.countUsed });
    } else {
      res.status(200).send({ success: false, message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in fetching user data",
      success: false,
      error,
    });
  }
};

//regenerate comment
var final = "";
const regenerateCommentCtrl = async (req, res) => {
  try {
    const { data, drop, length } = req.body;
    const userId = req.bearerId;
    //     const userId = "6427ec5cd6a574855196a742";
    // console.log(JSON.stringify(data));
    const ans = await regenerateComment(data, drop, length);
    res.send({ message: `${final}` });
    // console.log(final);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in comment regenerating",
      success: false,
      error,
    });
  }
};

//regenerate paraphrasing
var para = "";
const regenerateParaCtrl = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.bearerId;
    //     const userId = "6427ec5cd6a574855196a742";
    // console.log(JSON.stringify(data));
    const ans = await regeneratePara(message);
    res.send({ message: `${para}` });
    // console.log(final);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in comment regenerating",
      success: false,
      error,
    });
  }
};

//logout controller
const logoutCtrl = async (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // res.redirect("/");
  res.send({ success: true, message: "logout success" });
};

// AI model for comment
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//comment generate
async function runCompletion(data, drop, length) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${data}. Create ${drop} comment in ${length} words`,
      },
    ],
  });
  final = completion.data.choices[0].message.content;
  // final = response.data.choices[0].text.trim();
}
//AI model for paraphrasing
async function generatePara(data) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `"${data}." Regenerate paraphrasing content for these paragraph`,
      },
    ],
  });
  para = completion.data.choices[0].message.content;
  return para;
  // return { s };
}

//commment regenerate
async function regenerateComment(data, drop, length) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${data}. Create ${drop} comment in ${length} words`,
      },
    ],
  });
  final = completion.data.choices[0].message.content;
}

//regenerate praphrase
async function regeneratePara(data) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `"${data}." Regenerate paraphrasing content for these paragraph`,
      },
    ],
  });
  para = completion.data.choices[0].message.content;
  return para;
  // return { s };
}

module.exports = {
  userDetails,
  getUserCtrl,
  copiedCtrl,
  commentCtrl,
  paraphrasingCtrl,
  regenerateCommentCtrl,
  regenerateParaCtrl,
  logoutCtrl,
  countUsed,
  getCurrentUserCtrl,
};
