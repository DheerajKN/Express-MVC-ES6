const shell = require('shelljs')
const fs = require('fs');
const {createFileWithContent} = require('../helperFunctions/createFileAndAddContent')
const {fetchContent} = require('../helperFunctions/fetchContent')

module.exports.addViewToProject = (view, directory, fileType) => {
    const supportedViews = ['ejs', 'hbs'];

    if (!supportedViews.includes(view)) {
        console.log('Requested View not supported choose between ejs|hbs');
        exit()
    }

    switch (view) {
        case 'ejs':
            fetchContent('/template/view/view.ejs').then((data) =>
                createFileWithContent(`${directory}/views/view.ejs`, data))
            fetchContent('/template/view/layout.ejs').then((data) =>
                createFileWithContent(`${directory}/views/layout.ejs`, data))
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
            fetchContent('/template/view/layout.hbs').then((data) =>
                createFileWithContent(`${directory}/views/main.hbs`, data))
            fetchContent('/template/view/view.hbs').then((data) =>
                createFileWithContent(`${directory}/views/view.hbs`, data))
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