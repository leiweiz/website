/**
 * Created by lei on 5/24/16.
 */

app.service('SimulationService', function() {
    this.SimulationFactory = MainSimulation;

    function MainSimulation(plot, canvas, timeCanvas, utils, settings, SampleConstructor) {
        this.samples = [];
        this.selectedSamples = [];
        this.probLen = 0;
        this.curProbRange = 0;

        this.timeCount = 0;
        this.timeX = [0];
        this.timeY = [0];

        this.plot = plot;
        this.canvas = canvas;
        this.timeCanvas = timeCanvas;
        this.utils = utils;
        this.settings = settings;
        this.SampleConstructor = SampleConstructor;

        this.probability = 0;
        this.updatedSampleIndex = -1;
        this.updatedTime = 0;

        for(var i = 0; i < settings.totalSamples; i++) {
            this.samples.push(new this.SampleConstructor(i));
        }

        this.selectedIndices = utils.generateSelectedSamples(settings.totalSamples, settings.selectedSamples)
        console.log("Selected indices:" + this.selectedIndices);

        for(var i = 0; i < this.selectedIndices.length; i++) {
            var sample = this.samples[this.selectedIndices[i]];
            sample.updateState();
            this.probLen += sample.state;
            this.selectedSamples.push(sample);
        }

        this.updateAllProbRange();
    }

    MainSimulation.prototype.updateAllProbRange = function() {
        for(var i = 0; i < this.selectedSamples.length; i++) {
            var sample = this.selectedSamples[i];
            this.curProbRange += sample.state;
            sample.probRange = this.curProbRange / this.probLen;
        }
        // reset
        this.curProbRange = 0;

        this.utils.printProbRanges(this.selectedSamples);
    };

    MainSimulation.prototype.update = function(probability) {
        for(var i = 0; i < this.selectedSamples.length; i++) {
            var sample = this.selectedSamples[i];
            if( probability <= sample.probRange) {
                console.log('Generated probability: ' + probability + ' index: ' + this.selectedIndices[i]);
                this.updatedSampleIndex = this.selectedIndices[i];
                this.probLen -= sample.state; // remove cur state
                sample.yAxis++;
                sample.updateState();
                this.probLen += sample.state; // add new state
                // udpate selected samples probRange
                this.updateAllProbRange();
                break;
            }
        }
    };

    MainSimulation.prototype.simulate = function() {
        this.probability = this.utils.generateZero2OneInclude();
        this.update(this.probability);

        this.timeX.push(++this.timeCount);

        // update time
        this.updatedTime = this.utils.generateZero2One();
        var prevTotalTime = this.timeY[this.timeY.length-1];
        this.timeY.push(prevTotalTime + this.updatedTime);

        this.draw();
    };

    MainSimulation.prototype.draw = function() {
        this.drawSim();
        this.drawTime();
    };

    MainSimulation.prototype.drawSim = function() {
        var x = [];
        var y = [];
        for (var i = 0; i < this.samples.length; i++) {
            var sample = this.samples[i];
            x.push(sample.xAxis);
            y.push(sample.yAxis);
        }
        var trace1 = {
            x: x,
            y: y,
            type: 'scatter',
            name: 'count line'
        };

        var trace2 = {
            x: x,
            y: y,
            type: 'bar',
            name: 'single sample'
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'Sample chart',
            xaxis: {
                title: 'Samples'
            },
            yaxis: {
                title: 'Growth'
            }
        };

        this.plot.newPlot(this.canvas, data, layout);
    };

    MainSimulation.prototype.drawTime = function() {
        var timeLine = {
            x: this.timeX,
            y: this.timeY,
            type: 'scatter',
            name: 'time'
        };

        var data = [timeLine];

        var layout = {
            title: 'Time line',
            xaxis: {
                title: 'Steps'
            },
            yaxis: {
                title: 'Time'
            }
        };

        this.plot.newPlot(this.timeCanvas, data, layout);
    };

});