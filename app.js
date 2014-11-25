'use strict';

var _ = require('underscore'),
  nodemailer = require('nodemailer'),
  transporter = nodemailer.createTransport(),
  argv = require('minimist')(process.argv.slice(2)),
  fs = require('fs'),
  config = require('./config');

var attempts = 5,
  matches = false;

do {
  matches = createPairs(config.people);
  attempts--;
} while (!matches && attempts >= 0);

if (matches) {
  var resultText = '';
  for (var i in matches) {
    resultText += matches[i][0].name + ' -> ' + matches[i][1].name) + '\n';
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
function emailPairs(pair) {
  var replaceMatch = /\{\{([\w\.]+)\}\}/g;
  transporter.sendMail({
    from: config.from,
    to: pair[0].name + " <" + pair[0].email + ">",
    subject: config.subject,
    text: config.body.text.replace(replaceMatch, function(match, p1) {
      switch (p1) {
        case 'receiver.name': return pair[1].name;
        case 'receiver.email': return pair[1].email;
        case 'sender.name': return pair[0].name;
        case 'sender.email': return pair[0].email;
        default: return 'Error';
      }
    }),
    html: config.body.html.replace(replaceMatch, function(match, p1) {
      switch (p1) {
        case 'receiver.name': return pair[1].name;
        case 'receiver.email': return pair[1].email;
        case 'sender.name': return pair[0].name;
        case 'sender.email': return pair[0].email;
        default: return 'Error';
      }
    })
  }, function(error, info) {
    if (error) {
      console.log('Unable to send email to ' + pair[0].name);
    } else {
      console.log('Sent email to ' + pair[0].name);
    }
  });
}