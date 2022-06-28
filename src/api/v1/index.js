const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/api/v1/", require("./routes/post.routes"));

app.listen(PORT, () => console.log("Sever running port: ", PORT));
