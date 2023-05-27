const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");

// all your routes here
router.get("/create", (req, res, next) => {
    res.render("./celebrities/new-celebrity")
})

router.post("/create", (req, res, next) => {
    //console.log(req.body)

    let newCelebrity= {
        name, occupation, catchPhrase
    } = req.body 
    Celebrity.create(newCelebrity)
    .then(() => {
        res.redirect("/celebrities")
    })
    .catch(error => {
        console.log(error)
        res.render("./celebrities/new-celebrity")
    })
})

router.get("/", (req, res, next) => {
   
Celebrity.find()

.then((celebrities) => {
    //console.log("search results: ", results)
    const celebResults= {celebrities}
    res.render("./celebrities/celebrities", celebResults)
})
.catch(error => {
    next(error)
})

})

module.exports = router;