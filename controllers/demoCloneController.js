/**
 * Created by lei on 5/22/16.
 */

module.exports = function(app) {
    app.get('/demo-clone', function(req, res) {
        res.render('demo-clone');
    });
};