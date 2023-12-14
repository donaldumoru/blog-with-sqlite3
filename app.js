const express = require('express');
const session = require('express-session');

const app = express();
const blogRoutes = require('./routes/blogRoutes');
const db = require('./database');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

require('./passport-config')(passport);



app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Body parser for form data
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));

// Express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());


// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.get('/', (req, res) => res.redirect('/blogs')); // Redirect root to the blogs
app.use('/blogs', blogRoutes);

// Database initialization
db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image_path TEXT, category TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, author TEXT) ");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));