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
  
## General notice
Verification of Product Token is disabled, go to `/triggers/new_account.js` to enable it.
