const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.send("Express is working")
})
app.listen(3000, function() {
    console.log("Server is running on 3000");
});