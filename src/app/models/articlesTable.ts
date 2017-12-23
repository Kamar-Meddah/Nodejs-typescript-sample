import {Sequelize} from "sequelize";
import AppTable from "./appTable";

export default class ArticlesTable extends AppTable {

    constructor(db: Sequelize) {
        super(db);
        this.tab = 'articles';
    }

    public countByCategorie(id: number, cb: (res: any) => void): void {
        this.articles.count({where: {'categoryId': {$eq: id}}}).then((res: any) => {
            cb(res)
        })
    }

    public lastByCategorie(id: number, arg: Array<number>, cb: (res: any) => void): void {

        this.articles.findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            where: {"categoryId": {$eq: id}},
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res: any) => {
            cb(res)
        })
    }

    public last(arg: Array<number>, cb: (res: any) => void): void {
        this.articles.findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res: any) => {
            cb(res)
        })

    }

    public all(cb: (res: any) => void, arg: Array<number>): void {
        this.articles.findAll({
            offset: arg[0],
            order: [
                ['date', 'DESC']
            ],
            attributes: ['id', 'date', 'titre', 'categoryId']
        }).then((res: any) => {
            cb(res)
        })

    }

    public search(index: string, arg: Array<number>, cb: (res: any) => void): void {
        const a: Array<string> = index.split(' ');
        const z: string = a.join('%');

        this.articles.findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            where: {"titre": {$like: '%' + z + '%'}},
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res: any) => {
            cb(res)
        })
    }

    public countSearch(index: string, cb: (res: any) => void): void {
        let a: Array<string> = index.split(' ');
        const z: string = a.join('%');

        this.articles.count({where: {"titre": {$like: '%' + z + '%'}}}).then((res: any) => {
            cb(res)
        })
    }

    public find(id: number, cb: (res: any) => void): void {
        this.articles.find({
            include: [this.categories],
            where: {"id": {$eq: id}}
        }).then((res: any) => {
            cb(res)
        })
    }

}
