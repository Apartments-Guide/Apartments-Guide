const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs');

app.set('view engine', 'ejs');

const { stringify } = require("nodemon/lib/utils");
mongoose.connect("mongodb+srv://software:software@cluster0.cv6lp.mongodb.net/apartmentsGuide", { useNewUrlParser: true}, {useUnifiedTopology: true})

const userSchema = {
    userType: Number,           //1 means landlord        2 means customer
    email: String,
    password: String, 
}

const apartmentSchema = {
    apartmentStatus: Number,    //1 means avilable        2 means unavilable
    userID: Number,
    apartmentPicture: String,
    price: Number,
    numOfRooms: Number,
    numOfBathroom: Number,
    area: Number,
    location: String,
    contactNum: String,
    description: String,
    img: String,
}

const User = mongoose.model("User", userSchema);
const Apartment = mongoose.model("Apartment", apartmentSchema);

// const favorite = await
//     Apartment.findOne({
//         name: "ApartmentID"
//     });
// console.log("UserID", User.UserID);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + '/Home'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/Add'));
// app.use(express.static(__dirname + '/Login'));
// app.use(express.static(__dirname + '/SignUp'));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/Home/home.html")
});
app.get("/signup", function(req, res) {
    res.sendFile(__dirname + "/SignUp/sign_up.html")
});
app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/Login/login.html")
});
app.get("/apartments_view", function(req, res) {
    Apartment.find({}, function(err, apartments){
        res.render('apartmentsView', {
            apartmentsList: apartments 
        })
        if(apartments.length) console.log(apartments);
        else console.log("Apatrtments not Found");
    })
});
app.get("/addapartments", function(req, res) {
    res.sendFile(__dirname + "/Add/AddApartment.html")
});


app.post("/signup", function(req, res) {
    let newUser = new User({
        userType: req.body.userType,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save();
    res.redirect("/login");
})

app.post("/login", function(req, res) {
    const checkUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({email:checkUser.email}, function(err, user){
        if(user) {
            if(user.password == checkUser.password) {
                if(user.userType == '1')
                    res.redirect("/addapartments");
                else
                    res.redirect("/apartments_view");
            }
            else {
                console.log('Password is wrong'); //Show it to the user
            }
        } else {
            console.log('Email is not found'); //Show it to the user
        }
    })
    
})

app.post("/addapartments", function(req, res) {
    let newApartment = new Apartment({
        ApartmentStatus: req.body.ApartmentStatus,
        price: req.body.price,
        numOfRooms: req.body.numOfRooms,
        numOfBathroom: req.body.numOfBathroom,
        area: req.body.area,
        location: req.body.location,
        contactNum: req.body.contactNum,
        description: req.body.description,
        img: req.body.img
    });
    newApartment.save();
    console.log("Apartment is saved")
    res.redirect("/apartments_view");
})

// app.post("/add_apartment", function(req, res) {
//     let newApartment = new Apartment({
//         apartmentStatus: 1,
//         apartmentPicture: "imgp2.jpg",
//         userID: 3,
//         price: 250,
//         numOfRooms: 3,
//         numOfBathroom: 2,
//         area: 60,
//         location: "Naser, Gaza",
//         contactNum:"0595354679",
//         description: "The apartment is in good location"
//     });
//     newApartment.save();
//     console.log("Apartment is saved")
//     res.redirect("/");
// })


app.listen(3000, function() {
    console.log("Server is running on 3000");
});