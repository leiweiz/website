/**
 * Created by lei on 5/24/16.
 */

app.service('SettingService', function() {
    this.totalSamples = 30;
    this.proportion = 0.6;
    this.selectedSamples = this.totalSamples * this.proportion;
    this.totalSteps = 10;
});