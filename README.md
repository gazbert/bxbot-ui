# BX-bot UI

[![Build Status](https://travis-ci.org/gazbert/bxbot-ui.svg?branch=master)](https://travis-ci.org/gazbert/bxbot-ui)

## What is BX-bot UI?

BX-bot UI is an Angular app (and learning project!) for administering [BX-bot](https://github.com/gazbert/bxbot).

Very much work in progress, but this is where we're [heading](https://github.com/gazbert/bxbot-ui/projects/1)...

## User Guide

You'll need [node.js](https://nodejs.org/en/download/) installed to build and run the app.

1. Clone the repo locally.
1. Change directory to the root of project.
1. Run `npm install` to install the dependencies - you'll only need to do this once, unless the versions are updated in 
   the [`package.json`](./package.json).
1. To start the app: `npm start` - a browser window should open with the app running.
1. To stop the app, CTRL-C from the command line.

### Jasmine Unit Tests

The app has behaviour driven unit tests written in [Jasmine](https://jasmine.github.io/). 

1. To run the tests once: `npm run test-once`
1. To continuously run the tests in the background using [Karma](https://karma-runner.github.io/1.0/index.html):
   `npm test` - Karma will monitor code changes and trigger re-running of the tests.

### Protractor End-To-End Tests

The app has e2e tests written using the [Protractor](http://www.protractortest.org) framework.

1. To run the tests once: `npm run e2e`. It's usually best not to have the app running at the same time.

### TSLint 

The build has a [TSLint](https://palantir.github.io/tslint/) script that checks for code readability, maintainability, and
functionality errors.

1. To run the linter: `npm run lint`

### Configuration

The app uses Angular's [In Memory Web API](https://github.com/angular/in-memory-web-api) as a replacement
backend for development and local testing.

The config is in JSON format and lives in the [`in-memory-data.service.ts`](/app/model/in-memory-data.service.ts) file.

## Credits
This app started life as the [Angular 2 QuickStart](https://github.com/angular/quickstart) app and took (a lot of)
inspiration from the following awesomeness:

* The official [Angular Tutorial](https://angular.io/docs/ts/latest/tutorial/).
* Scotch tutorials by [Jecelyn Yeen](https://pub.scotch.io/@jecelyn).
* [Juri Strumpflohner's](https://juristr.com/blog/collections/angular/) Angular blogs.
* Blog posts by [Thoughtram](http://blog.thoughtram.io/angular/2016/09/15/angular-2-final-is-out.html).