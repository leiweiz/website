/**
 * Created by lei on 5/24/16.
 */

app.service('SampleService', function() {

    this.Sample = Sample;

    function Sample(xAxis) {
        this.xAxis = xAxis;
        this.yAxis = 0;
        this.probRange = 0;
        this.curStateIndex = -1;
        this.state = 0;
    }

    Sample.prototype.updateState = function() {
        // length - 1
        if(this.curStateIndex < Sample.states.length -1) {
            this.curStateIndex++;
            this.state = Sample.states[this.curStateIndex];
        }
    };

    Sample.prototype.getProbabilityRange = function() {
        return String(this.probRange).substr(0, 4);
    };

    Sample.states = [0.2, 0.3, 0.4, 0.5];
});