import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {DATABASE, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_HOST, DB_DIALECT} = process.env;
const dbOptions = { port: DB_PORT, host: DB_HOST, dialect: DB_DIALECT, logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
};

export const sequelize = new Sequelize( DATABASE, DB_USERNAME, DB_PASSWORD, dbOptions );

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!')
  })