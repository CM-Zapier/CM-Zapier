# CM-Zapier  
## 1. Project structure
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
1. `npm install -g zapier-platform-cli`
2. `zapier login`
3. `npm install` from the main directory of the app
  
---

## 3. Using the project
Description  | Command
------------ | -------------
Run tests | `zapier test`
Switching to the release branch | `cm branch release`
Switching to the backup branch | `cm branch backup`
Push release to Zapier | `cm push release`, `cm push`
Push backup to Zapier | `cm push backup`
Delete version | `zapier delete version [version]`

_Commands have to be run from the main directory of the app._

For more commands, visit [the Zapier documentation](https://github.com/zapier/zapier-platform-cli?utm_source=zapier.com&utm_medium=referral&utm_campaign=zapier#deploying-an-app-version)
