# Secret Santa.js

A quick node.js implementation of a random draw secret santa. This script will randomly pair people together and email each user a templated message saying who they are paired with.

## Installation
You will need node.js installed on your machine.

1. Clone/Download the repository
2. Run `npm install` to install requirements
3. Copy *config.example.js* to *config.js* and fill it out:
  * people: An array of objects that contain the person's name and email address
  * from: The email address you which the email to be from
  * subject: The subject of the email
  * body: The text/html message to send.  This implements some simplistic templating by replacing user property vars wrapped in {{}}:
    * giver: the giving user
    * receiver: the receiving user
    * Example: `{{giver.name}}` would be replace with the value of the giving user's name
  * transport: this can contain any [nodemailer](http://www.nodemailer.com/) transport settings you may need.  Leave `null` to use local SMTP.

## Usage
To run the script, simply run `node .` or `node app.js`
### Arguments
* -p : This will print the result pairing on the screen (*spoiler alert*)
* -t : This is a testing flag, it will not email the result to the users
* --file="filename" : This will output the pairing to a file for reference later
