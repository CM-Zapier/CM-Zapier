# CM-Zapier  
## 1. Project structure (in /src/)
_**Note:** this structure currently isn't up-to-date, this will be fixed soon_  
- `/triggers` - Triggers in Zapier
- `/searches` - Searches in Zapier
  - `numberVerifier.js`
  - `numberVerifier-outputFields.json5` - Descriptions of the result items we get from the search
  - `numberVerifier-sample.json5` - An example response to return when Zapier can't access the CM API
- `/creates` - Actions in Zapier
  - `textMessage.js`
  - `voiceMessage.js`
- `/model` - Classes
  - `TextMessage.js`
  - `Voice.js` - Voice object with language, gender and number
  - `VoiceMessage.js`
  - `ZapierRequest.js` - Class used for HTTP Requests, with url, HTTP method, body, HTTP headers
- `/auth` - Authentication
  - `addAuthToHeaders.js` - Adds a header with a product token to every HTTP request
  - `authentication.js`
  
- `/test` - Unit tests  
  - `index.js`
- `.env` - Variables used for testing
  
- `index.js` - Collection of triggers, searches, actions and information like version numbers  
- `ErrorHandlerCM.js` - File that handles errors returned by the CM API

---

## 2. Installing the project
`cm install`

_**Note**: If you're using PowerShell instead of cmd, use `.\cm` instead of `cm`_
  
---

## 3. Using the project
Description                              | Command                             | Example
---------------------------------------- | ----------------------------------- | -----------------------------------
**Tests**                                |                                     | 
Run tests                                | `cm test`                           | 
**Publish local code to Zapier**         |                                     | 
Switching to the release branch          | `cm branch release`                 | 
Switching to the backup branch           | `cm branch backup`                  | 
Push release to Zapier                   | `cm push release`                   | 
Push backup to Zapier                    | `cm push backup`                    | 
Push to Zapier with last selected branch | `cm push`                           | 
**Version management**                   |                                     | 
View all versions                        | `zapier versions`                   | 
Mark version as production version       | `zapier promote [version]`          | `zapier promote 1.0.0`
Migrate a % of users between versions    | `zapier migrate [fromVersion] [toVersion] [percentage]` | `zapier migrate 1.0.0 2.0.0 25%`
Deprecate version                        | `zapier deprecate [version] [date]` | `zapier deprecate 1.0.0 2021-12-02`, `zapier deprecate 1.0.0 2018-12-31`
Delete version                           | `zapier delete version [version]`   | `zapier delete version 1.3.37`
**Collaborate, share version**           |                                     | 
Share a version with a certain user      | `zapier invite [email] [version]`   | `zapier invite user@example.com 1.0.0`
Invite a developer to manage the app, **this will give the user admin rights, so be carefull with this one** | `zapier collaborate [email]` | `zapier collaborate user@cm.com`

_**Note**: Commands have to be run from the main directory of the app._  
_**Note**: If you're using PowerShell instead of cmd, use `.\cm` instead of `cm`._  
