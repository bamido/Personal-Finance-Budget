const Thread = require("../models/threADModel.js");
const Post = require("../models/postModel.js");
const Section = require("../models/sectionModel.js");
const Sectiondoc = require("../models/sectiondocModel.js");
var slug = require('slug');
const { registerGet } = require("./defaultController.js");
const theoptions = {pending:'Pending',publish:'Publish', deleted:'Deleted'};
const docoptions = {image:'Image',video:'Video', audio:'Audio', pdf:'PDF'};
const modulename = "Article CMS";
const {isEmpty} = require("../config/custumFunctions.js");
// Array of allowed files
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif', 'pdf'];
const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
const sharp = require("sharp");
const fs = require('fs');

module.exports = {
    getThreads: (req, res)=>{
        Thread.getThreads((err,data)=>{
            res.render('cms/listthreads', {pagetitle: 'Threads', threads:data});
        });
        
    },
    createThread:(req, res)=>{
        Thread.getThreads((err,data)=>{

            res.render('cms/addthread', {pagetitle: 'Add Thread', threads:data, layout:''})

        });
        
    },
    saveThread:(req, res)=>{
        // Validate request

        let errors = [];
        if (!req.body.threadname) {
            errors.push("Thread name cannot be empty!");
            
        }


        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // Create a thread
        const thread = new Thread({
            threadname: req.body.threadname,
            threadslug: slug(req.body.threadname),
            user_id: req.user.user_id,
            threadstatus:'publish',
        });

        // Save thread in the database
        Thread.create(thread, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while creating the thread."
            });

            return;
            
            }else{
                req.flash('success-message', 'Thread created successfully');
                res.send(data); //res.redirect('/pages'); //res.send(data);
            }
            
        });

    },
    editThread:(req, res)=>{
        const threadid = req.params.threadid;
        Thread.getThread(threadid, (err, data)=>{
            Thread.getThreads((err,threadsdata)=>{
                res.render('cms/editthread', {thread:data, pagetitle: 'Edit Thread', theoptions:theoptions, pages:threadsdata, layout:''})
            });
        });
        
    },
    updateThread:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.threadname) {
            errors.push("Thread name cannot be empty!");
            
        }

        if (!req.body.threadstatus) {
            errors.push("Thread status cannot be empty!");
            
        }
        

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

       // Create a thread
        const thread = new Thread({
            threadname: req.body.threadname,
            threadslug: slug(req.body.threadname),
            user_id: req.user.user_id,
            threadstatus:req.body.threadstatus,
            thread_id: req.body.threadid,
        });

        // update thread in the database
        Thread.update(thread, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating the thread."
            });

            return;
            
            }else{
                req.flash('success-message', 'Thread updated successfully');
                res.status(200).send({
                    message: "Thread updated successfully"
                });
            }
            
        });

    },
    deleteThread:(req, res)=>{
        const threadid = req.params.threadid;
        Thread.deleteThread(threadid, (err, data)=>{
            req.flash('success-message', 'Thread has been deleted');
            res.send(data); //res.redirect('/pages'); //res.send(data);
        });
        
    },
    getThreadPosts: (req, res)=>{
        const threadid = req.params.threadid;
        Thread.getThread(threadid, (err, threaddata)=>{
            Post.getThreadPosts(threadid,(err,data)=>{
                res.render('cms/listthreadposts', {modulename:modulename, pagetitle: `${threaddata.threadname} Thread Posts`, thread:threaddata, posts:data});
            });
        });
        
    },
    createPost:(req, res)=>{
        const threadid = req.params.threadid;
        Thread.getThread(threadid, (err, threaddata)=>{
            Thread.getThreads((err,data)=>{

                res.render('cms/addpost', {pagetitle: 'Add Post', threads:data, thread:threaddata, theoptions:theoptions, layout:''})

            });
        });
        
    },
    savePost:(req, res)=>{
        const threadid = req.params.threadid;
        // Validate request

        let errors = [];
        if (!req.body.threadid) {
            errors.push("Thread field cannot be empty!");
            
        }

        if (!req.body.posttitle) {
            errors.push("Post title cannot be empty!");
            
        }

        if (!req.body.postbody) {
            errors.push("Post body cannot be empty!");
            
        }

        if (!req.body.poststatus) {
            errors.push("Post status cannot be empty!");
            
        }
        
        if (!req.body.sortorder) {
            errors.push("Sort order cannot be empty!");
            
        }

        // validate image upload 
        if(req.files && Object.keys(req.files).length !== 0){

            if (req.files.postimage.size > 2097152) {
                errors.push("Image must be less than 2mb!");
                
            }

            
            // Get the extension of the uploaded file
            var file_extension = req.files.postimage.name.slice(
                ((req.files.postimage.name.lastIndexOf('.') - 1) >>> 0) + 2
            );

            // Check if the uploaded file is allowed
            if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(req.files.postimage.mimetype)) {
                errors.push("File not allowed. Upload gif, jpg, png or jpeg image only!");
            }
        }


        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // process image upload
        let filename = "";
        console.log(req.files);
        
        if(req.files && Object.keys(req.files).length !== 0){

            let uploadDir = './public/uploads/';
            let file = req.files.postimage;
            //filename = file.name;
            filename = Math.random() * file.name.length + "" + Date.now() + "." + file_extension;

            // resize image
            sharp(file.data).resize(600).toFile(uploadDir + 'thumb_' + filename)
            .then(info => { console.log(info); })
            .catch(err => { console.log(err); });

            file.mv(uploadDir + filename, (err)=>{
                if(err){
                    throw err;
                }

                

            });

        }

        

        // Create a post
        const post = new Post({
            thread_id: req.body.threadid,
            posttitle: req.body.posttitle,
            postslug: slug(req.body.posttitle),
            postbody: req.body.postbody,
            metakeyword: req.body.metakeyword,
            metadescription: req.body.metadescription,
            postimageurl: filename,
            postvideourl: req.body.postvideourl,
            poststatus: req.body.poststatus,
            posttype: '0',
            user_id: req.user.user_id,
            sortorder: req.body.sortorder,
        });

        // Save post in the database
        Post.create(post, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while creating the Post."
            });

            return;
            
            }else{
                
                
                req.flash('success-message', 'Post created successfully');
                res.send(data); //res.redirect('/pages'); //res.send(data);
            }
            
        });

    },
    editPost:(req, res)=>{
        const postid = req.params.postid;
        Post.getPost(postid, (err, data)=>{
            Thread.getThreads((err,threadsdata)=>{
                res.render('cms/editpost', {post:data, pagetitle: 'Edit Post', theoptions:theoptions, threads:threadsdata, layout:''})
            });
        });
        
    },
    updatePost:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.threadid) {
            errors.push("Thread field cannot be empty!");
            
        }

        if (!req.body.posttitle) {
            errors.push("Post title cannot be empty!");
            
        }

        if (!req.body.postbody) {
            errors.push("Post body cannot be empty!");
            
        }

        if (!req.body.poststatus) {
            errors.push("Post status cannot be empty!");
            
        }
        
        if (!req.body.sortorder) {
            errors.push("Sort order cannot be empty!");
            
        }


         // validate image upload 
         if(req.files && Object.keys(req.files).length !== 0){

            if (req.files.postimage.size > 2097152) {
                errors.push("Image must be less than 2mb!");
                
            }

            
            // Get the extension of the uploaded file
            var file_extension = req.files.postimage.name.slice(
                ((req.files.postimage.name.lastIndexOf('.') - 1) >>> 0) + 2
            );

            // Check if the uploaded file is allowed
            if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(req.files.postimage.mimetype)) {
                errors.push("File not allowed. Upload gif, jpg, png or jpeg image only!");
            }
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // process image upload
        let filename = "";
        console.log(req.files);
        
        if(req.files && Object.keys(req.files).length !== 0){

            let uploadDir = './public/uploads/';
            let file = req.files.postimage;
            //filename = file.name;
            filename = Math.random() * file.name.length + "" + Date.now() + "." + file_extension;

            // resize image
            sharp(file.data).resize(600).toFile(uploadDir + 'thumb_' + filename)
            .then(info => { console.log(info); })
            .catch(err => { console.log(err); });

            file.mv(uploadDir + filename, (err)=>{
                if(err){
                    throw err;
                }                

            });

            // unlink file
            let filetodelete = './public/uploads/'+ req.body.oldimageurl;
            if(req.body.oldimageurl !== ''){
                fs.unlink(filetodelete, (err) => {
                    if (err) {
                        throw err;
                    }
                
                    console.log("File is deleted.");
                });
            }

        }else{
            filename = req.body.oldimageurl;
        }

        // Create a post
        const post = new Post({
            thread_id: req.body.threadid,
            posttitle: req.body.posttitle,
            postslug: slug(req.body.posttitle),
            postbody: req.body.postbody,
            metakeyword: req.body.metakeyword,
            metadescription: req.body.metadescription,
            postimageurl: filename,
            postvideourl: req.body.postvideourl,
            poststatus: req.body.poststatus,
            sortorder: req.body.sortorder,
            post_id: req.body.postid
        });

        // update post in the database
        Post.update(post, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while updating the post."
            });

            return;
            
            }else{
                req.flash('success-message', 'post updated successfully');
                //res.redirect('/pages'); //res.send(data);
                res.status(200).send({
                    message: "Post updated successfully"
                });
            }
            
        });

    },
    getAllPosts: (req, res)=>{
        
        Post.getAllPosts((err,data)=>{
            res.render('cms/listallposts', {modulename:modulename, pagetitle: 'All Posts', posts:data});
        });
       
        
    }   

    
}