const express = require('express');
const session = require('express-session');
const app = express()
const Session = require("express-session")
// const cookieParser = require('cookie-parser')
// const users = require('./routes/users.js')
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "kuwait", {signed : true})
//     res.send("signed cookie!")
// });

// app.get("/verify", (req, res) =>{
//     console.log(req.signedCookies);
//     res.send("cookies varify")
// })


// app.get("/getcookies", (req,res) => {
//     res.cookie("hello", "dubai");
//     res.cookie("madeIn", "Dubai")
//     res.send("sent you a cookies!");
// })

// app.get("/greet" , (req,res) =>{
//     let {name = "saksham"} = req.cookies
//     res.send(`hi ${name}`)
// })
// app.get("/" , (req, res) =>{
//     console.dir(req.cookies)
//     res.send("hello guys im in port 3000 and slash router")
// })
 

const sessionOptions = {
    secret : "mysupersecretstring",
    resave: false,
    saveUninitialized : true 
}


app.use(Session(sessionOptions) )

app.get("/register" , (req, res) =>{
    let {name = "shahana"} =  req.query;
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(name);
    res.redirect("/hello")
})


app.get("/hello", (req, res) => {
    res.send(`hello, ${req.session.name}`)
});







// app.get("/reqcount", (req,res) =>{
//     if(req.session.count){
//         req.session.count ++;
//     }
//     else{
//         req.session.count = 1;
//     }
    
//     res.send(`you send a request ${req.session.count} times`);
// })



// app.get("/test", (req, res) =>{
//     res.send("test successful");
// })



app.listen(3000, () =>{
    console.log("server is listening on port 3000");
})