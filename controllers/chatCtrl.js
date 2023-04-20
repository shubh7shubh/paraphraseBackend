const { Configuration, OpenAIApi } = require("openai");
const userModel = require("../models/userModel");
const chatArray = [];
const chatHandle = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.bearerId;
    // const userId = "64392b5bbe83dce576781198";
    const item = { role: "user", content: content };
    chatArray?.push(item);
    const user = await userModel.findOne({ _id: userId });
    const chats = user?.chats;
    console.log("array", chatArray);
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatArray,
    });
    const result = completion.data.choices[0].message;
    chats?.push({ message: content, reply: result.content });
    user.chats = chats;
    console.log(user.chats);
    await user.save();
    console.log(completion.data.choices[0].message);
    res.status(201).send({ success: true, result: result });
  } catch (error) {
    console.log(error);
  }
};

const getAllChats = async (req, res) => {
  const userId = req.bearerId;
  // const userId = "64392b5bbe83dce576781198";
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    res.status(200).send({ success: true, chats: user.chats });
  }
};

module.exports = { chatHandle, getAllChats };
