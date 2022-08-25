const sql = require("./db.js");

// constructor
const Page = function(page){
    this.page_id = page.page_id,
    this.pagetitle = page.pagetitle,
    this.pageslug = page.pageslug,
    this.parent_id = page.parent_id,
    this.metakeyword = page.metakeyword,
    this.metadesc = page.metadesc,
    this.pagestatus = page.pagestatus,
    this.user_id = page.user_id,
    this.sortorder = page.sortorder,
    this.created_at = page.created_at,
    this.updated_at = page.updated_at
}

Page.create = (newpage, result)=>{
    sql.query("INSERT INTO pages SET ?", newpage, (err, res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("create page: ", {pageid:res.insertId, ...newpage});
        result(null,{pageid:res.insertId, ...newpage});

    });
};

Page.getPages = (result)=>{
    sql.query("SELECT *, (SELECT pagetitle from pages b where a.parent_id=b.page_id ) as parentname FROM pages a", (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res);
    });
};

Page.getPage = (pageid, result)=>{
    sql.query(`SELECT * FROM pages WHERE page_id = ${pageid}`, (err,res)=>{
        if(err){
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null,res[0]);
    });
};


Page.update = (newpage, result)=>{
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

Page.deletePage = (pageid, result)=>{
    sql.query("UPDATE pages SET pagestatus=? WHERE page_id =?",['deleted',pageid], (err,res)=>{
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

        result(null,res);
    });
};

module.exports = Page;