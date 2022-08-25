const Role = require("../models/roleModel.js");

module.exports = {
    index: (req, res)=>{
        res.render('admin/index', {pagetitle: 'Dashboard'});
    },
    getRoles: (req, res)=>{
        Role.getRoles((err,data)=>{
            res.render('admin/roles', {pagetitle: 'Roles', roles:data});
        });
        
    },
    createRole:(req, res)=>{
        res.render('admin/addrole', {pagetitle: 'Add Role', layout:''})
    },
    saveRole:(req, res)=>{
        // Validate request
        if (!req.body.rolename) {
            res.status(400).send({
            message: "Rolename can not be empty!"
            });
            return;
        }


        // console.log(req.body.rolename);
        // return;
        // Create a role
        const role = new Role({
            role_name: req.body.rolename,
        });

        // Save Role in the database
        Role.create(role, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Role."
            });

            return;
            
            }else{
                req.flash('success-message', 'Role created successfully');
                res.redirect('/roles'); //res.send(data);
            }
            
        });


        //res.render('admin/addrole', {pagetitle: 'Add Role'})
    },
    editRole:(req, res)=>{
        const roleid = req.params.roleid;
        Role.getRole(roleid, (err, data)=>{
            res.render('admin/editrole', {role:data, pagetitle: 'Edit Role', layout:''})
        });
        
    },
    updateRole:(req, res)=>{
        // Validate request
        if (!req.body.rolename) {
            res.status(400).send({
            message: "Rolename can not be empty!"
            });
            return;
        }


        // console.log(req.body.rolename);
        // return;
        // Create a role
        const role = new Role({
            role_name: req.body.rolename,
            role_id: req.body.roleid,
        });

        // update Role in the database
        Role.update(role, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating the Role."
            });

            return;
            
            }else{
                req.flash('success-message', 'Role updated successfully');
                res.redirect('/roles'); //res.send(data);
            }
            
        });


        //res.render('admin/addrole', {pagetitle: 'Add Role'})
    },
    deleteRole:(req, res)=>{
        const roleid = req.params.roleid;
        Role.deleteRole(roleid, (err, data)=>{
            req.flash('success-message', 'Role has been deleted');
            res.redirect('/roles'); //res.send(data);
        });
        
    }
}