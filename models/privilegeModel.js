const sql = require("./db.js");

// constructor
const Privilege = function(privilege){
    this.privilege_id = privilege.privilege_id,
    this.role_id = privilege.role_id,
    this.task_id = privilege.task_id,
    this.created_at = module.created_at,
    this.updated_at = module.updated_at
}

Privilege.create = (roleid,newprivilege, result)=>{

    // delete role privileges

    sql.query("DELETE FROM privileges WHERE role_id=?", roleid, (err, res)=>{

        //sql.query("INSERT INTO privileges SET ?", newprivilege, (err, res)=>{
        sql.query("INSERT INTO privileges (role_id, task_id) VALUES ?", [newprivilege], (err, res)=>{
            if(err){
                console.log("error: ", err);
                result(err, null);
                return;
            }
            newprivilege.privilege_id = res.insertId;
            console.log("create privilege: ", {...newprivilege});
            result(null,{...newprivilege});

        });

    });
};


module.exports = Privilege;