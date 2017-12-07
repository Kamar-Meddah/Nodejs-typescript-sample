const table = require ('../../core/table/table');

module.exports = class usersTable extends table{

    constructor(){
        super();
        this.tab='users';
    }

    findPass(id,pass,cb){
        this[this.tab].find({where:{"id":id,"password":pass}}).then((res)=>{
            cb(res)
        })
    }

    login(user=[],cb){
        this[this.tab].find({where:{"username":user[0],"password":user[1]}}).then((res)=>{
            cb(res)
        })

    }

}
