var UserAPI = require('../controllers/UserAPI.js');

module.exports = function(app) {
    app.post("/user/login", function(request, response) {
        UserAPI.login(request, request.body.username, request.body.password, function(error, userProfile) {
            response.json({
                error: error,
                user:  userProfile
            })
        });
    });
    app.get("/user/logout", function(request, response) {
        UserAPI.logout(request, function() {
            response.json({
                user:  null
            })
        });
    });
    app.get("/user/current", function(request, response) {
        UserAPI.getCurrentUser(request, function(error, userProfile) {
            response.json({
                error: error,
                user:  userProfile
            })
        });
    });
    app.post("/user/register", function(request, response) {
        UserAPI.register(request.body.user, function(error, userProfile) {
            response.json({
                error: error,
                user:  userProfile
            })
        });
    });
}