var casper = require('casper').create({
    //verbose: true,
    logLevel: 'debug'
});

var credientials = require('./credentials.json');
var baseUrl = 'https://www.parse.com';
var keyword = '';

// Evaluate function
var searchKeywordInTable = function (keyword, baseUrl) {
    var rows = document.querySelectorAll('table#push_table tr[data-href]');
    var url = '';
    var isFound = false;
    for (var i = 0; i < rows.length && !isFound; i++) {
        var cell = rows[i].querySelector('td.push_name');
        //__utils__.echo(cell.textContent.trim());
        if (cell.textContent.search(keyword) != -1) {
            url = baseUrl + rows[i].getAttribute('data-href');
            isFound = true;
        }
    }
    return url;
};

// Login
casper.start('https://www.parse.com/login', function () {
    // Check the parameters
    if (!casper.cli.has(0)) {
        this.die("Missing keyword parameter", 1);
    }
    keyword = casper.cli.get(0);

    this.echo('Login...');
    this.fill('form#new_user_session', {
        'user_session[email]': credientials.email,
        'user_session[password]': credientials.password
    }, true);
});
casper.then(function () {
});
// Go to push log
casper.thenOpen('https://www.parse.com/apps/' + credientials.projectUrl + '/push_notifications', function (result) {
    this.echo(result.url);
    var pushItemUrl = this.evaluate(searchKeywordInTable, keyword, baseUrl);
    if (pushItemUrl !== null && pushItemUrl.length > 0) {
        this.echo('Found! [' + pushItemUrl + ']');
        this.exit();
    } else if (this.exists('a.next_page')) {
        this.echo('Not found, move on to next page...');
        this.emit('nextPage');
    } else {
        this.exit();
    }
});
// Next page event
casper.on('nextPage', function () {
    this.click('a.next_page');
    this.then(function (result) {
        this.echo(result.url);
        var pushItemUrl = this.evaluate(searchKeywordInTable, keyword, baseUrl);
        if (pushItemUrl !== null && pushItemUrl.length > 0) {
            this.echo('Found! [' + pushItemUrl + ']');
            this.exit();
        } else if (this.exists('a.next_page')) {
            this.echo('Not found, move on to next page...');
            this.emit('nextPage');
        } else {
            this.exit();
        }
    });
});

casper.run();