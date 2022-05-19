const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs');

app.set('view engine', 'ejs');

const {stringify} = require("nodemon/lib/utils");
mongoose.connect("mongodb+srv://software:software123@cluster0.cv6lp.mongodb.net/test", { useNewUrlParser: true}, {useUnifiedTopology: true})

const userSchema = {
    userType: Number,    //1 means landlord        2 means customer
    email: String,
    password: String, 
}

const apartmentSchema = {
    ApartmentStatus: Number, //1 means avilable     2 means unavilable
    price: Number,
    NumOfRooms: Number,
    NumOfBathroom: Number,
    area: Number,
    location: String,
    ContactNum: String,
    img: String,
}

const User = mongoose.model("User", userSchema);
const Apartment = mongoose.model("Apartment", apartmentSchema);
const favorite = await
    Apartment.findOne({
        name: "ApartmentID"
    });
console.log("UserID", User.UserID);

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/SignUp'));
app.use(express.static(__dirname + '/ApartmentsView'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/ApartmentsView/ApartmentsView.html")
})

app.get("/", function(req, res) {
    Apartment.find({}, function(err, apartments){
        res.render('ApartmentsView', {
            ApartmentsList: apartments 
        })
    })
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

app.post("/", function(req, res) {
    let newApartment = new Apartment({
        ApartmentStatus: req.body.ApartmentStatus,
        price: req.body.price,
        NumOfRooms: req.body.NumOfRooms,
        NumOfBathroom: req.body.NumOfBathroom,
        area: req.body.area,
        location: req.body.location,
        ContactNum: req.body.ContactNum,
        img: req.body.img
    });
    newApartment.save();
    res.redirect("/");
})
app.listen(3000, function() {
    console.log("Server is running on 3000");
});