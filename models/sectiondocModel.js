const sql = require("./db.js");
const fs = require('fs');

// constructor
const Sectiondoc = function(section){
    this.sectiondoc_id = section.sectiondoc_id,
    this.section_id = section.section_id,
    this.docurl = section.docurl,
    this.doctype = section.doctype
    this.created_at = section.created_at,
    this.updated_at =  section.updated_at
}

Sectiondoc.create = (newdata, result)=>{
    sql.query("INSERT INTO sectiondocs SET ?", newdata, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create sectiondoc: ", {sectiondocid:res.insertId, ...newdata});
        result(null,{sectiondocid:res.insertId, ...newdata});

    });
};

Sectiondoc.getSectiondocs = (sectionid,result)=>{
    sql.query("SELECT * FROM sectiondocs WHERE section_id=?",sectionid, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

Sectiondoc.getPage = (pageid, result)=>{
    sql.query(`SELECT * FROM pages WHERE page_id = ${pageid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


Sectiondoc.update = (newpage, result)=>{
    sql.query("UPDATE pages SET pagetitle =?, pageslug =?, parent_id =? , metakeyword =?, metadesc =?, pagestatus =? , user_id =?, sortorder =? WHERE page_id=?", [newpage.pagetitle, newpage.pageslug, newpage.parent_id, newpage.metakeyword, newpage.metadesc, newpage.pagestatus, newpage.user_id, newpage.sortorder, newpage.page_id], (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found page with the id
            result({ kind: "not_found" }, null);
            return;
          }

        console.log("updated page: ", {pageid:newpage.page_id, ...newpage});
        result(null,{pageid:newpage.page_id, ...newpage});

    });
};

Sectiondoc.delete = (sectiondocid, oldfile, result)=>{
    sql.query("DELETE FROM sectiondocs WHERE sectiondoc_id =?",[sectiondocid], (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found sectiondoc with the id
            result({ kind: "not_found" }, null);
            return;
        }

        // unlink file
        let filetodelete = './public/uploads/'+oldfile;
        if(oldfile!==''){
            fs.unlink(filetodelete, (err) => {
                if (err) {
                    throw err;
                }
            
                console.log("File is deleted.");
            });
        }
        
        

        result(null,res);
    });
};

module.exports = Sectiondoc;