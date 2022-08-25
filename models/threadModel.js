const sql = require("./db.js");


class Thread {
    // constructor
    constructor(thread) {
        this.thread_id = thread.thread_id,
        this.user_id = thread.user_id,
        this.threadname = thread.threadname,
        this.threadslug = thread.threadslug,
        this.threadstatus = thread.threadstatus,
        this.created_at = thread.created_at,
        this.updated_at = thread.updated_at
    }
    static create(newthread, result) {
        sql.query("INSERT INTO threads SET ?", newthread, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, { thread_id: res.insertId, ...newthread });

        });
    }
    static getThreads(result) {
        sql.query("SELECT * FROM threads", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, res);
        });
    }
    static getThread(threadid, result) {
        sql.query(`SELECT * FROM threads WHERE thread_id = ${threadid}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            result(null, res[0]);
        });
    }
    static update(newthread, result) {
        console.log(newthread);
        sql.query("UPDATE threads SET threadname =?, threadslug =?, threadstatus =? WHERE thread_id=?", [newthread.threadname, newthread.threadslug, newthread.threadstatus, newthread.thread_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found 
                result({ thread: "not_found" }, null);
                return;
            }

            result(null, { threadid: newthread.thread_id, ...newthread });

        });
    }
    static deleteThread(threadid, result) {
        sql.query("UPDATE threads SET threadstatus=? WHERE thread_id =?", ['deleted', threadid], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                result({ thread: "not_found" }, null);
                return;
            }

            result(null, res);
        });
    }
}







module.exports = Thread;