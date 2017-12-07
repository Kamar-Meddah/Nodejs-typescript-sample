const table = require ('../../core/table/table');

module.exports = class commentsTable extends table{

    constructor(){
        super();
        this.tab='comments';
    }

    find(id,cb){
        this[this.tab].findAll({where:{"articleId": {$eq: id} },order: [['date', 'DESC']]}).then(res=>{
            cb(res)
        })
    }

    deleteCom(id,cb=null){
        this[this.tab].destroy({where:{"articleId": {$eq: id} } }).then(res=>{
            if(cb !== null){
                cb();
            }
        })
    }

}
