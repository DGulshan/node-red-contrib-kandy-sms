node-red-contrib-kandy-sms
=======================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to send SMS via <a href="https://developer.kandy.io" target="_new">Kandy</a>.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-kandy-sms


Usage
-----

To send an SMS using Kandy’s REST API, you must have an account with Kandy. You can register for one <a href="https://developer.kandy.io/signup">here</a> using the promo code “kandyflow” to receive 5 free users that can each send 200 SMSs.

If you don't have an account already:
- Create an account. This will not take more than 5 minutes.
- Create a project (part of creating an account).
- Create some users (also part of creating an account for the first time).

You need to configure a Kandy user in this node which requires three parameters: `DomainApiKey`, `username` & `password`.
`DomainApiKey` belongs to the project that you created, `username` & `password` can be of any user under this project (you can get these details under Projects tab in your account).

`msg.payload` is used as the body of the message. You can provide a number during configuration or alternatively, if the number is left blank, it can be set using `msg.topic`.
