const express = require("express");
const router = express.Router();
const db= require("../../models");

// router.post("/test-vente", (req, res) => {
//     // console.log(req.body)
//     // console.log(req.body)

//     db.Users.create(req.body).then(immobilier=>{
//         res.json("Good request")
//     })
//     .catch(function(err) {
//         res.json(err.message)
//         // console.error("ERR.....",err);
//     })

//  });

router.post("/poster-vente", (req, res) => {
    console.log(req.body)
    db.Immobilier.create(req.body).then(immobilier=>{
        res.json(immobilier)
    })
    .catch(function(err) {
        res.json(err.message)
        console.error("ERR.....",err);
    })

 });
router.get("/poster-vente", (req, res) => {
    db.Immobilier.find({}).then(immobilier=>{
        res.json(immobilier)
    })
    .catch(function(err) {
        res.json(err.message)
        // console.error("ERR.....",err);
    })

 });


module.exports = router;
