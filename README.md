# Express-MVC-ES7

Simple Express Boiler Plate creator with mvc and es7 syntax

## Initial Setup

> After cloning the project. Execute `npm i && npm link`

## Usage

    [directory-where-you-want-create-boilerplate] $ express-es7-generator <project-name> --style=scss --view=hbs

## Arguements

- Style [Supported]: SCSS, LESS, CSS, SASS
- View [Supported]: EJS, HBS

## Other Functionality

- --resource: This would create an entry in routes/index.js and create subsequent controller and service files.

> [inside-folder-where-boilerplate-is-created] \$ express-es7-generator --resource=phone

- --db: This would download mongoose and create initial setup files for connection with database along with sample user table with validation fields

> [inside-folder-where-boilerplate-is-created] \$ express-es7-generator <project-name> --db

- --auth: This would automatically create config files for authentication using JWT and uses created User table fields

> [inside-folder-where-boilerplate-is-created] \$ express-es7-generator <project-name> --db --auth
