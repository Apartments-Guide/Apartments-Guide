const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs');

app.set('view engine', 'ejs');

const { stringify } = require("nodemon/lib/utils");
mongoose.connect("mongodb+srv://software:software@cluster0.cv6lp.mongodb.net/apartmentsGuide", { useNewUrlParser: true}, {useUnifiedTopology: true})

const userSchema = {
    userID: Number,
    userType: Number,           //1 means landlord        2 means customer
    email: String,
    password: String, 
}

const apartmentSchema = {
    apartmentStatus: Number,    //1 means avilable        2 means unavilable
    apartmentID: Number,
    userID: Number,
    apartmentPicture: String,
    price: Number,
    numOfRooms: Number,
    numOfBathroom: Number,
    area: Number,
    location: String,
    contactNum: String,
    description: String,
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
        //if(apartments.length) console.log(apartments);
        //else console.log("Apatrtments not Found");
    })
});

app.get("/apartment_details", function(req, res) {
    var apartmentID = getQueryVariable("apartmentID");

    Apartment.findOne({apartmentID: apartmentID}, function(err, details){
        res.render('details', {
            details: details 
        })
    })

    function getQueryVariable(variable) {
    var query = req._parsedUrl.search.substring(1);
    var vars = query.split("?");

    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
        return pair[1];
        }
    } 
    console.log('Query Variable ' + variable + ' not found');
    }
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



//Landlord adds apartment
app.post("/add_apartment", function(req, res) {
    let newApartment = new Apartment({
        ApartmentStatus: req.body.ApartmentStatus,
        userID: req.body.userID,
        price: req.body.price,
        numOfRooms: req.body.numOfRooms,
        numOfBathroom: req.body.numOfBathroom,
        area: req.body.area,
        location: req.body.location,
        contactNum: req.body.contactNum,
        description: req.body.description
    });
    newApartment.save();
    res.redirect("/");
})

// app.post("/add_apartment", function(req, res) {
//     let newApartment = new Apartment({
//         apartmentStatus: 1,
//         apartmentPicture: "imgp3.jpg",
//         userID: 4,
//         price: 200,
//         numOfRooms: 2,
//         numOfBathroom: 1,
//         area: 70,
//         location: "Jalal St., Khanyuons",
//         contactNum:"0595434226",
//         description: "You'll never find a great deal like this"
//     });
//     newApartment.save();
//     console.log("Apartment is saved")
//     res.redirect("/");
// })


app.listen(3000, function() {
    console.log("Server is running on 3000");
});