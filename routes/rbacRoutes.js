
const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbacController');
const {isUserAuthenticated} = require('../config/custumFunctions');

router.all('/*', isUserAuthenticated, function (req, res, next) {
    req.app.locals.layout = 'admin'; // set layout
    next(); // pass control to the next handler
    });

router.route('/modules')
    .get(rbacController.getModules);

router.route('/modules/create')
    .get(rbacController.createModule)
    .post(rbacController.saveModule);

router.route('/modules/edit/:moduleid')
    .get(rbacController.editModule)
    .put(rbacController.updateModule);

router.route('/modules/delete/:moduleid')
    .delete(rbacController.deleteModule);

// tasks route
router.route('/tasks')
    .get(rbacController.getTasks);

router.route('/tasks/create')
    .get(rbacController.createTask)
    .post(rbacController.saveTask);

router.route('/tasks/edit/:taskid')
    .get(rbacController.editTask)
    .put(rbacController.updateTask);

router.route('/tasks/delete/:taskid')
    .delete(rbacController.deleteTask);

// privileges routes
router.route('/privileges/assign/:roleid')
    .get(rbacController.assignPriv)
    .post(rbacController.savePrivileges);


module.exports = router;