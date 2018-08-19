@echo off

if "%1" EQU "install" (
    echo Part 1 of 5: Installing TypeScript...
    npm install -g typescript
    echo Part 2 of 5: Installing the Zapier CLI...
    npm install -g zapier-platform-cli
    echo Part 3 of 5: Logging in...
    zapier login
    echo Part 4 of 5: Installing project dependencies...
    npm install
    echo Part 5 of 5: Building project...
    project build
    echo Done
)

if "%1" EQU "branch" (
    if "%2" NEQ "release" ( 
        if "%2" NEQ "backup" (
            goto:eof
        ) 
    )

    echo Switching branches...
    copy /y "%2.zapierapprc" ".zapierapprc"
    echo Current branch: %2
)

if "%1" EQU "build" (
    if "%2" EQU "--clean" ( 
        tsc -b --verbose --force
    ) else (
        tsc -b --verbose
    )
)

if "%1" EQU "compile" (
    tsc
)

if "%1" EQU "push" (
    project branch %2
    project build
    zapier push
)

if "%1" EQU "test" (
    project build
    zapier test
)