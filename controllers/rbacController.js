const Role = require("../models/roleModel.js");
const Module = require("../models/moduleModel.js");
const TheTask = require("../models/taskModel.js");
const Privilege = require("../models/privilegeModel.js");
const theoptions = {false:'No',true:'Yes'};
var globals = {};

module.exports = {
    getModules: (req, res)=>{
        Module.getModules((err,data)=>{
            res.render('rbac/modules', {pagetitle: 'Modules', modules:data});
        });
        
    },
    createModule:(req, res)=>{
        res.render('rbac/addmodule', {pagetitle: 'Add Module', layout:''})
    },
    saveModule:(req, res)=>{
        // Validate request

        let errors = [];
        if (!req.body.moduletitle) {
            errors.push("Module title cannot be empty!");
            
        }

        if (!req.body.moduleicon) {
            errors.push("Module icon cannot be empty!");
            
        }
        
        if (!req.body.moduleorder) {
            errors.push("Module order cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // console.log(req.body.moduletitle);
        // return;
        // Create a module
        const module = new Module({
            module_title: req.body.moduletitle,
            module_icon: req.body.moduleicon,
            module_order: req.body.moduleorder,
        });

        // Save Module in the database
        Module.create(module, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Module."
            });

            return;
            
            }else{
                req.flash('success-message', 'Module created successfully');
                res.redirect('/modules'); //res.send(data);
            }
            
        });

    },
    editModule:(req, res)=>{
        const moduleid = req.params.moduleid;
        Module.getModule(moduleid, (err, data)=>{
            res.render('rbac/editmodule', {module:data, pagetitle: 'Edit Module', layout:''})
        });
        
    },
    updateModule:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.moduletitle) {
            errors.push("Module title cannot be empty!");
            
        }

        if (!req.body.moduleicon) {
            errors.push("Module icon cannot be empty!");
            
        }
        
        if (!req.body.moduleorder) {
            errors.push("Module order cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // console.log(req.body.moduletitle);
        // return;
        // Create a module
        const module = new Module({
            module_title: req.body.moduletitle,
            module_icon: req.body.moduleicon,
            module_order: req.body.moduleorder,
            module_id: req.body.moduleid,
        });

        // update module in the database
        Module.update(module, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating the Module."
            });

            return;
            
            }else{
                req.flash('success-message', 'Module updated successfully');
                res.redirect('/modules'); //res.send(data);
            }
            
        });

    },
    deleteModule:(req, res)=>{
        const moduleid = req.params.moduleid;
        Module.deleteModule(moduleid, (err, data)=>{
            req.flash('success-message', 'Module has been deleted');
            res.redirect('/modules'); //res.send(data);
        });
        
    },
    getTasks: (req, res)=>{
        TheTask.getTasks((err,data)=>{
            res.render('rbac/tasks', {pagetitle: 'Tasks', tasks:data});
        });
        
    },
    createTask:(req, res)=>{
       
        Module.getModules((err,data)=>{
            res.render('rbac/addtask', {pagetitle: 'Add Task', modules:data, theoptions:theoptions, layout:''});
        });
    },
    saveTask:(req, res)=>{
        // Validate request

        let errors = [];
        if (!req.body.taskroute) {
            errors.push("Task route cannot be empty!");
            
        }

        if (!req.body.tasklabel) {
            errors.push("Task label cannot be empty!");
            
        }

        if (!req.body.taskmethod) {
            errors.push("Task method cannot be empty!");
            
        }
        
        if (!req.body.module) {
            errors.push("Module cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // console.log(req.body.module);
        // return;
        // Create a task
        const thetask = new TheTask({
            module_id: req.body.module,
            task_route: req.body.taskroute,
            isnavbar: req.body.navbar,
            task_label: req.body.tasklabel,
            task_method: req.body.taskmethod,
            task_icon: req.body.taskicon,
            task_order: req.body.taskorder,
            isdashboard: req.body.dashboard,
        });

        // Save Task in the database
        TheTask.create(thetask, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Task."
            });

            return;
            
            }else{
                req.flash('success-message', 'Task created successfully');
                res.redirect('/tasks'); //res.send(data);
            }
            
        });

    },
    editTask:(req, res)=>{
        const taskid = req.params.taskid;
        TheTask.getTask(taskid, (err, data)=>{
            Module.getModules((err,moduledata)=>{
                res.render('rbac/edittask', {task:data, pagetitle: 'Edit Task', modules:moduledata, theoptions:theoptions, layout:''})
            });
        });
        
    },
    updateTask:(req, res)=>{
        // Validate request
        let errors = [];
        if (!req.body.taskroute) {
            errors.push("Task route cannot be empty!");
            
        }

        if (!req.body.tasklabel) {
            errors.push("Task label cannot be empty!");
            
        }

        if (!req.body.taskmethod) {
            errors.push("Task method cannot be empty!");
            
        }
        
        if (!req.body.module) {
            errors.push("Module cannot be empty!");
            
        }

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        // console.log(req.body);
        // return;
        // Create a task
        const thetask = new TheTask({
            module_id: req.body.module,
            task_route: req.body.taskroute,
            isnavbar: req.body.navbar,
            task_label: req.body.tasklabel,
            task_method: req.body.taskmethod,
            task_icon: req.body.taskicon,
            task_order: req.body.taskorder,
            isdashboard: req.body.dashboard,
            task_id: req.body.taskid
        });

        // update task in the database
        TheTask.update(thetask, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while updating the Task."
            });

            return;
            
            }else{
                req.flash('success-message', 'Task updated successfully');
                res.redirect('/tasks'); //res.send(data);
            }
            
        });

    },
    deleteTask:(req, res)=>{
        const taskid = req.params.taskid;
        TheTask.deleteTask(taskid, (err, data)=>{
            req.flash('success-message', 'Task has been deleted');
            res.redirect('/tasks'); //res.send(data);
        });
        
    },assignPriv: (req, res)=>{
        const roleid = req.params.roleid;
        
        TheTask.getModuleTasksPriv(roleid,(err,moduledata)=>{
            
        Role.getRole(roleid, (err, roledata)=>{
            
            res.render('rbac/assignprivileges', {pagetitle: 'Privileges Assigned', modules:moduledata, role:roledata});
 
        });
        
        });

        
        
    },
    savePrivileges:(req, res)=>{
        // Validate request

        let errors = [];
        if (!req.body.roleid) {
            errors.push("Role is required!");
            
        }

        if (!req.body.TaskId) {
            errors.push("Task cannot be empty!");
            
        }
        

        if(errors.length > 0){
            res.status(400).send({
            errors: errors
            });
            return;
        }

        let alltaskid = req.body.TaskId;
        let allpriv = [];

        alltaskid.map(t=>{
             // create privilege
            // const privilege = new Privilege({
            //     role_id: req.body.roleid,
            //     task_id: t
            // });

            const privilege = {
                role_id: req.body.roleid,
                task_id: t
            };

            allpriv.push(privilege);
        });

        // convert it to array of array
        let newallpriv=allpriv.reduce((o,a)=>{
            let ini=[];
            ini.push(a.role_id);
            ini.push(a.task_id);
            o.push(ini);
            return o
      },[])

        //console.log(newallpriv);
        //return;
       

        // Save Privilege in the database
        Privilege.create(req.body.roleid, newallpriv, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Privilege."
            });

            return;
            
            }else{
                req.flash('success-message', 'Privilege assigned successfully');
                res.redirect(`/privileges/assign/${req.body.roleid}`); //res.send(data);
            }
            
        });

    }



    
}