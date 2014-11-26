'use strict';

var _ = require('underscore'),
  config = require('./config'),
  nodemailer = require('nodemailer'),
  transporter = nodemailer.createTransport(config.transport),
  argv = require('minimist')(process.argv.slice(2)),
  fs = require('fs');

var attempts = 5,
  matches = false;

do {
  matches = createPairs(config.people);
  attempts--;
} while (!matches && attempts >= 0);

if (matches) {
  var resultText = '';
  for (var i in matches) {
    resultText += matches[i][0].name + ' -> ' + matches[i][1].name + '\n';
  }
  if (argv.p) {
    console.log(resultText);
  }

  if (argv.file) {
    fs.writeFile(argv.file, resultText, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Wrote results to: " + argv.file);
      }
    });
  }

  for (var i in matches) {
    if (!argv.t) {
      emailPairs(matches[i]);
    }
  }
} else {
  console.log("Error: Could not create matches");
  process.exit();
}

/**
 * Create an array of matching pairs.
 *
 * @param array people An array of people
 * @return array|false Either an array of [[people1, people2], ...] or false
 */
function createPairs(people)
{
  var retVal = false;

  if (people.length > 0) {
    var receivers = _.clone(people),
      matches = [];

    for (var i in people) {
      var sender = people[i];

      if (receivers.length === 1 && receivers[0].email === sender.email) {
        return retVal;
      }

      do {
        var receiverId = _.random(0, receivers.length - 1),
          receiver = receivers[receiverId];
      } while (receiver.email === sender.email);

      matches.push([sender, receiver]);
      receivers.splice(receiverId, 1);
    }

    if (matches.length > 0) {
      retVal = matches;
    }
  }

  return retVal;
}

/**
 * Email the two pairs.
 *
 * @return null
 */
function emailPairs(pair)
{
  var replaceMatch = /\{\{([\w\.]+)\}\}/g;

  var emailTemplate = function(match, keyword) {
    var retVal = 'Error',
      splits = keyword.split('.');

    if (splits.length === 2) {
      var user = (splits[0] === 'receiver') ? pair[1] : pair[0];
      if (user.hasOwnProperty(splits[1])) {
        retVal = '' + user[splits[1]];
      }
    }

    return retVal;
  };

  transporter.sendMail({
    from: config.from,
    to: pair[0].name + " <" + pair[0].email + ">",
    subject: config.subject,
    text: config.body.text.replace(replaceMatch, emailTemplate),
    html: config.body.html.replace(replaceMatch, emailTemplate)
  }, function(error, info) {
    if (error) {
      console.log('Unable to send email to ' + pair[0].name);
    } else {
      console.log('Sent email to ' + pair[0].name);
    }
  });
}