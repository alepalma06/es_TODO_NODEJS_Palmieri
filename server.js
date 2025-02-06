const fs = require('fs');
const mysql = require('mysql2');

const conf = JSON.parse(fs.readFileSync('conf.json'));
const connection = mysql.createConnection(conf);

// Esegue una query SQL e restituisce una Promise
const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject();
         }
         console.log('Query eseguita con successo');
         resolve(result);
      });
   });
};

// Creazione della tabella TODO (se non esiste)
const createTable = () => {
   return executeQuery(`
      CREATE TABLE IF NOT EXISTS todo (
         id INT PRIMARY KEY AUTO_INCREMENT, 
         name VARCHAR(255) NOT NULL, 
         completed BOOLEAN
      ) 
   `);
};

module.exports = { connection, executeQuery, createTable };
