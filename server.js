const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://software:software@cluster0.cv6lp.mongodb.net/apatmentsGuide", { useNewUrlParser: true}, {useUnifiedTopology: true})


const userSchema = {
    userType: Number,    //1 means landlord        2 means customer
    email: String,
    password: String, 
}
const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/SignUp'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/SignUp/sign_up.html")
})

app.post("/", function(req, res) {
    let newUser = new User({
        userType: req.body.userType,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save();
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server is running on 3000");
});