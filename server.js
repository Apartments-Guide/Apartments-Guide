const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs');

app.set('view engine', 'ejs');

const { stringify, home } = require("nodemon/lib/utils");
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

    price: Number,
    numOfRooms: Number,
    numOfBathroom: Number,
    area: Number,
    location: String,
    contactNum: String,
    description: String,
    apartmentPicture: String,
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
// app.use(express.static(__dirname + '/views/sign'));



app.get("/", function(req, res) {
    res.sendFile(__dirname + "/Home/home.html")
});



app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/Login/login.html")
});
app.get("/apartments_view", function(req, res) {
    Apartment.find({}, function(err, apartments){
        res.render('apartmentsView', {
            apartmentsList: apartments 
        })
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

app.get("/addapartments", function(req, res) {
    res.sendFile(__dirname + "/Add/AddApartment.html")
});

app.get("/signup", function(req, res) {
    res.render('signup', {
        passwordCheck: ""
    })
});

app.post("/signup", function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email:email}, function(err, user){
        if(!user){
            let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            if(password.match(strongRegex) != null){
                let newUser = new User({
                    userType: req.body.userType,
                    email: email,
                    password: password
                });
                newUser.save();
                res.redirect("/login");
            }         
            else{
                res.render('signup',{
                    passwordCheck: 'The password is weak, try more than 8 chars include A-Z, a-z, 0-9, !@#%&'
                })
            }
        }
        else{
                res.render('signup',{
                    passwordCheck: 'Email is already taken'
                })
        }  
    })
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
                res.render('login',{
                    passwordCheck: 'Password is wrong'
                })
            }
        } else {
            res.render('login',{
                passwordCheck: 'Email is not found'
            })
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
        apartmentPicture: req.body.apartmentPicture
    });
    newApartment.save();
    res.redirect("/apartments_view");
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