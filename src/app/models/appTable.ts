import * as sequelize from 'sequelize';
import {isUndefined} from "util";

export default class AppTable { //  Begin Class

    protected categories: any;
    protected users: any;
    protected articles: any;
    protected images: any;
    protected comments: any;
    protected tab: String;

    constructor(protected db: sequelize.Sequelize) {
        //  categories table
        this.categories = this.db.define('categories', {
            titre: {type: sequelize.STRING, allowNull: false}
        });
        this.categories.sync();

        //  articles table
        this.articles = this.db.define('articles', {
            titre: {type: sequelize.STRING, allowNull: false},
            contenu: {type: sequelize.TEXT},
            date: {type: sequelize.DATE, defaultValue: this.db.fn('NOW')},
            categoryId: {
                type: sequelize.INTEGER,
                references: {
                    model: this.categories,
                    key: 'id',
                },
                allowNull: false
            }
        });
        this.articles.sync();

        //  users table
        this.users = this.db.define('users', {
            username: {type: sequelize.STRING, allowNull: false},
            password: {type: sequelize.STRING, allowNull: false},
            admin: {type: sequelize.BOOLEAN},
            email: {type: sequelize.STRING, unique: 'compositeIndex', allowNull: false}
        });
        this.users.sync();

        //  images table
        this.images = this.db.define('images', {
            name: {type: sequelize.STRING, allowNull: true},
            articleId: {
                type: sequelize.INTEGER,
                references: {
                    model: this.articles,
                    key: 'id',
                },
                allowNull: false
            }
        });
        this.images.sync();

        //  comments table
        this.comments = this.db.define('comments', {
            name: {type: sequelize.STRING, allowNull: false},
            content: {type: sequelize.TEXT, allowNull: false},
            date: {type: sequelize.DATE, defaultValue: this.db.fn('NOW')},
            articleId: {
                type: sequelize.INTEGER,
                references: {
                    model: this.articles,
                    key: 'id',
                },
                allowNull: false
            }
        });
        this.comments.sync();

        //  constraines
        //  articles - categories
        this.articles.belongsTo(this.categories);
        this.categories.hasMany(this.articles);
        //  images - articles
        this.images.belongsTo(this.articles);
        this.articles.hasMany(this.images);
        //  comments - articles
        this.comments.belongsTo(this.articles);
        this.articles.hasMany(this.comments);


    }

    public count(cb: (nbr: number) => void): void {

        this.getModel().count().then((res: number) => {
            cb(res);
        });
    }

    public all(cb: (res: any) => void, arg?: Array<number>): void {
        this.getModel().findAll({
            order: [
                ['titre', 'ASC']
            ]
        }).then((res: number) => {
            cb(res);
        });
    }

    public find(id: number, cb: (res: any) => void): void {
        this.getModel().find({where: {'id': {$eq: id}}}).then((res: any) => {
            cb(res);
        });
    }

    public last(arg: Array<number>, cb: (res: any) => void): void {
        this.getModel().findAll({
            offset: arg[0], limit: arg[1], order: [
                ['date', 'DESC']
            ]
        }).then((res: any) => {
            cb(res);
        });
    }

    public create(obj: object, cb?: (res: number) => void): void {
        this.getModel().create(obj).then((res: any) => {
            if (!isUndefined(cb)) cb(res.id);
        });
    }

    public update(id: number, obj: object, cb?: (() => void)): void {
        this.getModel().update(obj, {where: {'id': {$eq: id}}}).then((res: any) => {
            if (!isUndefined(cb)) cb();
        });
    }

    public delete(id: number): void {

        this.getModel().destroy({where: {'id': {$eq: id}}});
    }

    private getModel():any{

        if (this.tab.toLocaleLowerCase() === 'images') return this.images;
        else if (this.tab.toLocaleLowerCase() === 'articles') return this.articles;
        else if (this.tab.toLocaleLowerCase() === 'categories') return this.categories;
        else if (this.tab.toLocaleLowerCase() === 'users') return this.users;
        else return this.comments;

    }

} // End Class
