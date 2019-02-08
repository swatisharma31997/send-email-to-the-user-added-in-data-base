
'use strict';
const functions = require('firebase-functions');
//[Start Imports]
var firebase = require('firebase-admin');
//[End Imports]
var nodemailer = require('nodemailer');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.database();

var schedule = require('node-schedule');
var Promise = require('promise');
var escape = require('escape-html');

   const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: gmailEmail,
    pass: gmailPassword
    }
    });
  
    console.log(gmailEmail);
    console.log(gmailPassword);



const APP_NAME = 'Cloud Storage for Firebase quickstart';


exports.sendTestEmail = functions.database.ref('/users/{uid}').onWrite(event => {
  console.log("sendtestemail")
  const user = event.data.val();
  const email = user.email;
  console.log(email)
return sendEmail(email);

});

/* Send an account deleted email confirmation to users who delete their accounts.
*/
// [START onDeleteTrigger]
exports.sendByeEmail = functions.database.ref('/users/{uid}').onDelete(event => {
// [END onDeleteTrigger]
console.log("send bye email");
 const user = event.data.previous.val();

 const email = user.email;
 
 return sendGoodbyEmail(email);
});
// [END sendByeEmail]

exports.student = functions.https.onRequest(function(req,res) {
  console.log("inside student")
  res.status(200).send("useradded");
  return studentdet(req, res);
});

function sendEmail(email){
  const mailOptions={
    from:`${APP_NAME} <noreplay@firenode1.com>`,
    to: email
  };
  mailOptions.subject=`welcome to ${APP_NAME}`;
  mailOptions.text="Welcome to firebase email service";
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('new welcome email sent to ', email);

  });
}

// Sends a goodbye email to the given user.
function sendGoodbyEmail(email) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firenode1.com>`,
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey user!, We confirm that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Account deletion confirmation email sent to:', email);
  });
}
function studentdet(request,response){
  return db.ref('users/').child('/'+request.body.uid+'/').update({
    email:request.body.email,
    uid:request.body.uid
  })
}