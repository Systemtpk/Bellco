/* jshint browser: true, esversion: 5, asi: true */
/*globals uibuilder, Vue */
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

var app1 = new Vue({
    // The HTML element to attach to
	el: '#app',
	/** Pre-defined data
	 *  Anything defined here can be used in the HTML
	 *  if you update it, the HTML will automatically update
	 */
	data: {

		// individual attributes
		circleFill: '#ff0000',
		circleRadius: 100,
		
		// attributes grouped into styles
		appStyle: {
		    backgroundColor: '#ffffff'
		},
		squareStyle: {
		    fill: '#00ff00',
		    stroke: 'black',
		    strokeWidth: '3',
		    x:800,
		    y:400,
		    width: 200,
		    height:200,
		},
		triangleStyle: {
		    fill: '#ffff00',
		    stroke: 'black',
		    strokeWidth: '3'
		}
	},

    // This is called when Vue is fully loaded
	mounted: function() {
	    
	    // Start up uibuilder
		uibuilder.start()
		
		// Keep a convenient reference to the Vue app
		var app = this

        /** Triggered when the node on the Node-RED server
         *  recieves a (non-control) msg
         */
		uibuilder.onChange('msg', function(msg) {
		    
		    // change app style
		    if(msg.topic === 'svg/app') {
    		    app.appStyle.backgroundColor = msg.payload;
		    }
		   
		    // change circle attribute 
	        if(msg.topic === 'svg/circle') {
    			app.circleFill = msg.payload;
	        }
    			
			// change square style
			if(msg.topic === 'svg/square') {
    			app.squareStyle.fill = msg.payload;
			}
			
			//change triangle style
			if(msg.topic === 'svg/triangle') {
			    app.triangleStyle.fill = msg.payload;
			}
			
			// change square size
		    if(msg.topic === 'svg/square/size') {
			    var d = msg.payload;
    			app.squareStyle.width = d;
    			app.squareStyle.height = d;
    			app.squareStyle.x = 900 - d/2;
    			app.squareStyle.y = 500 - d/2;
			}
			
			// change circle size
		    if(msg.topic === 'svg/circle/size') {
    			app.circleRadius = msg.payload
			}
			
			
		})

		// Send message back to node-red
		// uibuilder.send({payload:'some message'})

		// Triggered on reciept of a control message from node-red
		//uibuilder.onChange('ctrlMsg', function(msg) {
		//    console.log(msg)
		//})
	},
	
}) // --- End of the Vue app definition --- //

// EOF