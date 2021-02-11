## Wykopot

Simple bot written using Node.js (ES6) with 100% code coverage.
### The idea behind the project
The aim of the project was to create a simple bot that will be creating new posts and comments basing on posts & comments that already exist. Combining some random cool posts with random most notable comments should lead to some funny content (at least it did in my head...).

### Hot to run it
1. `cp .env.example .env`
1. fill all env variables inside `.env` file
1. `npm run start`

### Some key buzzwords (libs) that were used
1. sinon, mocha, chai, nyc for testing purposes
1. eslint for checking code quality
1. axios for sending http request
1. mustache for building simple templates (posts and comments)
1. node-cron for scheduling tasks
1. Simple CI/CD provided by GitHub - in order to automate linting and running unit tests

### How does it work
1. it searches for active post with most votes using wykop V2 api
1. then it queries for hot post with most votes and extracts top 3 most voted comments, it picks randomly 1 comment
1. then it creates new post and new comment including data that was previously fetched
1. It sends new content to https://wykop.pl
1. it repeats after given interval

