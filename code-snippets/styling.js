const {exec} = require('shelljs')
const {existsSync, readFile, writeFile} = require('fs')
const mkdirp = require('mkdirp')
const {createFileWithContent} = require('../helperFunctions/createFileAndAddContent')
const {fetchContent} = require('../helperFunctions/fetchContent')
const {jsType} = require('../helperFunctions/jsTypes');

module.exports.addStylingToProject = (styleName, directory, fileType) => {
    const supportedStyles = ['css', 'sass', 'scss', 'less'];
    const isProjectJS = fileType === jsType.JS
    const expressInitialize = isProjectJS ? 'const app = express()' : 'const app: Application = express()'

    if (!supportedStyles.includes(styleName)) {
        console.log('Requested Style not supported choose between css|sass|scss');
        exit()
    }

    mkdirp(directory + '/views/css');
    switch (styleName) {
        case 'sass':
            fetchContent('/template/style/style.sass').then((data) =>
                createFileWithContent(`${directory}/views/sass/style.sass`, data))
            exec(`npm i node-sass-middleware ${isProjectJS ? '' : '&& npm i -D @types/node-sass-middleware'}`, () => {
                let packageFile = `${directory}/app.${fileType}`
                if (existsSync(packageFile)) {
                    readFile(packageFile, 'utf8', (err, oldContent) => {
                        let newContent = oldContent.replace(/(.*)express\(\)/g, `${expressInitialize};\nimport sassMiddleware from 'node-sass-middleware';\n\napp.use(sassMiddleware({\n    src: __dirname + '/views/sass',\n    dest: __dirname + '/views/css',\n    debug: true,\n    indentedSyntax: true,\n    //outputStyle: 'compressed',\n    prefix: '/css'}));`);
                        writeFile(packageFile, newContent, (err) => {
                            if (err) throw err;
                        })
                    })
                }
            })
            break;
        case 'scss':
            fetchContent('/template/style/style.scss').then((data) =>
                createFileWithContent(`${directory}/views/scss/style.scss`, data))
            exec(`npm i node-sass-middleware ${isProjectJS ? '' : '&& npm i -D @types/node-sass-middleware'}`, () => {
                let packageFile = `${directory}/app.${fileType}`
                if (existsSync(packageFile)) {
                    readFile(packageFile, 'utf8', (err, oldContent) => {
                        let newContent = oldContent.replace(/(.*)express\(\)/g, `${expressInitialize};\nimport scssMiddleware from 'node-sass-middleware';\n\napp.use(scssMiddleware({\n    src: __dirname + '/views/scss',\n    dest: __dirname + '/views/css',\n    debug: true,\n    //outputStyle: 'compressed',\n    prefix: '/css'}));`);
                        writeFile(packageFile, newContent, (err) => {
                            if (err) throw err;
                        })
                    })
                }
            })
            break;
        case 'less':
            fetchContent('/template/style/style.less').then((data) =>
                createFileWithContent(`${directory}/views/less/style.less`, data))
            exec(`npm i less-middleware ${isProjectJS ? '' : '&& npm i -D @types/less-middleware'}`, () => {
                let packageFile = `${directory}/app.${fileType}`
                if (existsSync(packageFile)) {
                    readFile(packageFile, 'utf8', (err, oldContent) => {
                        let newContent = oldContent.replace(/(.*)express\(\)/g, `${expressInitialize};\nimport lessMiddleware from 'less-middleware';\n\napp.use(lessMiddleware('/less', {\n  dest: 'css',\n  debug: true,\n  pathRoot: path.join(__dirname, 'views')}))`);
                        writeFile(packageFile, newContent, (err) => {
                            if (err) throw err;
                        })
                    })
                }
            })
            break;
        default:
            fetchContent('/template/style/style.css').then((data) =>
                createFileWithContent(`${directory}/views/css/style.css`, data))
            break;
    }
}