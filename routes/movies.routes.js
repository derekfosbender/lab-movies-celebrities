const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie= require("../models/Movie.model");



//all your routes go here
router.get("/create", (req, res, next) => {
Celebrity.find()
.then((celebrities) => {
    const celebritiesList = {celebrities}
    res.render("./movies/new-movie", celebritiesList)
})
.catch(error => next (error))
})


router.post("/create", (req, res, next) => {
    // console.log(req.body)
    const {title, genre, plot} = req.body
    const cast = req.body.celebrity
    const newMovieInfo= {title, genre, plot, cast}
   
    Movie.create(newMovieInfo)
    .then(() => {
        res.redirect("/movies")
    })
    
    .catch(error => next (error))
})


router.get("/", (req, res, next) => {
    Movie.find()
    .then((movies) => {
        const moviesList= {movies}
        res.render("./movies/movies", moviesList)
    })
   
    .catch(error => next(error))
})


router.get("/:movieId", (req, res, next) => {

    let movieId= req.params.movieId;
    Movie.findById(movieId)
    .populate("cast")
    .then((movie) => {
        res.render("./movies/movie-details", {movie:movie})
    })
  .catch(error => next(error))
})

router.post("/:movieId/delete", (req, res, next) => {
let movieId= req.params.movieId
Movie.findByIdAndDelete(movieId)
.then(() => {
    res.redirect("/movies")
    })
  .catch(error => next(error))
})

router.get("/:movieId/edit", (req, res, next) => {
    let movieId= req.params.movieId
    let editData= {}
    Movie.findById(movieId)
    .then((movieDetails) => {
        editData.movie = movieDetails;
        return Celebrity.find();
    })
   .then((celebrities) =>{
    editData.celebrities= celebrities
    res.render("./movies/edit-movie", editData)
  })

 .catch(error => next(error))
})
router.post("/:movieId/edit", (req, res, next) => {
    const movieId= req.params.movieId;
    const updatedMovie= req.body;
    Movie.findByIdAndUpdate(movieId, updatedMovie)
    
    .then(() => {
        res.redirect(`/movies/${movieId}`)
    })
    .catch(error => next(error))
})


module.exports = router;