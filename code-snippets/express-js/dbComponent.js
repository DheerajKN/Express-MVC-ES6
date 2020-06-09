const createFileWithContent = require('../../helperFunctions/createFileAndAddContent');
const {exec} = require('shelljs')
const {appendFileSync, readFile, existsSync, writeFile} = require('fs');

module.exports.addDBComponent = (arguement, folderDirectory, tableName) => {
  if(/^(mongo|true)$/.test(arguement.db)){
    exec('npm i mongoose', () => {
    let packageFile = `${folderDirectory}/app.js`
      if (existsSync(packageFile)) {
        readFile(packageFile, 'utf8', (err, oldContent) => {
          let newContent = oldContent.replace(/(.*)express\(\)/g, `const app = express();\nimport mongoose from 'mongoose'; \n//If db requires username and password replace MONGO_HOST in env file to this format: mongodb://username:password@host:port/${tableName}\nmongoose.connect(process.env.MONGO_HOST,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });`);
          writeFile(packageFile, newContent, (err) => {
            if (err) throw err;
          })
        })
  const userSchema = `import mongoose from "mongoose";
  
  const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      match: [/^[A-Za-z0-9.+-]+@[A-Za-z0-9]+\\.[A-Za-z]{2,3}$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true
    }
  });
  
  export default mongoose.model("User", UserSchema);`
  
        createFileWithContent.createFileWithContent(folderDirectory + '/src/models/User.js', userSchema)
        appendFileSync(folderDirectory + '/.env', `\nMONGO_HOST=mongodb://localhost/${tableName}`);
      }
    })
  } else if(/^(postgres|mysql)$/.test(arguement.db)){
    exec(`npm i sequelize ${arguement.db === 'postgres' ? 'pg' : 'mysql2'}`, () => {
    const modelIndex = `import Sequelize from 'sequelize';
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
  })`
  createFileWithContent.createFileWithContent(folderDirectory + '/src/models/index.js', modelIndex)

  const userSchema = `import Sequelize from 'sequelize';
import { sequelize } from './index'

const User = sequelize.define('User', {
  email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: {
          msg: 'Email Address must be valid'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },{
    timestamps: false
  });
export default User;`

  createFileWithContent.createFileWithContent(folderDirectory + '/src/models/User.js', userSchema)

    appendFileSync(folderDirectory + '/.env', `\nDATABASE=${tableName}\nDB_USERNAME=postgres\nDB_PASSWORD=root\nDB_PORT=5432
DB_HOST=localhost\nDB_DIALECT=${arguement.db}`);
    });
  }
}