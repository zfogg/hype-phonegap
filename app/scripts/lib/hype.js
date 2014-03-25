'use strict';

(function(exports) {
    exports.HypeSesh = function(options) {
        if (!(this instanceof HypeSesh)) return new HypeSesh();
        this.acceleration     = {x: 0, y: 0, z: 0};
        this.prevAcceleration = {x: 0, y: 0, z: 0};
        this.hype             = 0;
        this.started          = null;
        this.runningAvg       = new Mean();
        this.runningAvg.push(0);

        if (!options.scope)     options.scope     = {'$apply': function(){}};
        if (!options.frequency) options.frequency = 200;
        this.options = options;
    }

    exports.HypeSesh.prototype.start = function() {
        var that = this;
        this.started = navigator.accelerometer.watchAcceleration(
            function(acceleration) {
            var hype =
                10*Math.abs(acceleration.x - that.prevAcceleration.x) +
                10*Math.abs(acceleration.y - that.prevAcceleration.y) +
                10*Math.abs(acceleration.z - that.prevAcceleration.z);

            that.options.scope.$apply(function() {
                that.runningAvg.push(hype);

                that.hype           = hype;
                that.acceleration.x = acceleration.x;
                that.acceleration.y = acceleration.y;
                that.acceleration.z = acceleration.z;

                that.prevAcceleration = acceleration;
            });
        },
        function() { console.log('HypeSesh: accelerometer error :('); },
        { frequency: this.options.frequency });
        return true;
    };

    exports.HypeSesh.prototype.stop = function() {
        navigator.accelerometer.clearWatch(this.started);
        this.started = null;
        return true;
    }


    exports.Mean = function() {
        if (!(this instanceof Mean)) return new Mean();
        this.length = 0;
        this.mean = undefined;
    }

    exports.Mean.prototype.push = function (x) {
        var i = ++ this.length;
        var m = this.mean || 0;
        this.mean = m - m / i + x / i;
        return this.mean;
    };
})(typeof module !== 'undefined' ? module.exports : window);
