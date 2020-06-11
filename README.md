# Express-MVC-ES6

Simple Express Boiler Plate creator with typescript, mvc and es6 syntax

## Initial Setup

> After cloning the project. Execute `npm i && npm link`

## Usage

    [directory-where-you-want-create-boilerplate] $ express-es6-generator <project-name> --style=scss --view=hbs

## TypeScript Support

    [directory-where-you-want-create-boilerplate] $ express-es6-generator <project-name> --typescript --style=scss --view=hbs

## Arguements

- Style [Supported]: SCSS, LESS, CSS, SASS
- View [Supported]: EJS, HBS
- Database [Supported]: mongo [Default], postgres, mysql

## Other Functionality 
### **(Same commands for both js, ts based project)**: Program automatically detect the type of the project so no need to specify --typescript for following commands

- --resource: This would create an entry in routes/index.js and create subsequent controller and service files.

> [inside-folder-where-boilerplate-is-created] \$ express-es6-generator --resource=phone

- --db: This would download mongoose and create initial setup files for connection with database along with sample user table with validation fields

> [inside-folder-where-boilerplate-is-created] \$ express-es6-generator <project-name> --db

    ## Arguements to db flag
    - You can also pass which db you want to generate using keys=postgres,mysql, but the default if no value is passed mongo is used.
    express-es6-generator <project-name> --db=<postgres|mongo|mysql>


- --auth: This would automatically create config files for authentication using JWT and uses created User table fields

> [inside-folder-where-boilerplate-is-created] \$ express-es6-generator <project-name> --db --auth
