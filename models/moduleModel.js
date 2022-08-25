const sql = require("./db.js");

// constructor
const Module = function(module){
    this.module_id = module.module_id,
    this.module_title = module.module_title,
    this.module_icon = module.module_icon,
    this.module_order = module.module_order,
    this.created_at = module.created_at,
    this.updated_at = module.updated_at
}

Module.create = (newmodule, result)=>{
    sql.query("INSERT INTO modules SET ?", newmodule, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create module: ", {moduleid:res.insertId, ...newmodule});
        result(null,{moduleid:res.insertId, ...newmodule});

    });
};

Module.getModules = (result)=>{
    sql.query("SET @counter = 0;");
    sql.query("SELECT *, @counter := @counter+1 AS kounter FROM modules;", (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

Module.getModule = (moduleid, result)=>{
    sql.query(`SELECT * FROM modules WHERE module_id = ${moduleid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


Module.update = (newmodule, result)=>{
    sql.query("UPDATE modules SET module_title =?, module_icon =?, module_order =?  WHERE module_id=?", [newmodule.module_title, newmodule.module_icon, newmodule.module_order, newmodule.module_id], (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found module with the id
            result({ kind: "not_found" }, null);
            return;
          }

        console.log("updated module: ", {moduleid:newmodule.module_id, ...newmodule});
        result(null,{moduleid:newmodule.module_id, ...newmodule});

    });
};

Module.deleteModule = (moduleid, result)=>{
    sql.query("DELETE FROM modules WHERE module_id =?",moduleid, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found module with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null,res);
    });
};

module.exports = Module;