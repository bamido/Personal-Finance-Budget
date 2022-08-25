
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {isUserAuthenticated} = require('../config/custumFunctions');

router.all('/*', isUserAuthenticated, function (req, res, next) {
//router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'admin'; // set layout
    next(); // pass control to the next handler
    });


router.get('/threads', postController.getThreads);
router.get('/threads/create', postController.createThread);
router.post('/threads/create', postController.saveThread);
router.get('/threads/edit/:threadid', postController.editThread);
router.put('/threads/edit/:threadid', postController.updateThread);
router.delete('/threads/delete/:threadid', postController.deleteThread);

router.get('/threadposts/:threadid', postController.getThreadPosts);
router.get('/threads/createpost/:threadid', postController.createPost);
router.post('/threads/createpost/:threadid', postController.savePost);
router.get('/threads/editpost/:postid', postController.editPost);
router.put('/threads/editpost/:postid', postController.updatePost);
router.get('/posts', postController.getAllPosts);
/*
router.get('/sectiondocs/:sectionid', pageController.getSectionDocs);
router.post('/sectiondoc/create/:sectionid', pageController.saveSectionDoc);
router.get('/ajaxsectiondocs/:sectionid', pageController.getAjaxSectionDocs);
router.delete('/sectiondoc/delete', pageController.deleteSectionDoc);


*/

module.exports = router;