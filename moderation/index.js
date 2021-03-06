const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/moderation/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received: ", type);

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://eventbus-clusterip-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });
  }
});

app.listen(4003, () => {
  console.log("Moderation service is listening on port 4003");
});
