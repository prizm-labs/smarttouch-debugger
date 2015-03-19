/************************************************************************
 *  Copyright 2010-2011 Worlize Inc.
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

function WebSocketClient() {
    //this.initCanvas(canvasId);
    
    // Define accepted commands
    this.messageHandlers = {
        // initCommands: this.initCommands.bind(this),
        // drawLine: this.drawLine.bind(this),
        // clear: this.clear.bind(this)
    };

    // {"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[298,229,299,229]}}

    // {"msg":"initCommands","data":[{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[298,229,299,229]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[299,229,304,227]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[304,227,312,220]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[312,220,322,214]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[322,214,335,205]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[335,205,344,199]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[344,199,355,194]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[355,194,360,189]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[360,189,363,187]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[363,187,364,186]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[364,186,358,186]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[358,186,354,188]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[354,188,349,192]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[349,192,347,196]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[347,196,346,200]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[346,200,346,209]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[346,209,346,222]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[346,222,350,235]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[350,235,363,245]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[363,245,382,255]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[382,255,395,259]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[395,259,407,264]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[407,264,417,267]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[417,267,423,269]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[423,269,426,269]}},{"msg":"drawLine","data":{"color":{"r":0,"g":0,"b":0},"points":[426,269,427,270]}}]}

    // Initial state
    this.touches = {};
    this.window = null;
    this.targets = [];

    // this.lastPoint = null;
    // this.mouseDown = false;
    // this.color = {
    //     r: 0,
    //     g: 0,
    //     b: 0
    // };
};

WebSocketClient.prototype.mapMessageHandlers = function(map){
    console.log("mapMessageHandlers",map);

    _.forIn(map,function(handler,message){
        this.messageHandlers[message] = handler;
    },this);
};

WebSocketClient.prototype.connect = function(host, port) {
    var url = "ws://"+host+":"+port;
    //var url = "ws://" + document.URL.substr(7).split('/')[0];
    
    // var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
    this.socket = new WebSocket(url, 'smarttouch-events'); // Chrome only
    // http://www.w3.org/TR/websockets/

    this.socket.onmessage = this.handleWebsocketMessage.bind(this);
    this.socket.onclose = this.handleWebsocketClose.bind(this);

    //this.addCanvasEventListeners();
    this.addWindowEventListeners();
};

WebSocketClient.prototype.handleWebsocketMessage = function(message) {
    console.log(message);
    try {
        var command = JSON.parse(message.data);
    }
    catch(e) { /* do nothing */ }
    
    if (command) {
        this.dispatchCommand(command);
    }
};

WebSocketClient.prototype.handleWebsocketClose = function() {
    alert("WebSocket Connection Closed.");
};

WebSocketClient.prototype.dispatchCommand = function(command) {
    // Do we have a handler function for this command?
    var handler = this.messageHandlers[command.msg];
    if (typeof(handler) === 'function') {
        // If so, call it and pass the parameter data
        handler.call(this, command.data);
    }
};

// WebSocketClient.prototype.initCommands = function(commandList) {
//     /* Upon connection, the contents of the whiteboard
//        are drawn by replaying all commands since the
//        last time it was cleared */
//     commandList.forEach(function(command) {
//         this.dispatchCommand(command);
//     }.bind(this));
// };

// WebSocketClient.prototype.sendClear = function() {
//     this.socket.send(JSON.stringify({ msg: 'clear' }));
// };

// WebSocketClient.prototype.setColor = function(r,g,b) {
//     this.color = {
//         r: r,
//         g: g,
//         b: b
//     };
// };

// WebSocketClient.prototype.drawLine = function(data) {
//     // Set the color
//     var color = data.color;
//     this.ctx.strokeStyle = 'rgb(' + color.r + "," + color.g + "," + color.b +')';

//     this.ctx.beginPath();
    
//     var points = data.points;
//     // Starting point
//     this.ctx.moveTo(points[0]+0.5, points[1]+0.5);
    
//     // Ending point
//     this.ctx.lineTo(points[2]+0.5, points[3]+0.5);
    
//     this.ctx.stroke();
// };

// WebSocketClient.prototype.clear = function() {
//     this.canvas.width = this.canvas.width;
// };

WebSocketClient.prototype.addWindowEventListeners = function(){

};

WebSocketClient.prototype.handleMouseDown = function(event) {
    this.mouseDown = true;
	this.lastPoint = this.resolveMousePosition(event);
};

WebSocketClient.prototype.handleMouseUp = function(event) {
    this.mouseDown = false;
    this.lastPoint = null;
};

WebSocketClient.prototype.handleMouseMove = function(event) {
    if (!this.mouseDown) { return; }

    var currentPoint = this.resolveMousePosition(event);

    // Send a draw command to the server.
    // The actual line is drawn when the command
    // is received back from the server.
    this.socket.send(JSON.stringify({
        msg: 'drawLine',
        data: {
            color: this.color,
            points: [
                this.lastPoint.x,
                this.lastPoint.y,
                currentPoint.x,
                currentPoint.y
            ]
        }
    }));
    
    this.lastPoint = currentPoint;
};

WebSocketClient.prototype.initCanvas = function(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.initCanvasOffset();
};

WebSocketClient.prototype.initCanvasOffset = function() {
    this.offsetX = this.offsetY = 0;
    var element = this.canvas;
    if (element.offsetParent) {
        do {
            this.offsetX += element.offsetLeft;
            this.offsetY += element.offsetTop;
        }
        while ((element = element.offsetParent));
    }
};

WebSocketClient.prototype.addCanvasEventListeners = function() {
    this.canvas.addEventListener(
        'mousedown', this.handleMouseDown.bind(this), false);
    
    window.document.addEventListener(
        'mouseup', this.handleMouseUp.bind(this), false);
        
    this.canvas.addEventListener(
        'mousemove', this.handleMouseMove.bind(this), false);
};

WebSocketClient.prototype.resolveMousePosition = function(event) {
    var x, y;
	if (event.offsetX) {
		x = event.offsetX;
		y = event.offsetY;
	} else {
		x = event.layerX - this.offsetX;
		y = event.layerY - this.offsetY;
	}
	return { x: x, y: y };
};
