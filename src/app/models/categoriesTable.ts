import AppTable from "./appTable";
import {Sequelize} from "sequelize";

export default class CategoriesTable extends AppTable {

    constructor(db: Sequelize) {
        super(db);
        this.tab = 'categories';
    }

    public allP(arg: Array<number>, cb: (res: any) => void): void {
        this.categories.findAll({offset: arg[0], limit: arg[1], order: [['titre', 'ASC']]}).then((res: any) => {
            cb(res)
        })
    }

}
