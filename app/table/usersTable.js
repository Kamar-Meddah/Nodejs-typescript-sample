const table = require ('../../core/table/table');

module.exports = class usersTable extends table{

    constructor(){
        super();
        this.tab='users';
    }

    findPass(id,pass,cb){
        this[this.tab].find({where:{"id":{$eq: id},"password":{$eq: pass}}}).then((res)=>{
            cb(res)
        })
    }

    login(user=[],cb){

        this[this.tab].find({where:{"email":{$eq: user[0]},"password":{$eq: user[1]}}}).then((res)=>{
            cb(res);
        })

    }

    findExist (email,cb = null) {

        this[this.tab].find({where: {"email": email}}).then((res)=>{
            cb(res);
        })

    }

}
