module.exports = function cookieSession (MySQLStore, env) {
  return env === "https://kievan-rus.online" ?
  {
          key: 'session_cookie_name',
          secret: 'session_cookie_secret',
          store: new MySQLStore({
              host: 'localhost',
              port: 3306,
              user: 'kievanru_admin',
              password: 'Bdzilka*8Krong',
              database: 'kievanru_topos'
          }),
          resave: false,
          saveUninitialized: false,
          cookie: { maxAge: 86400 }
      } :
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
};
