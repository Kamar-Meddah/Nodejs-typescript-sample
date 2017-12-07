const table = require ('../../core/table/table');

module.exports = class imagesTable extends table{

    constructor(){
        super();
        this.tab='images';
    }

   
   findImg(id,cb){
       this[this.tab].findAll({where:{"articleId": {$eq: id}}}).then((res)=>{
           cb(res)
       })
    }

    deleteWithArticle(id,cb=null){
        this[this.tab].destroy({where:{"articleId": {$eq: id}}}).then(res=>{
            if(cb !== null){
                cb();
            }
        })

    }
}
