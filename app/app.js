class app{//Begin Class

     static getInstance(){
         if(this.instance === undefined){
             this.instance = new app();
         }
         return this.instance;
     }

     getDb(){
         
        if(this.DB === undefined){
            const dbConnect=require('../core/database/SqlDB');
            this.DB=new dbConnect(require('../config/dbconfig'));
            this.DB = this.DB.getDbConnect();
        }
        return this.DB;
    }

    getTable(name){
        let n=name+'Table';
        let ins = require('./table/'+n);
        return new ins();
    }

    getDbAuth(){
        
       if(this.dbAuth=== undefined){
           const auth=require('../core/admin/dbAuth');
           this.dbAuth=new auth();
       }
       return this.dbAuth;
   }

}//END Class
module.exports = app.getInstance();