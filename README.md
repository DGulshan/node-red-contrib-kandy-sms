node-red-node-kandy-sms
=======================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to send SMS messages via <a href="https://developer.kandy.io" target="_new">Kandy</a>.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-node-kandy-sms


Usage
-----

Sends an SMS message using Kandy.

This out node is configured to send SMS.

`msg.payload` is used as the body of the message. You can provide a number while configuring or alternatively, if the number is left blank, it can be set using `msg.topic`.

You must have an account with Kandy. You can register <a href="https://developer.kandy.io/signup">here</a>
