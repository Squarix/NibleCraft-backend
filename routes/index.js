let express = require('express');
let router = express.Router();
let userController = require('../controllers/index');
/* GET home page. */
router.get('/', function(req, res, next) {
  userController.processUser(req, res);
});

module.exports = router;
