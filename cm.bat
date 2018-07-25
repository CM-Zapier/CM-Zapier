@echo off

if "%1" EQU "install" (
    npm install -g zapier-platform-cli
    zapier login
    npm install
)

if "%1" EQU "branch" (
    if "%2" NEQ "release" if "%2" NEQ "backup" GOTO end

    echo Switching branches...
    copy /y "%2.zapierapprc" ".zapierapprc"
    echo Current branch: %2
)

if "%1" EQU "push" (
    cm branch %2
    npm run zapier-push
)

if "%1" EQU "test" (
    npm run zapier-dev
    zapier test
)

:end