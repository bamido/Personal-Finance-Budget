const sql = require("./db.js");

// constructor
const TheTask = function(task){
    this.task_id = task.task_id,
    this.module_id = task.module_id,
    this.task_route = task.task_route,
    this.isnavbar = task.isnavbar,
    this.task_label = task.task_label,
    this.task_method = task.task_method,
    this.task_icon = task.task_icon,
    this.task_order = task.task_order,
    this.isdashboard = task.isdashboard,
    this.created_at = task.created_at,
    this.updated_at = task.updated_at
}

TheTask.create = (newtask, result)=>{
    sql.query("INSERT INTO thetasks SET ?", newtask, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,{taskid:res.insertId, ...newtask});

    });
};

TheTask.getTasks = (result)=>{
    sql.query("SET @counter = 0;");
    sql.query("SELECT *, @counter := @counter+1 AS kounter FROM thetasks JOIN modules ON thetasks.module_id = modules.module_id;", (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

TheTask.getTask = (taskid, result)=>{
    sql.query(`SELECT * FROM thetasks WHERE task_id = ${taskid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


TheTask.update = (newtask, result)=>{
    sql.query("UPDATE thetasks SET module_id =?, task_route =?, isnavbar =? ,task_label =?, task_method =?, task_icon =? ,task_order =?, isdashboard =? WHERE task_id=?", [newtask.module_id, newtask.task_route, newtask.isnavbar, newtask.task_label, newtask.task_method, newtask.task_icon, newtask.task_order, newtask.isdashboard, newtask.task_id], (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found task with the id
            result({ kind: "not_found" }, null);
            return;
          }

        console.log("updated task: ", {taskid:newtask.task_id, ...newtask});
        result(null,{taskid:newtask.task_id, ...newtask});

    });
};

TheTask.deleteTask = (taskid, result)=>{
    sql.query("DELETE FROM tasks WHERE task_id =?",taskid, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found task with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null,res);
    });
};




TheTask.getModuleTasks = (roleid,module, result)=>{

    module['subtasks'] = [];
    //sql.query(`SELECT * FROM thetasks WHERE module_id = ${module.module_id}`, (err,res)=>{
        sql.query(`SELECT t.*,  (SELECT if(p.privilege_id, 'true','false') FROM privileges p WHERE p.role_id=${roleid} AND p.task_id=t.task_id) as ispriv FROM thetasks t WHERE t.module_id = ${module.module_id}`, (err,res)=>{
               
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }
        module['subtasks'] = res;
        result(null,module);
    });
};

TheTask.getModules = (result)=>{

    sql.query(`SELECT * FROM modules ORDER BY module_order DESC`, (err,res)=>{
       
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);

    });

};

TheTask.getModuleTasksPriv = (roleid,result)=>{
    
    sql.query(`SELECT * FROM modules ORDER BY module_order DESC`, (err,res)=>{
       
       
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            TheTask.getModuleTasks(roleid,element, (err, data)=>{
                //console.log(data);
            });
            
        }

        //console.log(modtasks);
       
        // loop through res
        let fres = [];
        /*res.map(m=>{
            m['subtasks'] = [];
        
            TheTask.getModuleTasks(roleid,m, (err, data)=>{
        
                //m['subtasks'] = data;
                m = data;
                
                //console.log(data);
            });

        
            // fetch tasks
            //sql.query(`SELECT * FROM thetasks WHERE module_id = ${m.module_id}`, (err,restasks)=>{
            /*sql.query(`SELECT t.*,  (SELECT if(p.privilege_id, 'true','false') FROM privileges p WHERE p.role_id=${roleid} AND p.task_id=t.task_id) as ispriv FROM thetasks t WHERE t.module_id = ${m.module_id}`, (err,restasks)=>{
                m['subtasks'] = restasks;
                fres =restasks;
                //console.log(fres);
                //return m;
                
                
            }); 
           
        }); 
        */

        result(null,res);
    });
   
};


TheTask.getSidebarModuleTasks = (roleid,result)=>{
    
    sql.query(`SELECT DISTINCT modules.* FROM modules JOIN thetasks 
    ON modules.module_id=thetasks.module_id
    JOIN privileges ON thetasks.task_id=privileges.task_id
    WHERE privileges.role_id=${roleid}
    ORDER BY modules.module_order ASC`, (err,res)=>{
       
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }
       
        // loop through res
        let fres;
        res.map((m,index,thearray)=>{
        m['subtasks'] = [];
           
            // fetch tasks
            //sql.query(`SELECT * FROM thetasks WHERE module_id = ${m.module_id}`, (err,restasks)=>{
            sql.query(`SELECT t.*, (SELECT if(p.privilege_id, 'true','false') FROM privileges p WHERE p.role_id=${roleid} AND p.task_id=t.task_id) as ispriv FROM thetasks t WHERE t.isnavbar='true' AND t.module_id = ${m.module_id}`, (err,restasks)=>{
                m['subtasks'] = restasks;
                //fres =restasks;
                // console.log(restasks);
                //return;
                
            });

        });

        result(null,res);
    });
};

TheTask.isRolePrivilege = (roleid,theurl,result)=>{    
    sql.query(`SELECT * FROM thetasks JOIN privileges 
    ON thetasks.task_id=privileges.task_id WHERE role_id=? AND task_route=?`,[roleid,theurl], (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }
        let resdata = false;
        if(res[0]){
            resdata = true;
            return;
        }
        //console.log(resdata);
                //return; 
        result(null,resdata);
    });
};



module.exports = TheTask;