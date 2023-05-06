const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var formidable = require('formidable');
var path = require('path');
var fs = require('fs-extra');
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const nodemailer = require('nodemailer');
const config = require('./config.json');

const env = "prod";
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", config[env].url);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

//  Initialize PassportJS Middleware

const cookieSession = {
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore({
        host: config[env].db.host,
        port: 3306,
        user: config[env].db.user,
        password: config[env].db.password,
        database: config[env].db.database
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400 }
}

app.use(session(cookieSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: config[env].db.host,
    user: config[env].db.user,
    password: config[env].db.password,
    database: config[env].db.database,
    multipleStatements: true
 });

connection.connect((err) => {
    if (!err) console.log("Connected")
    else console.log(err);
});

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'TOP_SECRET'
    },
    function (jwtPayload, cb) {
        const {id, salt} = jwtPayload.user;
        connection.query(`SELECT * FROM users WHERE id = ${id} and salt = '${salt}'`,
         function (error, results) {
            if (error)
                return cb(error);
            console.log(results);
            return cb(null, results[0]);
    }
)}));

// Protected routes (only for JWT bearers above)
app.use('/addAttribution', passport.authenticate('jwt', {session: false}));
app.use('/typeAndSpecimen', passport.authenticate('jwt', {session: false}));
app.use('/specimen', passport.authenticate('jwt', {session: false}));

/*Passport JS*/

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw',
};

const verifyCallback = (username, password, done) => {
    connection.query('SELECT * FROM users WHERE email = ? ', [username], function (error, results) {
        if (error)
            return done(error);

        if (results.length == 0) {
            return done(null, false);
        }
        const isValid = validPassword(password, results[0].hash, results[0].salt);
        user = { id: results[0].id, username: results[0].email, hash: results[0].hash, salt: results[0].salt };
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
    console.log("serialize");
    done(null, user.id)
});

passport.deserializeUser(function (userId, done) {
    console.log("deserialize");
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

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    }); //deletes the user from the session
});

app.post('/register', userExists, (req, res) => {
    const saltHash = genPassword(req.body.pw);
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
          console.log(user);
          if (err || !user) {
            return res.sendStatus(401);
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

app.get('/contribute', (req, res) => {
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
                            return res.json({ saints: saints, signs: signs, personalia: personalia });
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
    connection.query(`Select s.id, s.name, s.epithet, s.subGroup, count(s.id) density from saints s 
                        left join personalia p on s.id = p.idPatron 
                        GROUP by s.name, s.epithet
                        order by density desc, s.name`, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            saints = results;
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

app.get('/dukeData', (req, res) => {
    let duke = {};
    let descendants = [];
    connection.query(`select p.*, p2.name father, p3.name husband, p4.id idWife, p4.name wife, s.name patron, b.name_ru branch
                    from personalia p 
                    left join personalia p2 on p.idFather = p2.id 
                    left join personalia p3 on p.idHusband = p3.id
                    left join personalia p4 on p.id = p4.idHusband
                    left join saints s on p.idPatron = s.id
                    left join branches b on b.id = p.idBranch
                    where p.id = ${req.query['0']}`, function (error, results) {
        if (error) {
            console.log(error);
        }
        else {
            duke = results[0];
            connection.query(`select p3.name son, p3.id
                    from personalia p 
                    right join personalia p3 on p.id = p3.idFather 
                    where p.id = ${req.query['0']}`, function (error, results) {
                if (error) {
                    console.log(error);
                }
                else {
                    descendants = results;
                    return res.json ({duke: duke, descendants: descendants});
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
            connection.query(`select magna.*, count(sps.id) cnt
from (${grandRequest}) magna
                  inner join specimens sps on magna.obv = sps.idObv and magna.rev = sps.idRev
                  where not (magna.obvImageGroup=0 and magna.revImageGroup = 0 and magna.obvImageId > 0 and magna.revImageId > 0)
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

const grandRequest = `SELECT DISTINCT tp.id typeId, tp.obvImageGroup, tp.revImageGroup, st1.id obv, st2.id rev,
    st1.imgType obvType, st2.imgType revType, tp.obvImageId, tp.revImageId,
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
    from types tp
    inner join stamps st1 on st1.idType = tp.id
    inner join stamps st2 on st2.idType = tp.id
    left join saints saints1 on saints1.id = tp.obvImageId
    left join saints saints2 on saints2.id = tp.revImageId
    left join signs signs1 on signs1.id = tp.obvImageId
    left join signs signs2 on signs2.id = tp.revImageId
    left join crosses crosses1 on crosses1.id = tp.obvImageId
    left join crosses crosses2 on crosses2.id = tp.revImageId
    left join letters letters1 on letters1.id = tp.obvImageId
    left join letters letters2 on letters2.id = tp.revImageId
    where st1.isObverse and st1.id!=st2.id`;

const compositePublications = `(select p.id, p.year,
CONCAT(GROUP_CONCAT(a.name_ru ORDER BY p.id, pa.id SEPARATOR ', '), ', ', p.name, ', ', p.place, '.') name  
from publications p 
left join publicationAuthor pa on p.id = pa.idPublication 
left join authors a on a.id = pa.idAuthor 
left join journals j on j.id = p.idJournal 
GROUP by p.id)`

app.get('/dukesStamps',
    (req, res) => {
        connection.query(`select magna.*, count(sps.id) cnt, per.name issuerName
        from (${grandRequest}) magna
              inner join specimens sps on magna.obv = sps.idObv and magna.rev = sps.idRev
              left join publicationAttribution pA on pA.idObverse = sps.idObv
              left join personalia per on per.id = pA.idPersona
              where per.id = ${req.query['0']}
              group by sps.idObv, sps.idRev`,
                function (error, results) {
                  if (error) console.log(error);
                  else return res.json (results);
                }
        );
});

app.get('/dukes',
    (req, res) => {
        connection.query(`select *
        from personalia p
        order by p.name`,
                function (error, results) {
                  if (error) console.log(error);
                  else return res.json (results);
                }
        );
});

app.get('/dukesList', 
    (req, res) => {
        const condition = req.query['0'] ? `where pr.idBranch=${req.query['0']}` : ``;
        
        connection.query(`select pr.*, count(st.id), i.id pic, i.imgType ext, br.name_ru branch 
        FROM publicationAttribution pa 
        left join stamps st on pa.idObverse = st.id
        left join personalia pr on pa.idPersona = pr.id
        left join branches br on br.id = pr.idBranch
        left join illustrations i on i.idPerson = pr.id
        ${condition} 
        group by pr.name
        order by pr.dateDeath 
        limit 24`,
                function (error, results) {
                  if (error) console.log(error);
                  else return res.json (results);
                }
        );
});

app.get('/parametrizedStamps',
        (req, res) => {
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
            from specimens sps
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
                    where not (magna.obvImageGroup=0 and magna.revImageGroup = 0 and magna.obvImageId > 0 and magna.revImageId > 0)
                  group by sps.idObv, sps.idRev`;
                console.log(searchString);
                  connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});
// condition "not (tp.obvImageGroup=0 and tp.revImageGroup = 0 and tp.obvImageId = 1 and tp.revImageId = 1)"
// can be added to hide coins in search

app.get('/specimensGeo',
        (req, res) => {
            let searchString =
            `select id, imgType, idObv, idRev, geo, latitude, longitude, count(id) cnt
            from specimens
            where geo is not null 
            group by geo
            order by cnt`;

            /* logic behind it: aggregate results with the same coordinates, but different names, e.g. 
            Полоцк and Полацк

            But it breaks the logics of coordinates updating, so may need to invent something else

            and latitude is not null 
            group by latitude, longitude
            
            */

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
            from ${compositePublications} pub
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
            `update specimens set latitude=${req.query['1']}, longitude=${req.query['2']}
              where id=${req.query['0']}`;

            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/typeAttributions',
        (req, res) => {
            let searchString =
            `select pr.*, pb.name publication, pb.year, pa.page 
            FROM publicationAttribution pa 
            left join stamps st on pa.idObverse = st.id
            left join personalia pr on pa.idPersona = pr.id
            left join ${compositePublications} pb on pb.id = pa.idPublication 
            where st.id = ${req.query['0']}
            order by pb.year `;

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
                     (select sps.*, magna.*
                      from specimens sps
                      inner join (${grandRequest}) magna on magna.obv = sps.idObv and magna.rev = sps.idRev
                        where sps.idObv=${req.query['0']} and sps.idRev=${req.query['1']}) s
                              left join publicationSpecimen ps on ps.idSpecimen = s.id
                              left join ${compositePublications} pub on pub.id = ps.idPublication`;
                  console.log(searchString);
            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/locationSpecimens',
        (req, res) => {
            let searchString =
                    `select s.*, pub.name, pub.year, ps.page, ps.number from
                     (select sps.*, magna.*
                      from specimens sps
                      inner join (${grandRequest}) magna on magna.obv = sps.idObv and magna.rev = sps.idRev
                        where sps.geo='${req.query['0']}') s
                              left join publicationSpecimen ps on ps.idSpecimen = s.id
                              left join ${compositePublications} pub on pub.id = ps.idPublication`;
                  console.log(searchString);
            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

app.get('/publicationSpecimens',
        (req, res) => {
            let searchString =
                    `select p.id, p.name, p.year, count(ps.id) count 
                    from ${compositePublications} p 
                    left join publicationSpecimen ps on p.id = ps.idPublication 
                    GROUP by p.id
                    order by count(ps.id) desc`;
            connection.query(searchString,
                    function (error, results) {
                      if (error) console.log(error);
                      else return res.json (results);
                    }
            );
});

// Supplementary routes

app.listen(3000, function () {
    console.log('App listening on port 3000!');
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
                (files.signImage.filepath, `./public/signs/${results.insertId}.${ext}`, (err) => { if (err) throw err;});
                res.end();
            }
        });
    });
    res.redirect('/contribute');
});

app.post('/addAttribution',
    (req, res) => {
       var form = new formidable.IncomingForm();
       form.parse(req, function(err, fields, files) {
         console.log(fields);
           const {idPersona, idPublication, idObv, page} = fields;
           connection.query(`Insert into publicationAttribution(idPersona, idPublication, idObverse, page)
                values(?,?,?,?)`, [idPersona, idPublication, idObv, page],
                   function (error, results) {
                     if (error) console.log(error);
                     else return res.json (results);
                   }
           );
      });
 });

app.post('/specimen',
    (req, res) => {
       var form = new formidable.IncomingForm();
       form.parse(req, function(err, fields, files) {
         console.log(fields);
           const {size, weight, findingSpot, findingSpotComments, poster, publication, idObv, idRev, page, number} = fields;
           let ext = files.picture.originalFilename.split('.').pop();
           connection.query(`Insert into specimens(idObv, idRev, geo, geoComment, weight, maxDiameter, imgType, poster)
                values(?,?,?,?,?,?,?,?)`, [idObv, idRev, findingSpot, findingSpotComments, weight, size, ext, poster],
                   function (error, results) {
                     if (error) console.log(error);
                     else {
                       fs.move(files.picture.filepath, `./public/specimens/${results.insertId}.${ext}`, (err) => { if (err) throw err;});
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
        values(?,?,?,?,?)`, [typeId, 1, obvDescription, orient, extObv],
         function (error, results) {
            if (error) {
                console.log(error);
            }
            else {
                indObv = results.insertId;
                fs.move(files.obvStamp.filepath, `./public/stamps/${results.insertId}.${extObv}`, (err) => {
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
                fs.move(files.revStamp.filepath, `./public/stamps/${results.insertId}.${extRev}`, (err) => {
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
                            fs.move(files.picture.filepath, `./public/specimens/${results.insertId}.${ext}`, (err) => {
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

app.post('/sendEmail', (req, res) => {
    let form = new formidable.IncomingForm();
    let transporter = nodemailer.createTransport({
        host: config.email.host,
        port: 587,
        secure: false,
        auth:     {
            user: config.email.user, 
            pass: config.email.pass
        },
      });

    form.parse(req, async function(err, fields, files) {
        const {email, description} = fields;

        let result = await transporter.sendMail({
        from: config.email.user,
        to: config.email.recipient,
        subject: `Message from ${email}`,
        text: description,
        attachments: [
            {
                filename: files.obverse.originalFilename,
                path: files.obverse.filepath,
                cid: files.obverse.originalFilename 
            },
            {
                filename: files.reverse.originalFilename,
                path: files.reverse.filepath,
                cid: files.reverse.originalFilename
            }
            ]
        })
        return res.json(result);
   });

});
