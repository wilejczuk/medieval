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
const jwt = require('jsonwebtoken');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
app.get('/', (req, res) => {
    res.render('home')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    }); //deletes the user from the session
});

app.get('/login-success', (req, res) => {
    res.render('login-success');
});

app.get('/login-failure', (req, res) => {
    res.send('Your email or/and password are wrong');
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', userExists, (req, res) => {
    console.log(req.body.pw);
    const saltHash = genPassword(req.body.pw);
    console.log(saltHash);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    connection.query('Insert into users(email,hash,salt,isAdmin) values(?,?,?,0) ', [req.body.uname, hash, salt], function (error) {
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

app.post('/loginNew',
  async (req, res, next) => {
    passport.authenticate('local',
      async (err, user) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');
            // express 401/403 how to return
            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);
              const body = { id: user.id, salt: user.salt };
              const token = jwt.sign({ user: body }, 'TOP_SECRET');
              return res.json({ token });
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

// CMS editor routes (authorized - yes, admin - no)

app.get('/contribute', isAuth, (req, res) => {
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

app.get('/selectSaint', (req, res) => {
    connection.query(`Select * from saints where id = ${req.query['0']}`, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            return res.json(`${results[0].name} (${results[0].epithet})`);
        }
    });
});

app.get('/selectCross', (req, res) => {
    connection.query(`Select * from crosses where id = ${req.query['0']}`, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            return res.json(results[0].name);
        }
    });
});

app.get('/selectLetter', (req, res) => {
    connection.query(`Select * from letters where id = ${req.query['0']}`, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            return res.json(results[0].symbol);
        }
    });
});

app.get('/selectDictionaries', (req, res) => {
    let saints = [];
    let signs = [];
    let crosses = [];
    let letters = [];
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
                    connection.query('Select * from crosses', function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            crosses = results;
                            connection.query('Select * from letters', function (error, results) {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    letters = results;
                                    return res.json ({ saints: saints, signs: signs,
                                       crosses: crosses,  letters: letters});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get('/personalia', isAuth, (req, res) => {
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

app.get('/personalia-list',
        (req, res) => {
            connection.query(`Select p.id, p.name, s.name saint,
                  p.birthProximity, p.powerProximity, p.deathProximity,
                  p.dateBirth, p.datePower, p.dateDeath, ps.idSign, sg.type from personalia p
                   left join saints s on p.idPatron = s.id
                   left join princeSign ps on ps.idPrince = p.id
                   left join signs sg on sg.id = ps.idSign`,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results.sort((a, b) => {return(a.name < b.name)?-1:1}));
                    }
            );
});

app.get('/personalia-with-saints', (req, res) => {
    let saints = [];
    let personalia = [];
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
                    return res.json ({saints: saints, personalia: personalia});
                }
            });
        }
    });
});

app.get('/stamps',
        (req, res) => {
            connection.query(`select magna.obv, magna.rev, magna.obverse, magna.reverse, count(sps.id) cnt
from (${grandRequest}) magna
                  inner join topos.specimens sps on magna.obv = sps.idObv and magna.rev = sps.idRev
                  group by sps.idObv, sps.idRev`,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

function getDBIndex(group) {
  let index;
  switch (group) {
    case 'saints':
      index = 1;// Святой
      break;
    case 'crosses':
      index = 2;// Крест
      break;
    case 'signs':
      index = 3;// Знак
      break;
    case 'letters':
      index = 4;// Буква
      break;
    case 'text':
      index = 0;// Текст
      break;
    case '0':
      // Другое
      break;
  }
  return index;
}

const grandRequest = `SELECT DISTINCT tp.id, tp.obvImageGroup, tp.revImageGroup, st1.id obv, st2.id rev,
    st1.description obvDescription, st2.description revDescription, st1.isCoDirectional codirect,
    CASE
        WHEN tp.obvImageGroup = 0 THEN tp.obvText
        WHEN tp.obvImageGroup = 1 THEN CONCAT(saints1.name, ' ', saints1.epithet)
        WHEN tp.obvImageGroup = 2 THEN crosses1.name
        WHEN tp.obvImageGroup = 3 THEN 'Ducal sign'
        WHEN tp.obvImageGroup = 4 THEN letters1.symbol
        ELSE null
    END as obverse,
    CASE
        WHEN tp.revImageGroup = 0 THEN tp.revText
        WHEN tp.revImageGroup = 1 THEN CONCAT(saints2.name, ' ', saints2.epithet)
        WHEN tp.revImageGroup = 2 THEN crosses2.name
        WHEN tp.revImageGroup = 3 THEN 'Ducal sign'
        WHEN tp.obvImageGroup = 4 THEN letters2.symbol
        ELSE null
    END as reverse
    from topos.types tp
    inner join topos.stamps st1 on st1.idType = tp.id
    inner join topos.stamps st2 on st2.idType = tp.id
    left join topos.saints saints1 on saints1.id = tp.obvImageId
    left join topos.saints saints2 on saints2.id = tp.revImageId
    left join topos.signs signs1 on signs1.id = tp.obvImageId
    left join topos.signs signs2 on signs2.id = tp.revImageId
    left join topos.crosses crosses1 on crosses1.id = tp.obvImageId
    left join topos.crosses crosses2 on crosses2.id = tp.revImageId
    left join topos.letters letters1 on letters1.id = tp.obvImageId
    left join topos.letters letters2 on letters2.id = tp.revImageId
    where st1.isObverse and st1.id!=st2.id`;

app.get('/parametrizedStamps',
        (req, res) => {
            console.log(req.query);

            let condition1Exists = "", condition3Exists = "";
            let condition1OppositeExists = "", condition3OppositeExists = "";

            if (!['null','0'].includes(req.query['1'])) {
                condition1Exists = `and ${req.query['0']}1.id=${req.query['1']}`;
                condition1OppositeExists = `and ${req.query['0']}2.id=${req.query['1']}`;
            };
            if (!['null','0'].includes(req.query['3'])) {
              condition3Exists = `and ${req.query['2']}2.id=${req.query['3']}`;
              condition3OppositeExists = `and ${req.query['2']}1.id=${req.query['3']}`;
            };

            let searchString =
            `select magna.*, count(sps.id) cnt
            from topos.specimens sps
            inner join (${grandRequest}
                      and ((
                          tp.obvImageGroup = ${getDBIndex(req.query['0'])} ${condition1Exists}
                          and tp.revImageGroup = ${getDBIndex(req.query['2'])} ${condition3Exists}
                        ) or (
                          tp.revImageGroup = ${getDBIndex(req.query['0'])} ${condition1OppositeExists}
                          and tp.obvImageGroup = ${getDBIndex(req.query['2'])} ${condition3OppositeExists}
                        )
                      )
                    ) magna on magna.obv = sps.idObv and magna.rev = sps.idRev
                  group by sps.idObv, sps.idRev`;
                  console.log(searchString);
            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/specimensGeo',
        (req, res) => {
            let searchString =
            `select id, imgType, idObv, idRev, geo, latitude, longitude
            from topos.specimens
            where geo is not null`;

            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/literature',
        (req, res) => {
            let searchString =
            `select *
            from topos.publications pub
            order by pub.year`;

            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/specimenCoordinates',
        (req, res) => {
            let searchString =
            `update topos.specimens set latitude=${req.query['1']}, longitude=${req.query['2']}
              where id=${req.query['0']}`;

            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/type',
        (req, res) => {
            console.log(req.query);

            let searchString =
                    `select s.*, pub.name, pub.year, ps.page, ps.number from
                     (select sps.*, magna.obverse, magna.reverse, obvDescription, revDescription, codirect
                      from topos.specimens sps
                      inner join (${grandRequest}) magna on magna.obv = sps.idObv and magna.rev = sps.idRev
                        where sps.idObv=${req.query['0']} and sps.idRev=${req.query['1']}) s
                              left join topos.publicationSpecimen ps on ps.idSpecimen = s.id
                              left join topos.publications pub on pub.id = ps.idPublication`;
                  console.log(searchString);
            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/types', isAuth, (req, res) => {
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

app.get('/admin-route', isAdmin, (req, res) => {
    res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');
});

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});

app.get('/notAuthorized', (req, res) => {
    res.send('<h1>You are not authorized to view the resource </h1><p><a href="/login">Retry Login</a></p>');
});

app.get('/notAuthorizedAdmin', (req, res) => {
    res.send('<h1>You are not authorized to view the resource as you are not the admin of the page  </h1><p><a href="/login">Retry to Login as admin</a></p>');
});

app.get('/userAlreadyExists', (req, res) => {
    res.send('<h1>Sorry This username is taken </h1><p><a href="/register">Register with different username</a></p>');
});

app.post('/addSaint', (req, res) => {
    connection.query('Insert into saints(name, epithet, story) values(?,?,?) ', [req.body.saintName, req.body.saintEpithet, req.body.saintDescription], function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added ${req.body.saintName} ${req.body.saintEpithet}`);
        }
    });
    res.redirect('/contribute');
});

app.post('/addSign', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./public/signs/";
    form.parse(req, function(err, fields, files) {
        let ext = files.signImage.originalFilename.split('.').pop();
        connection.query('Insert into signs(type, description) values(?,?)', [ext, req.body.signDescription], function (error, results) {
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

app.post('/specimen',
    (req, res) => {
       var form = new formidable.IncomingForm();
       form.parse(req, function(err, fields, files) {
         console.log(fields);
           const {size, weight, findingSpot, findingSpotComments, publication, idObv, idRev, page, number} = fields;
           let ext = files.picture.originalFilename.split('.').pop();
           connection.query(`Insert into specimens(idObv, idRev, geo, geoComment, weight, maxDiameter, imgType)
                values(?,?,?,?,?,?,?)`, [idObv, idRev, findingSpot, findingSpotComments, weight, size, ext],
                   function (error, results) {
                     if (error) console.log(error);
                     else {
                       fs.rename(files.picture.filepath, `./public/specimens/${results.insertId}.${ext}`, (err) => { if (err) throw err;});
                       connection.query(`Insert into publicationSpecimen(idSpecimen, idPublication, page, number)
                            values(?,?,?,?)`, [results.insertId, parseInt(publication), page, number],
                               function (error, results) {
                                 if (error) console.log(error);
                                 else return res.json (results);
                               }
                       );
                     }
                   }
           );
      });
 });

async function branchCases (typeId, err, fields, files, cb) {
    const {obvDescription, revDescription, orient,
      size, weight, findingSpot, findingSpotComments, publication, page, number} = fields;

    let extObv = files.obvStamp.originalFilename.split('.').pop();
    let extRev = files.revStamp.originalFilename.split('.').pop();
    let indObv, indRev;

     await connection.query(`Insert into stamps (idType, isObverse, description, isCoDirectional, imgType)
        values(?,?,?,?,?)`, [typeId, 1, obvDescription, orient === "↑↑", extObv],
         function (error, results) {
            if (error) {
                console.log(error);
            }
            else {
                indObv = results.insertId;
                fs.rename(files.obvStamp.filepath, `./public/stamps/${results.insertId}.${extObv}`, (err) => {
                    if (err)
                        throw err;
                });
            }
        });

     connection.query(`Insert into stamps (idType, isObverse, description, imgType)
        values(?,?,?,?)`, [typeId, 0, revDescription, extRev],
         function (error, results) {
            if (error) {
                console.log(error);
            }
            else {
                indRev = results.insertId;
                fs.rename(files.revStamp.filepath, `./public/stamps/${results.insertId}.${extRev}`, (err) => {
                    if (err)
                        throw err;
                });

                let ext = files.picture.originalFilename.split('.').pop();

                connection.query(`Insert into specimens(idObv, idRev, geo, geoComment, weight, maxDiameter, imgType)
                 values(?,?,?,?,?,?,?)`, [indObv, indRev, findingSpot, findingSpotComments, weight, size, ext],
                   function (error, results) {
                        if (error)
                            console.log(error);
                        else {
                            fs.rename(files.picture.filepath, `./public/specimens/${results.insertId}.${ext}`, (err) => {
                                if (err)
                                    throw err;
                            });

                            connection.query(`Insert into publicationSpecimen(idSpecimen, idPublication, page, number)
                             values(?,?,?,?)`, [results.insertId, parseInt(publication), page, number],
                                 function (error, results) {
                                    if (error)
                                        console.log(error);
                                    else {
                                        console.log([indObv, indRev]);
                                        cb ([indObv, indRev]);
                                    }
                                }
                            );
                        }
                    }
                );

            }
        });

}

app.post('/typeAndSpecimen',
    (req, res) => {
        var form = new formidable.IncomingForm();
        form.parse(req, async function(err, fields, files) {
          console.log(fields);
          const {obvGroup, revGroup, obvIndex, revIndex} = fields;

          if (fields.revGroup) {
              connection.query(`Insert into types(obvImageGroup, obvImageId, revImageGroup, revImageId)
                  values(?,?,?,?)`, [getDBIndex(obvGroup), obvIndex, getDBIndex(revGroup), revIndex],
              async function (error, results) {
                  if (error) {
                      console.log(error);
                  }
                  else await branchCases(results.insertId, err, fields, files,
                        (result) => { return res.json(result)});
              });
          }
          else await branchCases(obvGroup, err, fields, files,
                (result) => { return res.json(result)});
       });
  });

app.post('/addPersona', (req, res) => {
    connection.query(`Insert into personalia(name, idPatron, idFather, dateBirth, datePower, dateDeath,
        birthProximity, powerProximity, deathProximity) values(?,?,?,?,?,?,?,?,?)`,
     [req.body.personaName, req.body.christianPatron, req.body.father,
        req.body.dateBirth, req.body.datePower, req.body.dateDeath,
        req.body.birthProximity?1:0, req.body.powerProximity?1:0, req.body.deathProximity?1:0],
      function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added ${req.body.personaName}`);
        }
    });
    res.redirect('/personalia');
});

app.post('/assignSign', (req, res) => {
    connection.query(`Insert into princeSign(idPrince, idSign) values(?,?)`, [req.body.prince, req.body.radioSign],
      function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully assigned the sign`);
        }
    });
    res.redirect('/contribute');
});

app.post('/addType', (req, res) => {
    let dateLow = req.body.dateLow==''? null:req.body.dateLow;
    let dateHigh = req.body.dateHigh==''? null:req.body.dateHigh;
    connection.query(`Insert into types(obvImageGroup, obvImageId, revImageGroup, revImageId,
        dateLow, dateHigh, isAnonymousImitation) values(?,?,?,?,?,?,?)`, [req.body.obvImageGroup, req.body.obvImageId,
         req.body.revImageGroup, req.body.revImageId, dateLow, dateHigh, req.body.isAnonymousImitation],
      function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(`Successfully added the type`);
        }
    });
    res.redirect('/types');
});
