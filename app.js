// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;


app.use(express.static('public'));
 
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



mongoose.connect('mongodb://localhost/pokemonApp')
.then(()=>{
    console.log("connected to database")
})
.catch((err)=>{
    console.log("error connecting to database");
});

app.set('trust proxy', 1);
 
  app.use(
    session({
      secret: "canBeAnything",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/pokemonApp'
 
      })
    })
  );


app.use((req, res, next)=>{
  res.locals.theUserObject = req.session.currentUser || null;
  next();
})

app.get("/", (req, res)=>{
    res.render("index");
})
// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const moviesRoutes= require("./routes/movies.routes");
app.use("/movies", moviesRoutes)

const celebritiesRoutes= require("./routes/celebrities.routes");
app.use("/celebrities/", celebritiesRoutes)

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
