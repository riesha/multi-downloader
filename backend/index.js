const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jobs = require("./jobs");
const ratelimit = require("express-rate-limit");

const port = 3000;
const limiter = ratelimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
});

const YTDlpWrap = require("yt-dlp-wrap").default;
const ytDlpWrap = new YTDlpWrap("dlp.exe");

app.use(cors());
app.use("/api", limiter);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(__dirname + "/downloads"));

jobs.initjobs();

app.post("/api", async (req, res) => {
  const options = {
    root: path.join(__dirname + "/downloads"),
  };
  const fileName = (Math.random() + 1).toString(36).substring(7);
  let data = req.body;

  if (!data.link || !data.mode) {
    console.log("Invalid request, missing link or mode");
    res.status(500).send("Invalid request, missing link or mode");
    return;
  }

  let result = await ytDlpWrap.execPromise([
    data.link,
    "-f",
    "best",
    "-o",
    `/downloads/${fileName}`,
  ]);

  console.log(`Downloaded ${fileName}`);
  res.download(fileName, options);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
