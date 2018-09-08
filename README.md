# Zapier: CM integration
This project brings integration for CM's services into the Zapier platform.

## 1. Requirements
- A device (preferably Windows 10) with internet connection
- Node.js (v8 or higher recommended)
- npm
- A code editor (like Visual Studio Code)

## 2. Installation guide
Using PowerShell: `.\project install`  
Using cmd.exe: `project install`  
This will install dependencies, ask you for your Zapier login and finally build the project.

## 3. Usage
_For cmd.exe, remove the ".\\" at the beginning of each command._

### 3.1. Building the project
Normal build: `.\project build`  
Clean build: `.\project build --clean`  
~~Compile the project: `.\project compile`~~ (deprecated)

### 3.2. Running tests
`.\project test`, `.\project test libs`, `.\project test lib-utils`, `.\project test lib-CM`, `.\project test lib-Zapier`
This will also build the project.

### 3.3. Selecting a branch (zapier app)
CM uses a regular app (release branch) and a backup app (backup branch) on Zapier.  
Switch to release: `.\project branch release`  
Switch to backup: `.\project branch backup`

### 3.4. Publising to Zapier
Use `.\project push`. This will build the app and publish the app using the current branch.  
Use `.\project push release` or `.\project push backup` to select a custom branch.