/* jshint browser: true, esversion: 5, asi: true */
/*globals Vue, uibuilder */
// @ts-nocheck
/*
  Copyright (c) 2019 Julian Knight (Totally Information)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
'use strict'

/** @see https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki/Front-End-Library---available-properties-and-methods */

// eslint-disable-next-line no-unused-vars
var app1 = new Vue({
    el: '#app',
    data: {
        startMsg    : 'Vue has started, waiting for messages',
        feVersion   : '',
        counterBtn  : 0,
        inputText   : null,
        inputChkBox : false,
        socketConnectedState : false,
        serverTimeOffset     : '[unknown]',
        imgProps             : { width: 75, height: 75 },

        msgRecvd    : '[Nothing]',
        msgsReceived: 0,
        msgCtrl     : '[Nothing]',
        msgsControl : 0,

        msgSent     : '[Nothing]',
        msgsSent    : 0,
        msgCtrlSent : '[Nothing]',
        msgsCtrlSent: 0,
        Status : '',
        colorStatus : '',
        OPC_TargetSpeed : '0',
        OPC_PasswordLevel : '',
        OPC_MachineMode : '',
        OPC_MachineStatus : '',
        data : '',
        OPC_RealSpeed: '0',
        OPC_GoodPacks : '',
        OPC_Rejects : '',
        OPC_OEE : '',
        OPC_Availability : '',
        OPC_Performance : '',
        OPC_Quality : '',
        OPC_RecipeName : '',
        OPC_LotCode : '',
        StatusStyle: '',
        Plan_Product_Time: '0',
        oeeQuality: '',
        oee_Performance: '',
        oee_Availability: '',
        oee_Totale: '',
        OeeQuality_color: '',
        oee_Performance_color: '',
        oee_Availability_color: '',
        oee_Totale_color: '',
        LastPacked: '',
        WaitTime: '',
        StopTime: '',
        Scarto_1: '',
        Scarto_1_value: '',
        Scarto_2: '',
        Scarto_2_value: '',
        Scarto_3: '',
        Scarto_3_value: '',
        totaleformat: '',
        Stopformat: '',
        waitformat: ''
    }, 
// --- End of data --- //
    computed: {
        hLastRcvd: function() {
            var msgRecvd = this.msgRecvd
            if (typeof msgRecvd === 'string') return 'Last Message Received = ' + msgRecvd
            else return 'Last Message Received = ' + this.syntaxHighlight(msgRecvd)
        },
        hLastSent: function() {
            var msgSent = this.msgSent
            if (typeof msgSent === 'string') return 'Last Message Sent = ' + msgSent
            else return 'Last Message Sent = ' + this.syntaxHighlight(msgSent)
        },
        hLastCtrlRcvd: function() {
            var msgCtrl = this.msgCtrl
            if (typeof msgCtrl === 'string') return 'Last Control Message Received = ' + msgCtrl
            else return 'Last Control Message Received = ' + this.syntaxHighlight(msgCtrl)
        },
        hLastCtrlSent: function() {
            var msgCtrlSent = this.msgCtrlSent
            if (typeof msgCtrlSent === 'string') return 'Last Control Message Sent = ' + msgCtrlSent
            //else return 'Last Message Sent = ' + this.callMethod('syntaxHighlight', [msgCtrlSent])
            else return 'Last Control Message Sent = ' + this.syntaxHighlight(msgCtrlSent)
        },
    }, // --- End of computed --- //
    methods: {
        increment: function(event) {
            console.log('Button Pressed. Event DatA: ', event)

            // Increment the count by one
            this.counterBtn = this.counterBtn + 1
            var topic = this.msgRecvd.topic || 'uibuilder/vue'
            uibuilder.send( {
                'topic': topic,
                'payload': {
                    'type': 'counterBtn',
                    'btnCount': this.counterBtn,
                    'message': this.inputText,
                    'inputChkBox': this.inputChkBox
                }
            } )

        }, // --- End of increment --- //

        // return formatted HTML version of JSON object
        syntaxHighlight: function(json) {
            json = JSON.stringify(json, undefined, 4)
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number'
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key'
                    } else {
                        cls = 'string'
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean'
                } else if (/null/.test(match)) {
                    cls = 'null'
                }
                return '<span class="' + cls + '">' + match + '</span>'
            })
            return json
        }, // --- End of syntaxHighlight --- //
    }, // --- End of methods --- //

    // Available hooks: init,mounted,updated,destroyed
    mounted: function(){
        //console.debug('[indexjs:Vue.mounted] app mounted - setting up uibuilder watchers')

        /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
         * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
         * The namespace is the "url" you put in uibuilder's configuration in the Editor.
         * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
         * e.g. uibuilder.start('uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
         */
        uibuilder.start()

        var vueApp = this

        // Example of retrieving data from uibuilder
        // vueApp.feVersion = uibuilder.get('version')

        /** You can use the following to help trace how messages flow back and forth.
         * You can then amend this processing to suite your requirements.
         */

        //#region ---- Trace Received Messages ---- //
        // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
        // newVal relates to the attribute being listened to.
        uibuilder.onChange('msg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', newVal)
            vueApp.msgRecvd = newVal
                if (newVal.topic == "data"){
                vueApp.data = newVal.payload;
                }
                if (newVal.topic == "OPC_LotCode"){
                vueApp.OPC_LotCode = newVal.payload;
                }
                if (newVal.topic == "Plan_Product_Time"){
                vueApp.Plan_Product_Time = newVal.payload;
                }
                if (newVal.topic == "OPC_RecipeName"){
                vueApp.OPC_RecipeName = newVal.payload;
                }
                if (newVal.topic == "OPC_OEE"){
                vueApp.OPC_OEE = newVal.payload;
                }
                if (newVal.topic == "OPC_Availability"){
                vueApp.OPC_Availability = newVal.payload;
                }
                if (newVal.topic == "OPC_Performance"){
                vueApp.OPC_Performance = newVal.payload;
                }
                if (newVal.topic == "OPC_Quality"){
                vueApp.OPC_Quality = newVal.payload;
                }
                if (newVal.topic == "oeeQuality"){
                vueApp.oeeQuality = newVal.payload;
                }
                if (newVal.topic == "oee_Performance"){
                vueApp.oee_Performance = newVal.payload;
                }
                if (newVal.topic == "oee_Availability"){
                vueApp.oee_Availability = newVal.payload;
                }
                if (newVal.topic == "oee_Totale"){
                vueApp.oee_Totale = newVal.payload;
                }
                if (newVal.topic == "OPC_TargetSpeed"){
                vueApp.OPC_TargetSpeed = newVal.payload;
                }
                if (newVal.topic == "OPC_RealSpeed"){
                vueApp.OPC_RealSpeed = newVal.payload;
                }
                if (newVal.topic == "OPC_GoodPacks"){
                vueApp.OPC_GoodPacks = newVal.payload;
                }
                if (newVal.topic == "OPC_Rejects"){
                vueApp.OPC_Rejects = newVal.payload;
                }
                if (newVal.topic == "OPC_PasswordLevel"){
                vueApp.OPC_PasswordLevel = newVal.payload;
                }
                if (newVal.topic == "OPC_MachineMode"){
                vueApp.OPC_MachineMode = newVal.payload;
                }
                if (newVal.topic == "OPC_MachineStatus"){
                vueApp.OPC_MachineStatus = newVal.payload;
                }
                if (newVal.topic == "colorStatus"){
                vueApp.StatusStyle = newVal.payload;
                }
                if (newVal.topic == "OeeQuality_color"){
                vueApp.OeeQuality_color = newVal.payload;
                }
                if (newVal.topic == "oee_Performance_color"){
                vueApp.oee_Performance_color = newVal.payload;
                }
                if (newVal.topic == "oee_Availability_color"){
                vueApp.oee_Availability_color = newVal.payload;
                }
                if (newVal.topic == "oee_Totale_color"){
                vueApp.oee_Totale_color = newVal.payload;
                }
                if (newVal.topic == "LastPacked"){
                vueApp.LastPacked = newVal.payload;
                }
                if (newVal.topic == "WaitTime"){
                vueApp.WaitTime = newVal.payload;
                }
                if (newVal.topic == "StopTime"){
                vueApp.StopTime = newVal.payload;
                }
                if (newVal.topic == "Scarto_1"){
                vueApp.Scarto_1 = newVal.payload;
                }
                if (newVal.topic == "Scarto_1_value"){
                vueApp.Scarto_1_value = newVal.payload;
                }
                if (newVal.topic == "Scarto_2"){
                vueApp.Scarto_2 = newVal.payload;
                }
                if (newVal.topic == "Scarto_2_value"){
                vueApp.Scarto_2_value = newVal.payload;
                }
                if (newVal.topic == "Scarto_3"){
                vueApp.Scarto_3 = newVal.payload;
                }
                if (newVal.topic == "Scarto_3_value"){
                vueApp.Scarto_3_value = newVal.payload;
                }
                if (newVal.topic == "totaleformat"){
                vueApp.totaleformat = newVal.payload;
                }
                if (newVal.topic == "Stopformat"){
                vueApp.Stopformat = newVal.payload;
                }
                if (newVal.topic == "waitformat"){
                vueApp.waitformat = newVal.payload;
                }
                
            
                
        })
        // As we receive new messages, we get an updated count as well
        uibuilder.onChange('msgsReceived', function(newVal){
            //console.info('[indexjs:uibuilder.onChange] Updated count of received msgs:', newVal)
            vueApp.msgsReceived = newVal
        })

        // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
        uibuilder.onChange('ctrlMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal)
            vueApp.msgCtrl = newVal
        })
        // Updated count of control messages received
        uibuilder.onChange('msgsCtrl', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal)
            vueApp.msgsControl = newVal
        })
        //#endregion ---- End of Trace Received Messages ---- //

        //#region ---- Trace Sent Messages ---- //
        // You probably only need these to help you understand the order of processing //
        // If a message is sent back to Node-RED, we can grab a copy here if we want to
        uibuilder.onChange('sentMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal)
            vueApp.msgSent = newVal
        })
        // Updated count of sent messages
        uibuilder.onChange('msgsSent', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal)
            vueApp.msgsSent = newVal
        })

        // If we send a control message to Node-RED, we can get a copy of it here
        uibuilder.onChange('sentCtrlMsg', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal)
            vueApp.msgCtrlSent = newVal
        })
        // And we can get an updated count
        uibuilder.onChange('msgsSentCtrl', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal)
            vueApp.msgsCtrlSent = newVal
        })
        //#endregion ---- End of Trace Sent Messages ---- //

        // If Socket.IO connects/disconnects, we get true/false here
        uibuilder.onChange('ioConnected', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)
            vueApp.socketConnectedState = newVal
        })
        // If Server Time Offset changes
        uibuilder.onChange('serverTimeOffset', function(newVal){
            //console.info('[indexjs:uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)
            vueApp.serverTimeOffset = newVal
        })

    } // --- End of mounted hook --- //

}) // --- End of app1 --- //

// EOF