import * as sequelize from 'sequelize';
import DBConfig from '../../config/dbconfig';

export default class SqlDB {

    private sequelize: sequelize.Sequelize;

    constructor() {

    }

    getDbConnect() {
        this.sequelize = new sequelize(DBConfig.uri, DBConfig.options);
        return this.sequelize;
    }
}
