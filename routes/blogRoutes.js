const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const passport = require('passport');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Save uploaded images to the 'public/uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to make each filename unique
    }
});

const upload = multer({ storage: storage });


// Route to display all blog posts
router.get('/', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { posts: rows });
    });
});

// Route to display the form for a new blog post
router.get('/new', (req, res) => {
    res.render('new');
});


// Route to add a new blog post
router.post('/', upload.single('image'), (req, res) => {
    const { title, content, author, category } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;

    db.run('INSERT INTO posts (title, content, author, image_path, category) VALUES (?, ?, ?, ?, ?)', [title, content, author, imagePath, category], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/blogs');
    });
});

// Route to delete a blog post
router.delete('/blogs/:id', async (req, res) => {
    try {
        await db.run('DELETE FROM posts WHERE id = ?', req.params.id);
        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        res.redirect('/blogs');
    }
});


// Authentication Routes

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Add user to the database
        const { username, email } = req.body;
        const addUserQuery = 'INSERT INTO users (username, email, password) VALUES (?,?, ?)';
        await db.run(addUserQuery, [username, email, hashedPassword]);
        res.redirect('/blogs/login');
    } catch (error) {
        console.error(error);
        res.redirect('/blogs/signup');
    }
});

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/blogs',
    failureRedirect: '/blogs/login',
    failureFlash: true // Ensure you have flash messages configured
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        res.redirect('/blogs/login');
    });
});

// Route to display the login form
router.get('/login', (req, res) => {
    res.render('login');
});


// Route to display the signup form
router.get('/signup', (req, res) => {
    res.render('signup');
});
module.exports = router;


// Route to display posts in the 'music' category
router.get('/music', (req, res) => {
    db.all('SELECT * FROM posts WHERE category = "music" ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('music', { category: 'Music', posts: rows });
    });
});

// Route to display posts in the 'sports' category
router.get('/sports', (req, res) => {
    db.all('SELECT * FROM posts WHERE category = "sports" ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('sports', { category: 'Sports', posts: rows });
    });
});

// Route to display posts in the 'movies' category
router.get('/movies', (req, res) => {
    db.all('SELECT * FROM posts WHERE category = "movies" ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('movies', { category: 'Movies', posts: rows });
    });
});





module.exports = router;