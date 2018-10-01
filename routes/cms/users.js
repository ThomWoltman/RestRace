var express = require('express');
var router = express();

router.get('/', (req, res, next) => {
    res.render('users', {});
});

// Export
module.exports = function (){
	return router;
};