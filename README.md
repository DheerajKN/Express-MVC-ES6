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

- --db: This would download mongoose and create initial setup files for connection with database along with sample user table with validation fields

> [directory-where-you-want-create-boilerplate] \$ node express-es7-generator/app.js <project-name> --db

- --auth: This would automatically create config files for authentication using JWT and uses created User table fields

> [directory-where-you-want-create-boilerplate] \$ node express-es7-generator/app.js <project-name> --db --auth
