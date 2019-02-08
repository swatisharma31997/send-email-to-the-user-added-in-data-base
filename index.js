
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

// TODO(DEVELOPER): Configure your email transport.
// Configure the email transport using the default SMTP transport and a GMail account.
// See: https://nodemailer.com/
// For other types of transports (Amazon SES, Sendgrid...) see https://nodemailer.com/2-0-0-beta/setup-transporter/
//var mailTransport = nodemailer.createTransport('smtps://firenode9%40gmail.com:firenode93@smtp.gmail.com');
// create reusable transport method (opens pool of SMTP connections) 
const gmailEmail= functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
/*const mailTransport = nodemailer.createTransport(
   `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);*/
   const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: gmailEmail,
    pass: gmailPassword
    }
    });
  
    console.log(gmailEmail);
    console.log(gmailPassword);

// TODO(DEVELOPER): Change the two placeholders below.
// [START initialize]
// Initialize the app with a service account, granting admin privileges
/*var serviceAccount = require('./service-account.json');

+..-.-firebase.initializeApp({
 credential: firebase.credential.cert(serviceAccount),
 databaseURL: 'https://firenode1.firebaseio.com'
});
var db = admin.database();
// [END initialize]

function sendNotificationToUser(rollno) {
    // Fetch the user's email.
    var userRef = firebase.database().ref('/users/' + rollno);
    userRef.once('value').then(function(snapshot) {
      var email = snapshot.val().email;
    console.log(email);
 // Send the email to the user.
    // [START_EXCLUDE]
    if (email) {
        sendNotificationEmail(email).then(function() {
          // Save the date at which we sent that notification.
          // [START write_fan_out]
          var update = {};
          update['/users/' + rollno + '/lastNotificationTimestamp'] =
              firebase.database.ServerValue.TIMESTAMP;
         // update['/user-posts/' + uid + '/' + postId + '/lastNotificationTimestamp'] =
             // firebase.database.ServerValue.TIMESTAMP;
          firebase.database().ref().update(update);
          // [END write_fan_out]
        });
      }
      // [END_EXCLUDE]
    }).catch(function(error) {
      console.log('Failed to send notification to user:', error);
    });
  }
  // [END single_value_read]
  
  
  /**
   * Send the new star notification email to the given email.
   */
 /* function sendNotificationEmail(email) {
    var mailOptions = {
      from: '"Firebase Database Quickstart" <noreply@firenode1.firebase.com>',
      to: email,
      subject: 'New student',
      text: 'welcome to our college!'
    };
    return mailTransport.sendMail(mailOptions).then(function() {
      console.log('welcome notification sent to: ' + email);
    });
  }

  
 
  exports.student=functions.https.onRequest(function (req, res) {
    console.log("working")
    res.status(200).send("useradded");
    return studentdetails(req, res);
})


function studentdetails(request,response){
  return db.ref('users/').child('/'+request.body.rollno+'/').update({
    displayName: request.body.displayName,
   rollno: request.body.rollno,
   email:request.body.email


})
}*/
// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Cloud Storage for Firebase quickstart';


exports.sendTestEmail = functions.database.ref('/users/{uid}').onWrite(event => {
  console.log("sendtestemail")
  const user = event.data.val();
  const email = user.email;
/*//if the user is deleted
  if(!event.data.exists()){
    console.log("do not exist");
    return sendGoodbyEmail(email);
    
  }*/
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