const express = require('express');
const session = require('express-session');
const app = express();
const blogRoutes = require('./routes/blogRoutes');
const db = require('./database');

const hardcodedUsername = 'donald';
const hardcodedPassword = 'password';

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Body parser for form data
app.use('/public', express.static('public'));

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => res.redirect('/blogs')); // Redirect root to the blogs
app.use('/blogs', blogRoutes);

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

// Login route - POST
app.post('/login', (req, res) => {
    // Handle login logic here
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (username === hardcodedUsername && password === hardcodedPassword) {
        // Set a session variable to indicate that the user is authenticated
        req.session.isAuthenticated = true;
        res.redirect('/blogs/new'); // Redirect to add new post page after successful login
    } else {
        res.redirect('/login'); // Redirect back to login if authentication fails
    }
});

// Database initialization
db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image_path TEXT, category TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, author TEXT) ");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));