// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL via Sequelize.'))
  .catch(err => console.error('Unable to connect:', err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Todo = require('./todo.model.js')(sequelize, DataTypes);

// Synchronize models
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables synced!');
  })
  .catch(err => console.error('Sync error:', err));

// sequelize.sync({ force: true }).then(() => {
//   console.log('Database & tables dropped and recreated.');
// });

module.exports = db;
