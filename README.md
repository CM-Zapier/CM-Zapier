# CM-Zapier  
`/triggers` - Triggers in Zapier (this includes a trigger that checks if the product token is valid)  
`/searches` - Searches in Zapier  
`/creates` - Actions in Zapier  
  
`/test` - Unit tests  
`.env` - Variables used for testing
  
`authentication.js` - Authentication fields  
`index.js` - Collection of triggers, searches, actions and information like version numbers  
`scripting.js` - This file works on both the Web Builder and the CLI
  
  
## Version numbers
This project uses [SemVer](https://semver.org/) for versioning.  
You can find the version number in `package.json`.  
  
  
## Installing the project
### Install the Zapier CLI
`npm install -g zapier-platform-cli`  
  
### Log in to Zapier
`zapier login`  
  
### Install app libraries
`npm install` from the main directory of the app  
  

## Using the project
### Running tests
`zapier test` from the main directory of the app

### Publishing the current version
`zapier push` from the main directory of the app

### Commands for managing versions
See [the Zapier documentation](https://github.com/zapier/zapier-platform-cli?utm_source=zapier.com&utm_medium=referral&utm_campaign=zapier#deploying-an-app-version)
