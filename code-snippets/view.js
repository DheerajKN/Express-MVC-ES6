const shell = require('shelljs')
const fs = require('fs');
const createFileAndAddContent = require('../helperFunctions/createFileAndAddContent')
const fetchFile = require('../helperFunctions/fetchContent')

module.exports.addViewToProject = (view, directory) => {
    const supportedViews = ['ejs', 'hbs'];

    if (!supportedViews.includes(view)) {
        console.log('Requested View not supported choose between ejs|hbs');
        exit()
    }

    switch (view) {
        case 'ejs':
            fetchFile.fetchContent('/template/view.ejs').then((data) =>
                createFileAndAddContent.createFileWithContent(`${directory}/views/view.ejs`, data))
            fetchFile.fetchContent('/template/layout.ejs').then((data) =>
                createFileAndAddContent.createFileWithContent(`${directory}/views/layout.ejs`, data))
            shell.exec('npm i ejs express-partials', () => {
                try {
                    let packageFile = `${directory}/app.js`
                    if (fs.existsSync(packageFile)) {
                        fs.readFile(packageFile, 'utf8', (err, oldContent) => {
                            let newContent = oldContent.replace(/(.*)express\(\)/g, `const app = express()\napp.set('view engine', 'ejs')\n\nimport partials from 'express-partials'\n// load the express-partials middleware\napp.use(partials());\n\napp.get('/index', (req, res) => res.render('view', {title: 'Index'}))`);
                            fs.writeFile(packageFile, newContent, (err) => {
                                if (err) throw err;
                            })
                        })
                    }
                } catch (err) {
                    console.log('package error')
                }
            })
            break;
        case 'hbs':
            fetchFile.fetchContent('/template/layout.hbs').then((data) =>
                createFileAndAddContent.createFileWithContent(`${directory}/views/main.hbs`, data))
            fetchFile.fetchContent('/template/view.hbs').then((data) =>
                createFileAndAddContent.createFileWithContent(`${directory}/views/view.hbs`, data))
            shell.exec('npm i express-handlebars', () => {
                try {
                    let packageFile = `${directory}/app.js`
                    if (fs.existsSync(packageFile)) {
                        fs.readFile(packageFile, 'utf8', (err, oldContent) => {
                            let newContent = oldContent.replace(/(.*)express\(\)/g, `const app = express()\nimport exphbs from 'express-handlebars';\n\napp.engine('.hbs', exphbs({extname: '.hbs', layoutsDir: __dirname + '/views'}));
app.set('view engine', 'hbs')

app.get('/index', (req, res) => res.render('view', {title: 'Index'}))
                            `);
                            fs.writeFile(packageFile, newContent, (err) => {
                                if (err) throw err;
                            })
                        })
                    }
                } catch (err) {
                    console.log('package error')
                }
            })
            break;
        default:
            break;
    }
}