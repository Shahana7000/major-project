const express = require('express');
const Router = express.Router();


Router.get("/" , (req,res) => {
    res.send("im get")
})

Router.get("/:id", (req, res) => {
    res.send("get for user id")
})

Router.post("/", (req, res) =>{
    res.send("post for user")
})

module.exports = Router;