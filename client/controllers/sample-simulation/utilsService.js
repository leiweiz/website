/**
 * Created by lei on 5/24/16.
 */

app.service('UtilsService', function() {

    this.generateZero2OneInclude = generateZero2OneInclude;
    this.generateZero2One = generateZero2One;
    this.generateSelectedSamples = generateSelectedSamples;
    this.printProbRanges = printProbRanges;

    function generateZero2OneInclude() {
        return 1 - Math.random(); // (0,1]
    }

    function generateZero2One() {
        while(true) {
            var result = Math.random();
            if (result != 0) {
                return result;
            }
        }

    }

    function generateSelectedSamples(total, selected) {
        var result = [];
        var unique = {};
        // http://www.w3schools.com/jsref/jsref_random.asp
        while( result.length < selected) {
            var value = Math.floor(Math.random() * total);
            if (unique.hasOwnProperty(value)) {
                continue;
            }
            unique[value] = true;
            result.push(value);
        }
        return result.sort();
    }

    function printProbRanges(samples) {
        var result = [];
        for (var i = 0; i < samples.length; i++) {
            result.push(samples[i].probRange);
        }
        console.log("Prob Ranges: " + result);
    }
});