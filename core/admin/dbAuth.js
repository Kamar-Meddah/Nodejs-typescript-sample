module.exports = class dbAuth{
    
        constructor(db=require('../../app/app').getDb()){
            this.db = db;
        }
    
        login(user=[],cb){
            const sha1=require('sha1');
            this.db.query(`
            SELECT * FROM users WHERE username = ? AND password = ?`,
            [user[0],sha1(user[1])],(err,rows)=>{
                  cb(rows[0]);
            }
            );
        }

        logged(request){
            if(request.session.userId !==undefined){
                return true ;   
            }
            return false;
        }
}
