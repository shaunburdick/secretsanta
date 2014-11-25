module.exports = {
  people: [
    { name: 'Some One', email: 'some.one@example.com' },
    { name: 'Another One', email: 'another.one@yahoo.com' }
  ],
  from: "Santa Claus <santa@northpole.org>",
  subject: "Secret Santa Assignment",
  body: {
    text: "Hello {{sender.name}}! Your Secret Santa assignment is: {{receiver.name}}",
    html: "Hello {{sender.name}}!<br />Your Secret Santa assignment is: <b>{{receiver.name}}</b>"
  }
};