# Search Parse.com push logs

Since Parse.com does not provide search feature in web console and API, thus I created a [CasperJS](http://casperjs.org/) script to perform search.

## Setup

This script requires [PhantomJS 1.9](http://phantomjs.org/) and [CasperJS 1.1-beta3](http://casperjs.org/) to execute.

Create *credentials.json* with the following contents:

    {
        "email": "example@example.com",
        "password": "123456",
        "projectUrl": "myproject"
    }

Where *email* and *password* are your login credentials and *projectUrl* is the URL of your project in Parse.com web console.

## Usage

    casperjs search.js 56299c

Where `56299c` is the search keyword.
