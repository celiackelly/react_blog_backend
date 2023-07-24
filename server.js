const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB!"))
  .catch((err) => console.log(err.message));

//model
const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  image: String,
});

const Post = mongoose.model("Post", postSchema);

//controllers
//no need for controllers to render pages, as the React front end router will take care of that.
//get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
});

//get one post
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (err) {
    console.log(err);
  }
});

//create one post
//add server-side validation of required post fields
app.post("/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.send(savedPost);
  } catch (err) {
    console.log(err);
  }
});

//delete post
app.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).send("Post deleted");
  } catch (err) {
    console.log(err);
  }
});

//Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}!`);
});
