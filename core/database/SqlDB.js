module.exports = class SqlDB{

    constructor(path){
        this.Sequelize = require('sequelize');
        this.path=path;
    }

    getDbConnect(){
        this.sequelize = new this.Sequelize(this.path.uri,this.path.options);
        return this.sequelize;
    }
}
