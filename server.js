var express = require("express");
var http = require("http");
var app = express();

// pinging
app.use(express.static("public"));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendStatus(200);
});
app.get("/invite", function(req, res) {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=583372268923518977&scope=bot&permissions=388160"
  );
});
app.get("/server", (req, res) => {
  res.redirect("https://discord.gg/X3yeKgN");
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
