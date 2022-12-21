const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');

app.use(session(
    {
        key: 'session_cookie_name',
        secret: 'session_cookie_secret',
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'topos'
        }),
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 86400 }
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'topos',
    multipleStatements: true
});

connection.connect((err) => {
    if (!err) console.log("Connected")
    else console.log(err);
});

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw',
};

/*Passport JS*/
const verifyCallback = (username, password, done) => {
    connection.query('SELECT * FROM users WHERE email = ? ', [username], function (error, results) {
        if (error)
            return done(error);

        if (results.length == 0) {
            return done(null, false);
        }
        const isValid = validPassword(password, results[0].hash, results[0].salt);
        user = { id: results[0].id, username: results[0].username, hash: results[0].hash, salt: results[0].salt };
        if (isValid) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(function (userId, done) {
    connection.query('SELECT * FROM users where id = ?', [userId], function (error, results) {
        done(null, results[0]);
    });
});


/*middleware*/
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return { salt: salt, hash: genhash };
}

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/notAuthorized');
    }
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    }
    else {
        res.redirect('/notAuthorizedAdmin');
    }
}

function userExists(req, res, next) {
    connection.query('Select * from users where email=? ', [req.body.uname], function (error, results) {
        if (error) {
            console.log(error);
        }
        else if (results.length > 0) {
            res.redirect('/userAlreadyExists')
        }
        else {
            next();
        }
    });
}

/*routes*/
app.get('/', (req, res, next) => {
    res.render('home')
});

app.get('/login', (req, res, next) => {
    res.render('login')
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    }); //deletes the user from the session
});

app.get('/login-success', (req, res, next) => {
    res.render('login-success');
});

app.get('/login-failure', (req, res, next) => {
    res.send('Your email or/and password are wrong');
});

app.get('/register', (req, res, next) => {
    res.render('register')
});

app.post('/register', userExists, (req, res, next) => {
    console.log(req.body.pw);
    const saltHash = genPassword(req.body.pw);
    console.log(saltHash);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    connection.query('Insert into users(email,hash,salt,isAdmin) values(?,?,?,0) ', [req.body.uname, hash, salt], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Successfully Entered");
        }
    });

    res.redirect('/login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

// CMS editor routes (authorized - yes, admin - no)

app.get('/contribute', isAuth, (req, res, next) => {
    let saints = [];
    let signs = [];
    let personalia = [];
    connection.query('Select * from saints', function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            saints = results.sort((a, b) => {return(a.name < b.name)?-1:1});
            connection.query('Select * from signs', function (error, results) {
                if (error) {
                    console.log(error);
                }
                else {
                    signs = results;
                    connection.query('Select * from personalia', function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            personalia = results;
                            res.render('contribute', { saints: saints, signs: signs, personalia: personalia });    
                        }
                    });
                }
            });
        }
    });
});

app.get('/personalia', isAuth, (req, res, next) => {
    let saints = [];
    let personalia = [];
    let personSignConnections = [];
    connection.query('Select * from saints', function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            saints = results.sort((a, b) => {return(a.name < b.name)?-1:1});
            connection.query(`Select p.id, p.name, s.name saint, 
            p.birthProximity, p.powerProximity, p.deathProximity,
            p.dateBirth, p.datePower, p.dateDeath from personalia p
             left join saints s on p.idPatron=s.id`, function (error, results) {
                if (error) {
                    console.log(error);
                }
                else {
                    personalia = results.sort((a, b) => {return(a.name < b.name)?-1:1});
                    connection.query(`Select ps.idPrince, ps.idSign, s.type from princeSign ps
                    left join signs s on s.id = ps.idSign`, function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            personSignConnections = results;
                            res.render('personalia', { saints: saints, personalia: personalia, personSignConnections: personSignConnections });    
                        }
                    });    
                }
            });
        }
    });
});

app.get('/types', isAuth, (req, res, next) => {
    let saints = [];
    let types = [];
    connection.query('Select * from saints', function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            saints = results.sort((a, b) => {return(a.name < b.name)?-1:1});
            connection.query(`select t.id, s1.name obvName, s1.epithet obvEpithet, s2.name revName, s2.epithet revEpithet
            from types t 
            left join saints s1 on s1.id = t.obvImageId 
            left join saints s2 on s2.id = t.revImageId`, function (error, results) {
                if (error) {
                    console.log(error);
                }
                else {
                    types = results;
                    res.render('types', { saints: saints, types: types });    
                }
            });   
        }
    });
});

// Supplementary routes

app.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');
});

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});

app.get('/notAuthorized', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource </h1><p><a href="/login">Retry Login</a></p>');
});

app.get('/notAuthorizedAdmin', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource as you are not the admin of the page  </h1><p><a href="/login">Retry to Login as admin</a></p>');
});

app.get('/userAlreadyExists', (req, res, next) => {
    res.send('<h1>Sorry This username is taken </h1><p><a href="/register">Register with different username</a></p>');
});

app.post('/addSaint', (req, res, next) => {
    connection.query('Insert into saints(name, epithet, story) values(?,?,?) ', [req.body.saintName, req.body.saintEpithet, req.body.saintDescription], function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added ${req.body.saintName} ${req.body.saintEpithet}`);
        }
    });
    res.redirect('/contribute');
});

app.post('/addSign', (req, res, next) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/signs/"; 
    form.parse(req, function(err, fields, files) {
        let ext = files.signImage.originalFilename.split('.').pop();
        connection.query('Insert into signs(type, description) values(?,?)', [ext, req.body.signDescription], function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            else {
                fs.rename(files.signImage.filepath, `./public/signs/${results.insertId}.${ext}`, (err) => { if (err) throw err;});
                res.end();
            }
        });
    });
    res.redirect('/contribute');
});

app.post('/addPersona', (req, res, next) => {
    connection.query(`Insert into personalia(name, idPatron, idFather, dateBirth, datePower, dateDeath, 
        birthProximity, powerProximity, deathProximity) values(?,?,?,?,?,?,?,?,?)`,
     [req.body.personaName, req.body.christianPatron, req.body.father, 
        req.body.dateBirth, req.body.datePower, req.body.dateDeath, 
        req.body.birthProximity?1:0, req.body.powerProximity?1:0, req.body.deathProximity?1:0],
      function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added ${req.body.personaName}`);
        }
    });
    res.redirect('/personalia');
});

app.post('/assignSign', (req, res, next) => {
    connection.query(`Insert into princeSign(idPrince, idSign) values(?,?)`, [req.body.prince, req.body.radioSign],
      function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully assigned the sign`);
        }
    });
    res.redirect('/contribute');
});

app.post('/addType', (req, res, next) => {
    let dateLow = req.body.dateLow==''? null:req.body.dateLow;
    let dateHigh = req.body.dateHigh==''? null:req.body.dateHigh;
    connection.query(`Insert into types(obvImageGroup, obvImageId, revImageGroup, revImageId, 
        dateLow, dateHigh, isAnonymousImitation) values(?,?,?,?,?,?,?)`, [req.body.obvImageGroup, req.body.obvImageId,
         req.body.revImageGroup, req.body.revImageId, dateLow, dateHigh, req.body.isAnonymousImitation],
      function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added the type`);
        }
    });
    res.redirect('/types');
});