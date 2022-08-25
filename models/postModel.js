const sql = require("./db.js");


class Post {
    // constructor
    constructor(post) {
        this.post_id = post.post_id,
        this.thread_id = post.thread_id,
        this.user_id = post.user_id,
        this.posttitle = post.posttitle,
        this.postslug = post.postslug,
        this.postbody = post.postbody,
        this.metakeyword = post.metakeyword,
        this.metadescription = post.metadescription,
        this.postimageurl = post.postimageurl,
        this.postvideourl = post.postvideourl,
        this.posttype = post.posttype,
        this.poststatus = post.poststatus,
        this.sortorder = post.sortorder,
        this.created_at = post.created_at,
        this.updated_at = post.updated_at;
    }
    static create(newdata, result) {
        sql.query("INSERT INTO posts SET ?", newdata, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, { postid: res.insertId });

        });
    }
    static getThreadPosts(threadid, result) {
        sql.query("SELECT * FROM posts WHERE thread_id=?", [threadid], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, res);
        });
    }
    static getPost(postid, result) {
        sql.query(`SELECT * FROM posts WHERE post_id = ${postid}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, res[0]);
        });
    }
    static update(newdata, result) {        
        sql.query("UPDATE posts SET thread_id=?, posttitle =?, postslug =?, postbody =? , metakeyword =?, metadescription =?, postimageurl=?, postvideourl =? , poststatus =?, sortorder =? WHERE post_id=?", [newdata.thread_id, newdata.posttitle, newdata.postslug, newdata.postbody, newdata.metakeyword, newdata.metadescription, newdata.postimageurl, newdata.postvideourl, newdata.poststatus, newdata.sortorder, newdata.post_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found post with the id
                result({ errors: "not_found" }, null);
                return;
            }

            result(null, { ...newdata });

        });
    }
    static deletePage(sectionid, result) {
        sql.query("UPDATE sections SET sectionstatus=? WHERE section_id =?", ['deleted', sectionid], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // could not found section with the id
                result({ errors: "could not found section with the id" }, null);
                return;
            }

            result(null, res);
        });
    }
    static getAllPosts(result) {
        sql.query("SELECT * FROM posts JOIN threads ON posts.thread_id=threads.thread_id", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, res);
        });
    }
}









module.exports = Post;