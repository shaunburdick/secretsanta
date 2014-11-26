module.exports = {
  // Your list of people in the format:
  // { name: 'Some Name', email: 'some.name@example.com' }
  people: [
    { name: 'Some One', email: 'some.one@example.com' },
    { name: 'Another One', email: 'another.one@yahoo.com' }
  ],

  // The from address for the email, ex: "Santa Claus <santa@northpole.org>"
  from: "Santa Claus <santa@northpole.org>",

  // The Subject of the email
  subject: "Secret Santa Assignment",

  /**
   * The body of the email.
   * You can specify a text and html version of the message.
   * It will also do some simplistic templating by replacing user property vars wrapped in {{}}:
   * giver: the giving user
   * receiver: the receiving user
   *
   * Example: {{giver.name}} would be replace with the value of the giving user's name
   */
  body: {
    text: "Hello {{giver.name}}! Your Secret Santa assignment is: {{receiver.name}}",
    html: "Hello {{giver.name}}!<br />Your Secret Santa assignment is: <b>{{receiver.name}}</b>"
  },

  // The email transport settings, see nodemailer docs: http://www.nodemailer.com/
  transport: null
};