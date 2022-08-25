const TheTask = require("../models/taskModel.js");

module.exports = {

    isUserAuthenticated: (req,res,next)=>{
        if(req.isAuthenticated()){
            TheTask.getSidebarModuleTasks(req.user.role_id,(err,data)=>{
            res.locals.usermodules = data;

           
            // check if user has privilege to access resources    
            // TheTask.isRolePrivilege(req.user.role_id,req.originalUrl,(err,privdata)=>{  
            //     console.log(privdata);

            //     if (privdata===false) {                    
            //         res.redirect('/login');
                    
            //         return;
            //     }    
                
                
            // });

            // console.log(req.originalUrl);
            // console.log(req.path);
            // console.log(req.baseUrl);
            
            
            //console.log(res.locals.usermodules[);
            // return;
            next();

            });
            
        }
        else{
            req.flash("error-message", "You've to login to access this page!");
            res.redirect('/login');
        }
    }

};