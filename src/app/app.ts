import SqlDB from './database/SqlDB';
import { Sequelize } from 'sequelize';
import ArticlesTable from './models/articlesTable';
import UsersTable from './models/usersTable';
import CommentsTable from './models/commentsTable';
import ImagesTable from './models/imagesTable';
import CategoriesTable from './models/categoriesTable';

export default class App { //  Begin Class

    private static instance: App;
    private DB: Sequelize;

    public static getInstance(): App {
        if (this.instance === undefined) {
            this.instance = new App();
        }
        return this.instance;
    }

    public getTable(name: string): any {
        name = name.toLocaleLowerCase();
        if (name === 'users') return new UsersTable(App.getInstance().getDb());
        if (name === 'articles') return new ArticlesTable(App.getInstance().getDb());
        if (name === 'images') return new ImagesTable(App.getInstance().getDb());
        if (name === 'categories') return new CategoriesTable(App.getInstance().getDb());
        if (name === 'comments') return new CommentsTable(App.getInstance().getDb());
    }

    public getDb(): Sequelize {
        if (this.DB === undefined) {
            this.DB = new SqlDB().getDbConnect();
        }
        return this.DB;
    }

}//  END Class
