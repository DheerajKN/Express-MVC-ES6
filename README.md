# Express-MVC-ES7

Simple Express Boiler Plate creator with mvc and es7 syntax

## Usage

    [directory-where-you-want-create-boilerplate] $ node express-es7-generator/app.js <project-name> --style=scss --view=hbs

## Arguements

- Style [Supported]: SCSS, LESS, CSS, SASS
- View [Supported]: EJS, HBS

## Other Functionality

- --resource: This would create an entry in routes/index.js and create subsequent controller and service files.

> [inside-folder-where-boilerplate-is-created] \$ node express-es7-generator/app.js --resource=phone

## Things in development

- Using --view=[react|vue]
- --db for mongo db configuration code that has basic schema generation, setup code etc.
