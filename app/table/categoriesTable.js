const table = require ('../../core/table/table');

module.exports = class categoriesTable extends table{

    constructor(){
        super();
        this.tab='categories';
    }

    allP(arg=[],cb){
        this[this.tab].findAll({offset: arg[0], limit: arg[1],order: [['titre', 'ASC']]}).then((res)=>{
            cb(res)
        })
       }

    }
