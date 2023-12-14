const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer');

// Middleware function for authentication check
const authenticate = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;

    if (isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

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
router.get('/new', authenticate, (req, res) => {
    res.render('new');
});

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



// Route to add a new blog post
router.post('/', authenticate, upload.single('image'), (req, res) => {
    const { title, content, author, category } = req.body;
    const imagePath = req.file ? '/uploads/' + req.file.filename : null;

    db.run('INSERT INTO posts (title, content, author, image_path, category) VALUES (?, ?, ?, ?, ?)', [title, content, author, imagePath, category], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/blogs');
    });
});


module.exports = router;