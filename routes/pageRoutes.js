
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const {isUserAuthenticated} = require('../config/custumFunctions');

router.all('/*', isUserAuthenticated, function (req, res, next) {
//router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set layout
    next(); // pass control to the next handler
    });


router.get('/pages', pageController.getPages);
router.get('/pages/create', pageController.createPage);
router.post('/pages/create', pageController.savePage);
router.get('/pages/edit/:pageid', pageController.editPage);
router.put('/pages/edit/:pageid', pageController.updatePage);
router.delete('/pages/delete/:pageid', pageController.deletePage);

router.get('/pagesections/:pageid', pageController.getPageSections);
router.get('/pages/createsection/:pageid', pageController.createSection);
router.post('/pages/createsection/:pageid', pageController.saveSection);
router.get('/pages/editsection/:sectionid', pageController.editSection);
router.put('/pages/editsection/:sectionid', pageController.updateSection);

router.get('/sectiondocs/:sectionid', pageController.getSectionDocs);
router.post('/sectiondoc/create/:sectionid', pageController.saveSectionDoc);
router.get('/ajaxsectiondocs/:sectionid', pageController.getAjaxSectionDocs);
router.delete('/sectiondoc/delete', pageController.deleteSectionDoc);

router.get('/sections', pageController.getAllSections);


module.exports = router;