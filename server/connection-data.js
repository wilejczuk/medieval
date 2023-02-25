module.exports = function connectionData (env) {
  return env === "https://kievan-rus.online" ?
     {
        host: 'localhost',
        user: 'kievanru_admin',
        password: 'Bdzilka*8Krong',
        database: 'kievanru_topos',
        multipleStatements: true
     } :
     {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'topos',
        multipleStatements: true
    }
};
