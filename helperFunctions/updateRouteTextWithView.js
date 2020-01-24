module.exports.updateRouteText = (filePath, resource) => {
    return new Promise((resolve, reject)=>{
        try {
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', (err, oldContent)=>{
                    let newContent = oldContent.replace(/module.exports(.*)/g, `routes.get('/index', function(req, res) {
    res.render('view', {title: 'Index'});
});`);

                    createFileWithContent.createFileWithContent(filePath, newContent, err => {
                        if(err) {console.log('Error in adding data to routes file')}
                    })
                })
                resolve()
            }
            else {
                throw 'routes/index.js file doesn\'t exists'
            }
        } catch(err) {
            reject(err)
        }
    })
}