const {createFileWithContent} = require('../../../helperFunctions/createFileAndAddContent');
const {exec} = require('shelljs')
const {appendFileSync, readFile, existsSync, writeFile} = require('fs');
const {join} = require('path')
const {fetchContent} = require('../../../helperFunctions/fetchContent')

module.exports.addDBComponent = (arguement, folderDirectory, tableName) => {
  if(/^(mongo|true)$/.test(arguement.db)){
    exec('npm i mongoose && npm i -D @types/mongoose', () => {
    let packageFile = `${folderDirectory}/app.js`
      if (existsSync(packageFile)) {
        readFile(packageFile, 'utf8', (err, oldContent) => {
          let newContent = oldContent.replace(/(.*)express\(\)/g, `const app: Application = express();\nimport mongoose from 'mongoose'; \n//If db requires username and password replace MONGO_HOST in env file to this format: mongodb://username:password@host:port/${tableName}\nmongoose.connect(process.env.MONGO_HOST,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });`);
          writeFile(packageFile, newContent, (err) => {
            if (err) throw err;
          })
        })
        fetchContent('/'+join('code-snippets', 'express-ts', 'dbFlag', 'userschema.mongoose.ts')).then((data)=>
          createFileWithContent(folderDirectory + '/src/models/User.ts', data))
        appendFileSync(folderDirectory + '/.env', `\nMONGO_HOST=mongodb://localhost/${tableName}`);
      }
    })
  } else if(/^(postgres|mysql)$/.test(arguement.db)){
//       exec(`npm i sequelize ${arguement.db === 'postgres' ? 'pg' : 'mysql2'}`, () => {
//       fetchContent('/'+join('code-snippets', 'express-js', 'dbFlag', 'sequelize.connect.js')).then((data)=>
//         createFileWithContent(folderDirectory + '/src/models/index.js', data))

//       fetchContent('/'+join('code-snippets', 'express-js', 'dbFlag', 'userschema.sequelize.js')).then((data)=>
//         createFileWithContent(folderDirectory + '/src/models/User.js', data))

//       appendFileSync(folderDirectory + '/.env', `\nDATABASE=${tableName}\nDB_USERNAME=postgres\nDB_PASSWORD=root\nDB_PORT=5432
// DB_HOST=localhost\nDB_DIALECT=${arguement.db}`);
//     });
  }
}