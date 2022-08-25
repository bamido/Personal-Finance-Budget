const sql = require("./db.js");

// constructor
const Section = function(section){
    this.section_id = section.section_id,
    this.page_id = section.page_id,
    this.parent_id = section.parent_id,
    this.sectiontitle = section.sectiontitle,
    this.sectionslug = section.sectionslug,
    this.sectionbody = section.sectionbody,
    this.extlink = section.extlink,
    this.sectionstatus = section.sectionstatus,
    this.user_id = section.user_id,
    this.sortorder = section.sortorder,
    this.created_at = section.created_at,
    this.updated_at =  section.updated_at
}

Section.create = (newdata, result)=>{
    sql.query("INSERT INTO sections SET ?", newdata, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create page section: ", {sectionid:res.insertId, ...newdata});
        result(null,{sectionid:res.insertId});

    });
};

Section.getPageSections = (pageid,result)=>{
    sql.query("SELECT *, (SELECT docurl FROM sectiondocs b WHERE b.section_id=a.section_id AND doctype=? LIMIT 1) as imageurl FROM sections a WHERE page_id=?",['image',pageid], (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

Section.getSection = (sectionid, result)=>{
    sql.query(`SELECT * FROM sections WHERE section_id = ${sectionid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


Section.update = (newdata, result)=>{
    sql.query("UPDATE sections SET sectiontitle =?, sectionslug =?, parent_id =? , page_id =?, sectionbody =?, extlink=?, sectionstatus =? , user_id =?, sortorder =? WHERE section_id=?", [newdata.sectiontitle, newdata.sectionslug, newdata.parent_id, newdata.page_id, newdata.sectionbody, newdata.extlink, newdata.sectionstatus, newdata.user_id, newdata.sortorder, newdata.section_id], (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // not found section with the id
            result({ errors: "not_found" }, null);
            return;
        }

        result(null,{...newdata});

    });
};

Section.deletePage = (sectionid, result)=>{
    sql.query("UPDATE sections SET sectionstatus=? WHERE section_id =?",['deleted',sectionid], (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows == 0) {
            // could not found section with the id
            result({ errors: "could not found section with the id" }, null);
            return;
        }

        result(null,res);
    });
};


Section.getAllSections = (result)=>{
    sql.query("SELECT *, (SELECT docurl FROM sectiondocs b WHERE b.section_id=a.section_id AND doctype=? LIMIT 1) as imageurl FROM sections a", ['image'],(err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

module.exports = Section;