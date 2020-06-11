const {exec} = require('shelljs')
const {existsSync, writeFile, readFile} = require('fs');
const {createFileWithContent} = require('../helperFunctions/createFileAndAddContent')
const {jsType} = require('../helperFunctions/jsTypes');
const {fetchContent} = require('../helperFunctions/fetchContent')

module.exports.addViewToProject = (view, directory, fileType) => {
    const supportedViews = ['ejs', 'hbs'];
    const isProjectJS = fileType === jsType.JS
    const expressInitialize = isProjectJS ? 'const app = express()' : 'const app: Application = express()'
    const requestResponse = isProjectJS ? 'req, res' : 'req: Request, res: Response'
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
            exec(`npm i ejs express-partials ${isProjectJS ? '' : '&& npm i -D @types/express-partials'}`, () => {
                try {
                    let packageFile = `${directory}/app.${fileType}`
                    if (existsSync(packageFile)) {
                        readFile(packageFile, 'utf8', (err, oldContent) => {
                            let newContent = oldContent.replace(/(.*)express\(\)/g, `${expressInitialize}\napp.set('view engine', 'ejs')\n\nimport partials from 'express-partials'
// load the express-partials middleware\napp.use(partials());\n\napp.get('/index', (${requestResponse}) => res.render('view', {title: 'Index'}))`);
                            writeFile(packageFile, newContent, (err) => {
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
            exec(`npm i express-handlebars ${isProjectJS ? '' : '&& npm i -D @types/express-handlebars'}`, () => {
                try {
                    let packageFile = `${directory}/app.${fileType}`
                    if (existsSync(packageFile)) {
                        readFile(packageFile, 'utf8', (err, oldContent) => {
                            let newContent = oldContent.replace(/(.*)express\(\)/g, `${expressInitialize}\nimport exphbs from 'express-handlebars';\n\napp.engine('.hbs', exphbs({extname: '.hbs', layoutsDir: __dirname + '/views'}));
app.set('view engine', 'hbs')

app.get('/index', (${requestResponse}) => res.render('view', {title: 'Index'}))`);
                            writeFile(packageFile, newContent, (err) => {
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