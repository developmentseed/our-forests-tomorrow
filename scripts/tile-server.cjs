var path = require("path");
var express = require("express");
var app = express();
var cors = require("cors");

const PORT = 9090;

console.log(`on port ${PORT}`);

app.use(cors());
app.use(function (req, res, next) {
  var ext = path.extname(req.url);
  if (ext !== ".png" && !req.url.match("fonts")) {
    res.setHeader("Content-Encoding", "gzip");
  }
  next();
});
const tilePath = path.join(__dirname, "../out/pbf");
console.log(tilePath);
app.use(express.static(tilePath));

app.listen(PORT);
