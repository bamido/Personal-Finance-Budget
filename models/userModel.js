const sql = require("./db.js");

// constructor
const User = function(user){
    this.user_id = user.user_id,
    this.role_id = user.role_id,
    this.firstname = user.firstname,
    this.lastname = user.lastname,
    this.phonenumber = user.phonenumber,
    this.gender = user.gender,
    this.dateofbirth = user.dateofbirth,
    this.emailaddress = user.emailaddress,
    this.password = user.password,
    this.ipaddress = user.ipaddress,
    this.created_at = user.created_at,
    this.updated_at = user.updated_at
}

User.create = (newuser, result)=>{
    sql.query("INSERT INTO users SET ?", newuser, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create module: ", {moduleid:res.insertId, ...newuser});
        result(null,{moduleid:res.insertId, ...newuser});

    });
};


User.findByEmail = (email,result)=>{
    sql.query("SELECT * FROM users WHERE emailaddress =?",email, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


User.findById = (userid,result)=>{
    sql.query(`SELECT * FROM users JOIN roles ON users.role_id=roles.role_id WHERE user_id =${userid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};

User.getModules = (result)=>{
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

User.getModule = (moduleid, result)=>{
    sql.query(`SELECT * FROM modules WHERE module_id = ${moduleid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


User.update = (newmodule, result)=>{
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

User.deleteModule = (moduleid, result)=>{
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

module.exports = User;