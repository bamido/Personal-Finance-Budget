const sql = require("./db.js");

// constructor
const Role = function(role){
    this.role_id = role.role_id,
    this.role_name = role.role_name,
    this.created_at = role.created_at,
    this.updated_at = role.updated_at
}

Role.create = (newRole, result)=>{
    sql.query("INSERT INTO roles SET ?", newRole, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create role: ", {roleid:res.insertId, ...newRole});
        result(null,{roleid:res.insertId, ...newRole});

    });
};

Role.getRoles = (result)=>{
    sql.query("SET @counter = 0;");
    sql.query("SELECT *, @counter := @counter+1 AS kounter FROM roles;", (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

Role.getRole = (roleid, result)=>{
    sql.query(`SELECT * FROM roles WHERE role_id = ${roleid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


Role.update = (newRole, result)=>{
    sql.query("UPDATE roles SET role_name =? WHERE role_id=?", [newRole.role_name, newRole.role_id], (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Role with the id
            result({ kind: "not_found" }, null);
            return;
          }

        console.log("updated role: ", {roleid:newRole.role_id, ...newRole});
        result(null,{roleid:newRole.role_id, ...newRole});

    });
};

Role.deleteRole = (roleid, result)=>{
    sql.query("DELETE FROM roles WHERE role_id =?",roleid, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Role with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null,res);
    });
};

module.exports = Role;