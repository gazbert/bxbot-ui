# BX-bot UI

[![Node.js CI](https://github.com/gazbert/bxbot-ui/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/gazbert/bxbot-ui/actions/workflows/node.js.yml)

**Note:** _This project is very much work in progress and not safe for production._

## What is BX-bot UI?

<img src="./docs/bxbot-ui-github-scaled.png" align="right" width="25%" />

BX-bot UI is an Angular app (and learning journey!) for administering [BX-bot](https://github.com/gazbert/bxbot).

Although being developed as a 'real-world' app, the code _tries_ to showcase different features of Angular and 
[TypeScript](https://www.typescriptlang.org/). It's not meant to be an Angular 101 tutorial - the 
[Angular Documentation](https://angular.io/docs) does a far better job!

## Installation Guide

### The Docker way
If you want to just play around with the UI, Docker is the way to go.

1. Install [Docker](https://docs.docker.com/engine/installation/) on the machine you want to run the app.
1. Fetch the BX-bot image from [Docker Hub](https://hub.docker.com/r/gazbert/bxbot-ui/): `docker pull gazbert/bxbot-ui:0.0.1`
1. Run the Docker container: `docker run --name bxbot-ui-0.0.1 -it --rm -p 4200:4200 gazbert/bxbot-ui:0.0.1`
1. Open a browser and go to: `http://localhost:4200`
1. You can stop the container using `CTRL-c`
   
The current [Docker image](https://hub.docker.com/r/gazbert/bxbot-ui/tags/) is not a release, but rather a 
rolling development version of the UI...
  
### The manual way
You'll need [node.js](https://nodejs.org/en/download/) installed to build and run the app - it's being developed on 12.22.x.

1. Install the [Angular CLI](https://cli.angular.io/) globally: `sudo npm install -g @angular/cli`
1. Clone this repo locally.
1. Change directory to the root of the project.
1. Run `npm install` to install the dependencies - you'll only need to do this once, unless the versions are updated in 
   the [`package.json`](./package.json)
1. To start the app: `npm start`
1. Open a browser and go to: `http://localhost:4200`
1. To stop the app, `CTRL-c` from the command line.

## Build Guide
Follow the instructions in the [_The manual way_](#the-manual-way) section if you've not already done so.

The project uses Angular CLI [commands](https://github.com/angular/angular-cli/wiki) to build, test, and run the app.

### Building the App
1. Run `npm run build` to compile the application into the `dist` output directory.                   

### Jasmine Unit Tests
The app has behaviour-driven unit tests written using the excellent [Jasmine](https://jasmine.github.io/) framework. 

1. To run the tests once: `npm run test:once`
1. To continuously run the tests in the background using [Karma](https://karma-runner.github.io/1.0/index.html):
   `npm test` - Karma will monitor code changes and trigger re-running of the tests.
1. To stop Karma, `CTRL-c` from the command line.

### Protractor End-to-End Tests
The app has [e2e](e2e) tests written using [Protractor](http://www.protractortest.org).

1. To run the tests once: `npm run e2e`. It's usually best not to have the app running at the same time.

### TSLint 
The build has a [TSLint](https://palantir.github.io/tslint/) script that checks for code readability, maintainability, and
functionality errors. The [tslint.json](tslint.json) file contains the linting rules.

1. To run the linter: `npm run lint`

## Configuration
The app uses Angular's [In Memory Web API](https://github.com/angular/in-memory-web-api) as a replacement
backend for development and local testing. The API config configuration options are set in [`app.module.ts`](/src/app/app.module.ts).

The application config is in JSON format and lives in the [`in-memory-data.service.ts`](/src/app/model/in-memory-data.service.ts) file.

## Coming Soon
* Integration with [BX-bot](https://github.com/gazbert/bxbot-ui).
* A new 'Runtime' screen tab for displaying the bot's status, stopping/restarting, and viewing/downloading the latest log file.

## Credits
This app started life as the [Angular 4 QuickStart](https://github.com/angular/quickstart) app and was later migrated to use 
the [Angular CLI](https://github.com/angular/angular-cli/wiki/stories-moving-into-the-cli). 
It took (a lot of) inspiration from the following:

* The official [Angular Tutorial](https://angular.io/tutorial) and [Angular Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html).
* Scotch tutorials by [Jecelyn Yeen](https://pub.scotch.io/@jecelyn).
* Lots of insightful articles by (former) Angular dev [Victor Savkin](https://vsavkin.com/).
* [Juri Strumpflohner's](https://juristr.com/blog/collections/angular/) Angular blogs.
* Blog posts by [Thoughtram](http://blog.thoughtram.io/angular/2016/09/15/angular-2-final-is-out.html).
* A great tutorial for adding [JWT authentication](http://chariotsolutions.com/blog/post/angular-2-spring-boot-jwt-cors_part2/)
  to your Angular app by Rich Freedman.
