
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/custumFunctions');

router.all('/*', isUserAuthenticated, function (req, res, next) {
    req.app.locals.layout = 'admin'; // set layout
    next(); // pass control to the next handler
    });

router.route('/portal/home')
    .get(adminController.index);

router.route('/roles')
    .get(adminController.getRoles);

router.route('/roles/create')
    .get(adminController.createRole)
    .post(adminController.saveRole);

router.route('/roles/edit/:roleid')
    .get(adminController.editRole)
    .put(adminController.updateRole);

router.route('/roles/delete/:roleid')
    .delete(adminController.deleteRole);


module.exports = router;