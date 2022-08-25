const Page = require("../models/pageModel.js");
const Section = require("../models/sectionModel.js");
const Sectiondoc = require("../models/sectiondocModel.js");
var slug = require('slug');
const { registerGet } = require("./defaultController.js");
const theoptions = {pending:'Pending',publish:'Publish', deleted:'Deleted'};
const docoptions = {image:'Image',video:'Video', audio:'Audio', pdf:'PDF'};
const modulename = "Webste CMS";
const {isEmpty} = require("../config/custumFunctions.js");
// Array of allowed files
const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif', 'pdf'];
const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf'];
const sharp = require("sharp");

module.exports = {
    getPages: (req, res)=>{
        Page.getPages((err,data)=>{
            res.render('cms/listpages', {pagetitle: 'Pages', pages:data});
        });
        
    },
    createPage:(req, res)=>{
        Page.getPages((err,data)=>{

            res.render('cms/addpage', {pagetitle: 'Add Page', pages:data, layout:''})

        });
        
    },
    savePage:(req, res)=>{
        // Validate request

        let errors = [];
        if (!req.body.pagetitle) {
            errors.push("Page title cannot be empty!");
            
        }


        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // Create a page
        const page = new Page({
            pagetitle: req.body.pagetitle,
            pageslug: slug(req.body.pagetitle),
            metakeyword: req.body.keyword,
            metadesc: req.body.description,
            user_id: req.user.user_id,
            parent_id: req.body.parentid,
            pagestatus:'publish',
            sortorder: 1,
        });

        // Save Page in the database
        Page.create(page, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while creating the Page."
            });

            return;
            
            }else{
                req.flash('success-message', 'Page created successfully');
                res.send(data); //res.redirect('/pages'); //res.send(data);
            }
            
        });

    },
    editPage:(req, res)=>{
        const pageid = req.params.pageid;
        Page.getPage(pageid, (err, data)=>{
            Page.getPages((err,pagesdata)=>{
                res.render('cms/editpage', {page:data, pagetitle: 'Edit Page', theoptions:theoptions, pages:pagesdata, layout:''})
            });
        });
        
    },
    updatePage:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.pagetitle) {
            errors.push("Page title cannot be empty!");
            
        }

        if (!req.body.pagestatus) {
            errors.push("Page status cannot be empty!");
            
        }
        
        if (!req.body.sortorder) {
            errors.push("Sort order cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

       // Create a page
        const page = new Page({
            pagetitle: req.body.pagetitle,
            pageslug: slug(req.body.pagetitle),
            metakeyword: req.body.keyword,
            metadesc: req.body.description,
            user_id: req.user.user_id,
            parent_id: req.body.parentid,
            pagestatus:req.body.pagestatus,
            sortorder: req.body.sortorder,
            page_id: req.body.pageid,
        });

        // update page in the database
        Page.update(page, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating the Page."
            });

            return;
            
            }else{
                req.flash('success-message', 'Page updated successfully');
                //res.redirect('/pages'); //res.send(data);
                res.status(200).send({
                    message: "Page updated successfully"
                });
            }
            
        });

    },
    deletePage:(req, res)=>{
        const pageid = req.params.pageid;
        Page.deletePage(pageid, (err, data)=>{
            req.flash('success-message', 'Page has been deleted');
            res.send(data); //res.redirect('/pages'); //res.send(data);
        });
        
    },
    getPageSections: (req, res)=>{
        const pageid = req.params.pageid;
        Page.getPage(pageid, (err, pagedata)=>{
            Section.getPageSections(pageid,(err,data)=>{
                res.render('cms/listpagesections', {modulename:modulename, pagetitle: `${pagedata.pagetitle} Page Sections`, page:pagedata, sections:data});
            });
        });
        
    },
    createSection:(req, res)=>{
        const pageid = req.params.pageid;
        Page.getPage(pageid, (err, pagedata)=>{
            Page.getPages((err,data)=>{

                res.render('cms/addsection', {pagetitle: 'Add Section', pages:data, page:pagedata, theoptions:theoptions, layout:''})

            });
        });
        
    },
    saveSection:(req, res)=>{
        const pageid = req.params.pageid;
        // Validate request

        let errors = [];
        if (!req.body.pageid) {
            errors.push("Page field cannot be empty!");
            
        }

        if (!req.body.sectiontitle) {
            errors.push("Section title cannot be empty!");
            
        }

        if (!req.body.sectionbody) {
            errors.push("Section body cannot be empty!");
            
        }

        if (!req.body.sectionstatus) {
            errors.push("Section status cannot be empty!");
            
        }
        
        if (!req.body.sortorder) {
            errors.push("Sort order cannot be empty!");
            
        }

        // validate image upload 
        if(Object.keys(req.files).length !== 0){

            if (req.files.sectionimage.size > 2097152) {
                errors.push("Image must be less than 2mb!");
                
            }

            
            // Get the extension of the uploaded file
            const file_extension = req.files.sectionimage.name.slice(
                ((req.files.sectionimage.name.lastIndexOf('.') - 1) >>> 0) + 2
            );

            // Check if the uploaded file is allowed
            if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(req.files.sectionimage.mimetype)) {
                errors.push("File not allowed. Upload gif, jpg, png or jpeg image only!");
            }
        }


        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        

        // Create a section
        const section = new Section({
            page_id: req.body.pageid,
            sectiontitle: req.body.sectiontitle,
            sectionslug: slug(req.body.sectiontitle),
            sectionbody: req.body.sectionbody,
            extlink: req.body.extlink,
            sectionstatus: req.body.sectionstatus,
            user_id: req.user.user_id,
            parent_id: 0,
            sortorder: req.body.sortorder,
        });

        // Save section in the database
        Section.create(section, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while creating the Section."
            });

            return;
            
            }else{
                // process image upload
                let filename = "";
                console.log(req.files);
                
                if(Object.keys(req.files).length !== 0){

                    let uploadDir = './public/uploads/';
                    let file = req.files.sectionimage;
                    filename = file.name;

                    // resize image
                    sharp(file.data).resize(600).toFile(uploadDir + 'thumb_' + filename)
                    .then(info => { console.log(info); })
                    .catch(err => { console.log(err); });

                    file.mv(uploadDir + filename, (err)=>{
                        if(err){
                            throw err;
                        }

                        // insert into sectiondocs table
                        // Create a section
                        const sectiondoc = new Sectiondoc({
                            section_id: data.sectionid,
                            docurl: filename,
                            doctype: 'image'
                        });

                        Sectiondoc.create(sectiondoc, (err, data) => {
                            if (err){
                                res.status(500).send({
                                    errors:
                                    err.message || "Some error occurred while creating the Sectiondoc."
                                });
                                return;
                            }
                        });

                    });

                }
                
                req.flash('success-message', 'Section created successfully');
                res.send(data); //res.redirect('/pages'); //res.send(data);
            }
            
        });

    },
    editSection:(req, res)=>{
        const sectionid = req.params.sectionid;
        Section.getSection(sectionid, (err, data)=>{
            Page.getPages((err,pagesdata)=>{
                res.render('cms/editsection', {section:data, pagetitle: 'Edit Section', theoptions:theoptions, pages:pagesdata, layout:''})
            });
        });
        
    },
    updateSection:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.pageid) {
            errors.push("Page field cannot be empty!");
            
        }

        if (!req.body.sectiontitle) {
            errors.push("Section title cannot be empty!");
            
        }

        if (!req.body.sectionbody) {
            errors.push("Section body cannot be empty!");
            
        }

        if (!req.body.sectionstatus) {
            errors.push("Section status cannot be empty!");
            
        }
        
        if (!req.body.sortorder) {
            errors.push("Sort order cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // Create a section
        const section = new Section({
            page_id: req.body.pageid,
            sectiontitle: req.body.sectiontitle,
            sectionslug: slug(req.body.sectiontitle),
            sectionbody: req.body.sectionbody,
            extlink: req.body.extlink,
            sectionstatus: req.body.sectionstatus,
            user_id: req.user.user_id,
            parent_id: 0,
            sortorder: req.body.sortorder,
            section_id: req.body.sectionid
        });

        // update section in the database
        Section.update(section, (err, data) => {
            if (err){
            res.status(500).send({
                errors:
                err.message || "Some error occurred while updating the section."
            });

            return;
            
            }else{
                req.flash('success-message', 'section updated successfully');
                //res.redirect('/pages'); //res.send(data);
                res.status(200).send({
                    message: "Section updated successfully"
                });
            }
            
        });

    },
    getSectionDocs: (req, res)=>{
        const sectionid = req.params.sectionid;
        Section.getSection(sectionid, (err, sectiondata)=>{
            Sectiondoc.getSectiondocs(sectionid,(err,data)=>{
                res.render('cms/listsectiondocs', {modulename:modulename, pagetitle: 'Section Docs', section:sectiondata, sectiondocs:data, docoptions:docoptions, layout:''});
            });
        });
        
    },
    saveSectionDoc:(req, res)=>{
        const sectionid = req.params.sectionid;
        // Validate request

        let errors = [];
        if (!req.body.doctype) {
            errors.push("Doc Type field cannot be empty!");
            
        }

        //console.log(req.body.doctype);

        if(req.body.doctype !=='image' && req.body.doctype !=='pdf' ){
            if (!req.body.docurl) {
                errors.push("Doc URL cannot be empty!");
                
            }

        }else{


            // validate image upload 
            if(Object.keys(req.files).length !== 0){

                if (req.files.docurl.size > 2097152) {
                    errors.push("Image must be less than 2mb!");
                    
                }

                
                // Get the extension of the uploaded file
                const file_extension = req.files.docurl.name.slice(
                    ((req.files.docurl.name.lastIndexOf('.') - 1) >>> 0) + 2
                );

                // Check if the uploaded file is allowed
                if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(req.files.docurl.mimetype)) {
                    errors.push("File not allowed. Upload gif, jpg, png or jpeg image only!");
                }
            }

        }


        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

            if(req.body.doctype ==='image' || req.body.doctype ==='pdf'){
                // process image upload
                let filename = "";
                console.log(req.files);
                
                if(Object.keys(req.files).length !== 0){

                    let uploadDir = './public/uploads/';
                    let file = req.files.docurl;
                    filename =  file.name;
                    
                    // resize image
                    sharp(file.data).resize(600).toFile(uploadDir + 'thumb_' + filename)
                    .then(info => { console.log(info); })
                    .catch(err => { console.log(err); });

                    file.mv(uploadDir + filename, (err)=>{
                        if(err){
                            throw err;
                        }

                        // insert into sectiondocs table
                        // Create a section
                        const sectiondoc = new Sectiondoc({
                            section_id: sectionid,
                            docurl: filename,
                            doctype: req.body.doctype
                        });

                        Sectiondoc.create(sectiondoc, (err, data) => {
                            if (err){
                                res.status(500).send({
                                    errors:
                                    err.message || "Some error occurred while creating the Sectiondoc."
                                });
                                return;
                            }
                        });

                    });

                }

               

            }else{
                 // Create a section
                 const sectiondoc = new Sectiondoc({
                    section_id: sectionid,
                    docurl: req.body.docurl,
                    doctype: req.body.doctype
                });

                Sectiondoc.create(sectiondoc, (err, data) => {
                    if (err){
                        res.status(500).send({
                            errors:
                            err.message || "Some error occurred while creating the Sectiondoc."
                        });
                        return;
                    }
                });
            }


            req.flash('success-message', 'Section created successfully');
            //res.send(data); //res.redirect('/pages'); //res.send(data);
            res.redirect('/ajaxsectiondocs/' + sectionid);
                
                

    },
    getAjaxSectionDocs: (req, res)=>{
        const sectionid = req.params.sectionid;       
        Sectiondoc.getSectiondocs(sectionid,(err,data)=>{
            res.render('cms/listajaxsectiondocs', {modulename:modulename, pagetitle: 'Section Docs', sectiondocs:data, layout:''});
        });
       
    },
    deleteSectionDoc:(req, res)=>{
        const sectionid = req.body.sectionid;
        const sectiondocid = req.body.delId;
        console.log(sectionid);
        Sectiondoc.delete(sectiondocid, req.body.swalimage, (err, data)=>{
            req.flash('success-message', 'Section doc has been deleted');
            Sectiondoc.getSectiondocs(sectionid,(err,data)=>{
                res.render('cms/listajaxsectiondocs', {modulename:modulename, pagetitle: 'Section Docs', sectiondocs:data, layout:''});
            }); 
        });
        
    },
    getAllSections: (req, res)=>{
        
        Section.getAllSections((err,data)=>{
            res.render('cms/listallsections', {modulename:modulename, pagetitle: 'All Sections', sections:data});
        });
       
        
    }   

    
}