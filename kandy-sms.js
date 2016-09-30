/**
 * Copyright 2016 GENBAND, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    'use strict';

    var RestClient = require('node-rest-client').Client;
    var client = new RestClient();

    function KandyUserNode(n) {
        RED.nodes.createNode(this, n);
        this.key = n.apikey;
        this.username = n.username;
        this.password = n.password;
        this.from = n.from;
    }
    RED.nodes.registerType('kandy-user', KandyUserNode);

    function KandySmsOutNode(n) {
        RED.nodes.createNode(this, n);
        this.number = n.number;

        this.user = RED.nodes.getNode(n.user);

        if (this.user) {
            this.key = this.user.key;
            this.username = this.user.username;
            this.password = this.user.password;
            this.fromNumber = this.user.from;
        } else {
            this.error('No kandy user');
            return;
        }

        var node = this;

        this.on('input', function (msg) {
            if (typeof(msg.payload) == 'object') {
                msg.payload = JSON.stringify(msg.payload);
            }

            node.number = node.number || msg.topic

            if (!node.number)
                return

            try {
                client.get(`https://api.kandy.io/v1.2/domains/users/accesstokens?key=${node.key}&user_id=${node.username}&user_password=${node.password}`, function (uatData) {
                    if (uatData && uatData.status !== 0) {
                        node.error(new Error(uatData.message))
                        return
                    }

                    var uat = uatData.result.user_access_token

                    client.get(`https://api.kandy.io/v1.2/users/devices?key=${uat}`, function (deviceData) {
                        if (deviceData && deviceData.status !== 0) {
                            node.error(new Error(deviceData.message))
                            return
                        }

                        var deviceId = deviceData.result.devices[0].id

                        if (!deviceId) {
                            node.error(new Error('No device found for the user.'))
                            return
                        }

                        client.post(`https://api.kandy.io/v1.2/devices/smss?key=${uat}&device_id=${deviceId}`, {
                            data: {
                                'message': {
                                    'source': node.from,
                                    'destination': node.number,
                                    'message': {
                                        'text': msg.payload
                                    }
                                }
                            },
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }, function (response) {
                            if (response && response.status !== 0)
                                node.error(new Error(response.message))
                        });
                    });
                });
            } catch (err) {
                node.error(err);
            }
        });
    }
    RED.nodes.registerType('kandy-sms out', KandySmsOutNode);
}
