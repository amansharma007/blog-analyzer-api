module.exports = function (app) {
    var botController = require('../controllers/botController');

    app.route('/get-blog-list')
        .get(botController.getBlogList)
};
