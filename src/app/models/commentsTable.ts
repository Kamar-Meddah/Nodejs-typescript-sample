import {Sequelize} from "sequelize";
import AppTable from "./appTable";
import {isUndefined} from "util";

export default class CommentsTable extends AppTable {

    constructor(db: Sequelize) {
        super(db);
        this.tab = 'comments';
    }

    public find(id: number, cb: (res: any) => void): void {
        this.comments.findAll({where: {"articleId": {$eq: id}}, order: [['date', 'DESC']]}).then((res: any) => {
            cb(res)
        })
    }

    public deleteCom(id: number, cb?: () => void): void {
        this.comments.destroy({where: {"articleId": {$eq: id}}}).then(() => {
            if (!isUndefined(cb)) cb();
        })
    }

}
