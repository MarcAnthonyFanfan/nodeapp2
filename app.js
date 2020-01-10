// toggle debug output
const DEBUG_MYSQL_QUERIES = false;
const DEBUG_SESSION_KEYS = false;
const DEBUG_BAD_LOGIN_ATTEMPTS = false;
// express setup
var express = require('express');
var cookieParser = require('cookie-parser');
var sha256 = require('js-sha256');
var app = express();
var port = 8080;
var path=require('path');
app.set('view engine', 'pug');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// mysql setup
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    database: 'nodeapp'
});
con.connect(function(err) {
    if (err) throw err;
    console.log('Connected to DB');
});

// app route: /
app.get('/', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/`);
    if(req.cookies.session_key) {
        var mysql_query = `SELECT * FROM sessions WHERE session_key=${mysql.escape(req.cookies.session_key)}`;
        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
        con.query(mysql_query, function(err, result, fields) {
            if(err) throw err;
            if(result.length == 0) {
                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_KEY session_key=${req.cookies.session_key} redirect=/logout`);
                res.redirect('/logout');
            }
            else {
                var mysql_query = `SELECT * FROM users WHERE id=${mysql.escape(result[0].user_id)}`;
                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                con.query(mysql_query, function(err, result, fields) {
                    if(err) throw err;
                    if(result.length == 0) {
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_USER session_key=${req.cookies.session_key} redirect=/logout`);
                        res.redirect('/logout');
                    }
                    else {
                        var current_user = result[0];
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=USER_AUTHENTICATED_WITH_SESSION_KEY username=${current_user.username} session_key=${req.cookies.session_key}`);
                        var mysql_query = `SELECT posts.body, posts.created_at, users.username FROM posts INNER JOIN users ON posts.user_id=users.id ORDER BY posts.id DESC`
                        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                        con.query(mysql_query, function(err, result, fields) {
                            if(err) throw err;
                            res.render('index', { user: current_user, posts: result });
                        });
                    }
                })
            }
        });
    }
    else {
        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=NO_SESSION_KEY_FOUND redirect=/login`);
        res.redirect('/login');
    }
});
app.post('/', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=POST route=/`);
    if(req.cookies.session_key) {
        var mysql_query = `SELECT * FROM sessions WHERE session_key=${mysql.escape(req.cookies.session_key)}`;
        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
        con.query(mysql_query, function(err, result, fields) {
            if(err) throw err;
            if(result.length == 0) {
                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_KEY session_key=${req.cookies.session_key} redirect=/logout`);
                res.redirect('/logout');
            }
            else {
                var mysql_query = `SELECT * FROM users WHERE id=${mysql.escape(result[0].user_id)}`;
                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                con.query(mysql_query, function(err, result, fields) {
                    if(err) throw err;
                    if(result.length == 0) {
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_USER session_key=${req.cookies.session_key} redirect=/logout`);
                        res.redirect('/logout');
                    }
                    else {
                        var post_body = req.body.post_body;
                        var current_user = result[0];
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=USER_AUTHENTICATED_WITH_SESSION_KEY username=${current_user.username} session_key=${req.cookies.session_key}`);
                        var mysql_query = `INSERT INTO posts(user_id, body) VALUES(${mysql.escape(current_user.id)}, ${mysql.escape(post_body)})`
                        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                        con.query(mysql_query, function(err, result, fields) {
                            if(err) throw err;
                            res.redirect('/');
                        });
                    }
                })
            }
        });
    }
    else {
        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=NO_SESSION_KEY_FOUND redirect=/login`);
        res.redirect('/login');
    }
});

// app route: /users
app.get('/users', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/users`);
    if(req.cookies.session_key) {
        var mysql_query = `SELECT * FROM sessions WHERE session_key=${mysql.escape(req.cookies.session_key)}`;
        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
        con.query(mysql_query, function(err, result, fields) {
            if(err) throw err;
            if(result.length == 0) {
                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_KEY session_key=${req.cookies.session_key} redirect=/logout`);
                res.redirect('/logout');
            }
            else {
                var mysql_query = `SELECT * FROM users WHERE id=${mysql.escape(result[0].user_id)}`;
                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                con.query(mysql_query, function(err, result, fields) {
                    if(result.length == 0) {
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_USER session_key=${req.cookies.session_key} redirect=/logout`);
                        res.redirect('/logout');
                    }
                    else {
                        var current_user = result[0];
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=USER_AUTHENTICATED_WITH_SESSION_KEY username=${current_user.username} session_key=${req.cookies.session_key}`);
                        var mysql_query = `SELECT users.username, COUNT(posts.user_id) AS number_of_posts FROM users, posts WHERE users.id = posts.user_id GROUP BY posts.user_id`;
                        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                        con.query(mysql_query, function(err, result, fields) {
                            if(err) throw err;
                            res.render('users', { users: result, current_user: current_user });
                        });
                    }
                });
            }
        });
    }
    else {
        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=NO_SESSION_KEY_FOUND redirect=/login`);
        res.redirect('/login');
    }
});

// app route: /users/:username
app.get('/users/:username', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/users/${req.params.username}`);
    if(req.cookies.session_key) {
        var mysql_query = `SELECT * FROM sessions WHERE session_key=${mysql.escape(req.cookies.session_key)}`;
        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
        con.query(mysql_query, function(err, result, fields) {
            if(err) throw err;
            if(result.length == 0) {
                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_KEY session_key=${req.cookies.session_key} redirect=/logout`);
                res.redirect('/logout');
            }
            else {
                var mysql_query = `SELECT * FROM users WHERE id=${mysql.escape(result[0].user_id)}`;
                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                con.query(mysql_query, function(err, result, fields) {
                    if(result.length == 0) {
                        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=BAD_SESSION_USER session_key=${req.cookies.session_key} redirect=/logout`);
                        res.redirect('/logout');
                    }
                    else {
                        var current_user = result[0];
                        var mysql_query = `SELECT * FROM users WHERE username=${mysql.escape(req.params.username)}`;
                        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                        con.query(mysql_query, function(err, result, fields) {
                            if(err) throw err;
                            if(result.length == 0) {                        
                                res.render('profile_not_found', { current_user: current_user });
                            }
                            else {
                                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=USER_AUTHENTICATED_WITH_SESSION_KEY username=${result[0].username} session_key=${req.cookies.session_key}`);
                                var lookup_user = result[0];
                                var mysql_query = `SELECT posts.body, posts.created_at, users.username FROM posts INNER JOIN users ON posts.user_id=users.id WHERE user_id=${mysql.escape(lookup_user.id)} ORDER BY posts.id DESC`;
                                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                                con.query(mysql_query, function(err, result, fields) {
                                    if(err) throw err;
                                    res.render('profile', { user: lookup_user, current_user: current_user, posts: result });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=NO_SESSION_KEY_FOUND redirect=/login`);
        res.redirect('/login');
    }
});

// app route: /login
app.get('/login', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/login`);
    if(req.cookies.session_key) {
        if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=SESSION_KEY_FOUND redirect=/`);
        res.redirect('/');
    }
    else {
        res.render('login');
    }
});
app.post('/login', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=POST route=/login`);
    var username = req.body.username;
    var password = req.body.password;
    var secure_password = sha256(username.toLowerCase()+password).substring(0, 32);
    var mysql_query = `SELECT * FROM users WHERE username=${mysql.escape(username)} AND password=${mysql.escape(secure_password)}`;
    if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
    con.query(mysql_query, function(err, result, fields) {
        if(err) throw err;
        if(result.length == 0) {
            if(DEBUG_BAD_LOGIN_ATTEMPTS) console.log(`ip=${ip} event=BAD_LOGIN_ATTEMPT username=${username}`);
            res.render('login', { flash_message: 'Incorrect Username/Password', username: username, autofocus_password: 'autofocus' });
        }
        else if(result.length == 1) {
            var username_from_db = result[0].username;
            var mysql_query = `DELETE FROM sessions WHERE user_id=${mysql.escape(result[0].id)}`;
            if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
            con.query(mysql_query, function(err, result, fields) {
                if(err) throw err;
            });
            var session_key = sha256(username.toLowerCase()+password+ip).substring(0, 32);
            var mysql_query = `INSERT INTO sessions(user_id, session_key) VALUES(${mysql.escape(result[0].id)}, ${mysql.escape(session_key)})`;
            if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
            con.query(mysql_query, function(err, result, fields) {
                if(err) throw err;
                res.cookie('session_key' , session_key);
                // res.cookie('session_key' , session_key, { secure: true});
                if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=CREATED_NEW_USER_SESSION username=${username_from_db} session_key=${req.cookies.session_key} redirect=/`);
                res.redirect('/');
            });
        }
    });
});

// app route: /signup
app.get('/signup', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/signup`);
    res.render('signup');
});
app.post('/signup', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=POST route=/signup`);
    var username = req.body.username;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;
    if(password == password_confirmation) {
        var secure_password = sha256(username.toLowerCase()+password).substring(0, 32);
        var mysql_query = `INSERT INTO users(username, password) VALUES(${mysql.escape(username)}, ${mysql.escape(secure_password)})`;
        if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
        con.query(mysql_query, function(err, result, fields) {
            if(err) throw err;
            var mysql_query = `SELECT * FROM users WHERE username=${mysql.escape(username)} AND password=${mysql.escape(secure_password)}`;
            if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
            con.query(mysql_query, function(err, result, fields) {
                var session_key = sha256(username.toLowerCase()+password+ip).substring(0, 32);
                var mysql_query = `INSERT INTO sessions(user_id, session_key) VALUES(${mysql.escape(result[0].id)}, ${mysql.escape(session_key)})`;
                if(DEBUG_MYSQL_QUERIES) console.log(`ip=${ip} event=MYSQL_QUERY mysql_query=${mysql_query}`);
                con.query(mysql_query, function(err, result, fields) {
                    if(err) throw err;
                    res.cookie('session_key' , session_key);
                    // res.cookie('session_key' , session_key, { secure: true});
                    if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=CREATED_NEW_USER_SESSION username=${result[0].username} session_key=${req.cookies.session_key} redirect=/`);
                    res.redirect('/');
                });
            });
        });
    }
    else {
        res.render('signup', { flash_message: 'Password and Confirmation do not match', username: username, autofocus_password: 'autofocus' });
    }
});

// app route: /logout
app.get('/logout', function(req, res) {
    var ip = req.connection.remoteAddress;
    console.log(`ip=${ip} method=GET route=/logout`);
    res.clearCookie('session_key');
    if(DEBUG_SESSION_KEYS) console.log(`ip=${ip} event=CLEARED_SESSION_KEY_COOKIE session_key=${req.cookies.session_key} redirect=/`);
    res.redirect('/login');
});

// start app
app.listen(port, '0.0.0.0');
console.log(`Node app listening on port ${port}!`);