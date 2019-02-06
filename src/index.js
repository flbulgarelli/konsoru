require('./jquery-console');

function renderPrompt() {
  var prompt = $('#prompt').attr('value');
  if (prompt && prompt.indexOf('ム') >= 0) {
    $('.jquery-console-prompt-label')
      .html('')
      .append('<i class="text-primary da da-mumuki"></i>')
      .append('<span>&nbsp;&nbsp;</span>');
  }
}

function classForStatus(status) {
  return 'jquery-console-message-' + (status === 'passed' ? 'value' : 'error');
}

function reportStatus(message, status, report) {
  report([{
    msg: message,
    className: classForStatus(status)
  }]);
  renderPrompt();
}

function clearConsole() {
  $('.jquery-console-message-error').remove();
  $('.jquery-console-message-value').remove();
  $('.jquery-console-prompt-box:not(:last)').remove()
}

class QueryConsole {
  constructor(options) {
    this.stateful = !!options.stateful;
    this.content = options.content || '';
    this.language = options.language;
    this.lines = [];
  }

  newQuery(line) {
    var cookies = this.stateful ? this.lines : [];
    return new Query(line, cookies, this);
  }

  clearState() {
    this.lines = [];
    clearConsole();
  }
  sendQuery(queryContent) {
    this.controller.promptText(queryContent);
    this.controller.typer.commandTrigger();
  }
}

class Query {
  constructor (line, cookie, console) {
    this.console = console;
    this.line = line;
    this.cookie = cookie;
  }

  get content() {
    return this.console.content;
  }

  get language() {
    return this.console.language;
  }

  submit(report, queryConsole, line) {
    var self = this;
    $.ajax(self._request).done(function (response) {
      self.displayQueryResult(report, queryConsole, line, response);
    }).fail(function (response) {
      reportStatus(response.responseText, 'failed', report);
    });
  }

  displayQueryResult(report, queryConsole, line, response) {
    if (response.exit !== 'errored') {
      queryConsole.lines.push(line);
      reportStatus(response.out, response.exit, report);
    } else {
      reportStatus(response.out, 'failed', report);
    }
  }

  get _request() {
    return {
      url: 'http://localhost:9292/query'  ,
      contentType: "application/json",
      dataType : "json",
      data : JSON.stringify(this._requestData),
      type: 'POST',
    };
  }

  get _requestData() {
    return {
      content: this.content,
      query: this.line,
      cookie: this.cookie,
      language: this.language
    };
  }
}


function init(options) {
  var prompt = $('#prompt').attr('value');
  var queryConsole = new QueryConsole(options);

  $('.console-reset').click(function () {
    queryConsole.clearState();
  });

  queryConsole.controller = $('.console').console({
    promptLabel: prompt + ' ',
    commandValidate: function (line) {
      return line !== "";
    },
    commandHandle: function (line, report) {
      queryConsole.newQuery(line).submit(report, queryConsole, line);
    },
    autofocus: !!$('#solution_editor_bottom').val(),
    animateScroll: true,
    promptHistory: true
  });

  renderPrompt();
};

module.exports = { init }
