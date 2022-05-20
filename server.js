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

app.get("/addapartments", function(req, res) {
    res.sendFile(__dirname + "/Add/AddApartment.html")
});


app.post("/signup", function(req, res) {
    let userType = req.body.userType;
    let email = req.body.email;
    let password = req.body.password;
    


    // function checkEmptyInput(email, password) {
    //     if (email == '' || password == '') {
    //         //msgEmpty.style.display = "block";
    //         return true
    //     }
    //     return false
    // }  
    
    // function IsValidEmail(email){
    //     let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //     if(email.match(validRegex) != null){
    //         return true;
    //     }
    //     // mailIncorrectMsg.style.display = "block"
    //     return false;
    // }
    
    // function isVaalidPassword(password){
    //     let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    //     if(password.match(strongRegex) != null){
    //         return true;
    //     }
    //     //passMsg.style.display = "block"
    //     return false;
    // }

    // function IsValidData (email, password){
    //     if(checkEmptyInput(email, password)) return;
    //     IsValidEmail(email)
    //     isVaalidPassword(password)
    //     return IsValidEmail(email) && isVaalidPassword(password);
    // }

    //if(IsValidData(email,password)){    
        let newUser = new User({
            userType: userType,
            email: email,
            password: password
        });
        newUser.save();
        res.redirect("/login");
    //}
})


// app.post("/showpassword",function showPassword() {
//     const togglePassword = document.getElementsByClassName('hidePsw')[0];
//     togglePassword.onclick = function () {
//       let password = document.getElementById('password');
//       // toggle the type attribute
//       const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//       password.setAttribute('type', type);
//       // toggle the eye slash icon
//       const src= togglePassword.getAttribute('src')==='../assets/img/hideEye.svg'?'../assets/img/showEye.svg':'../assets/img/hideEye.svg';
//       togglePassword.setAttribute('src',src);
//     };
// })

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