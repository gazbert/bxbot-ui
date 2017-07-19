# BX-bot UI

[![Build Status](https://travis-ci.org/gazbert/bxbot-ui.svg?branch=master)](https://travis-ci.org/gazbert/bxbot-ui)

## What is BX-bot UI?

[BX-bot UI](https://github.com/gazbert/bxbot-ui/wiki) is an Angular app (and learning journey!) for administering 
[BX-bot](https://github.com/gazbert/bxbot)

Although being developed as a 'real-world' app, the code _tries_ to showcase different features of Angular 4 and 
[TypeScript](https://www.typescriptlang.org/). It's not meant to be an Angular 101 tutorial - the 
[Angular Documentation](https://angular.io/docs) does a far better job!

_NOTE: This project is very much work in progress and not safe for production._

## User Guide

You'll need [node.js](https://nodejs.org/en/download/) installed to build and run the app.

1. Clone the repo locally.
1. Change directory to the root of project.
1. Run `npm install` to install the dependencies - you'll only need to do this once, unless the versions are updated in 
   the [`package.json`](./package.json).
1. To start the app: `npm start` - a browser window should open with the app up and running...
1. To stop the app, `CTRL-c` from the command line.

### Jasmine Unit Tests

The app has behaviour-driven unit tests written using the excellent [Jasmine](https://jasmine.github.io/) framework. 

1. To run the tests once: `npm run test:once`
1. To continuously run the tests in the background using [Karma](https://karma-runner.github.io/1.0/index.html):
   `npm test` - Karma will monitor code changes and trigger re-running of the tests.
1. To stop Karma, `CTRL-c` from the command line.

### Protractor End-to-End Tests

The app has e2e tests written using [Protractor](http://www.protractortest.org).

1. To run the tests once: `npm run e2e`. It's usually best not to have the app running at the same time.

### TSLint 

The build has a [TSLint](https://palantir.github.io/tslint/) script that checks for code readability, maintainability, and
functionality errors.

1. To run the linter: `npm run lint`

### Configuration

The app uses Angular's [In Memory Web API](https://github.com/angular/in-memory-web-api) as a replacement
backend for development and local testing. The API config configuration options are set in [`app.module.ts`](/src/app/app.module.ts).

The application config is in JSON format and lives in the [`in-memory-data.service.ts`](/src/app/model/in-memory-data.service.ts) file.

To communicate with the bots for real, the app will need configuring to use 
[BX-bot UI Server](https://github.com/gazbert/bxbot-ui-server) - currently work in progress.

## Coming Soon
* Integration with [BX-bot UI Server](https://github.com/gazbert/bxbot-ui-server).

## Credits
This app started life as the [Angular 4 QuickStart](https://github.com/angular/quickstart) app and took (a lot of)
inspiration from the following awesomeness:

* The official [Angular Tutorial](https://angular.io/tutorial).
* The [Angular Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html).
* Scotch tutorials by [Jecelyn Yeen](https://pub.scotch.io/@jecelyn).
* Lots of insightful articles by (former) Angular dev [Victor Savkin](https://vsavkin.com/).
* [Juri Strumpflohner's](https://juristr.com/blog/collections/angular/) Angular blogs.
* Blog posts by [Thoughtram](http://blog.thoughtram.io/angular/2016/09/15/angular-2-final-is-out.html).
* A great tutorial for adding [JWT authentication](http://chariotsolutions.com/blog/post/angular-2-spring-boot-jwt-cors_part2/)
  to your Angular app by Rich Freedman. 