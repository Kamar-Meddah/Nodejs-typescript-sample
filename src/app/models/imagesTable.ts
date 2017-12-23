import AppTable from "./appTable";
import {Sequelize} from "sequelize";
import {isUndefined} from "util";

export default class ImagesTable extends AppTable {

    constructor(db: Sequelize) {
        super(db);
        this.tab = 'images';
    }


    public findImg(id: number, cb: (res: any) => void): void {
        this.images.findAll({where: {"articleId": {$eq: id}}}).then((res: any) => {
            cb(res)
        })
    }

    public deleteWithArticle(id: number, cb?: () => void): void {
        this.images.destroy({where: {"articleId": {$eq: id}}}).then(() => {
            if (!isUndefined(cb)) cb();

        })

    }
}
