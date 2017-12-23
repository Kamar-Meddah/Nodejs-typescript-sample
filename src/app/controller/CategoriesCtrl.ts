import { Request, Response } from 'express';
import CategoriesTable from '../models/categoriesTable';
import App from '../app';
import ArticlesTable from '../models/articlesTable';

export default class CategoriesCtrl {

    constructor(
        private categories: CategoriesTable = App.getInstance().getTable('categories'),
        private articles: ArticlesTable = App.getInstance().getTable('articles') ) {
        //  content
    }

    public all(request: Request, response: Response): void {
        this.categories.all((row: any) => {
            response.json({ 'art': row });
        });
    }

    public index(request: Request, response: Response): void {
        this.categories.count((nbr: number) => {
            const parpage = 6;
            const page = request.query.page;
            const total = nbr;
            const nbpage = Math.ceil(total / parpage);
            const arg1 = page * parpage - parpage;
            const arg2 = parpage;
            //  ----------------------------
            this.categories.allP([arg1, arg2], (rows:any) => {
                response.json({ 'art': rows, 'nbpage': nbpage });
            });
        });
    }

    public add(request: Request, response: Response): void {
        this.categories.create({ 'titre': request.body.title });
        response.json({});
    }

    public edit(request: Request, response: Response): void {
        this.categories.update(request.body.id, { 'titre': request.body.title });
        response.json({});
    }

    public delete(request: Request, response: Response): void {
        this.articles.countByCategorie(request.query.id, (rows: number) => {
            if (rows === 0) {
                this.categories.delete(request.query.id);
            }
            response.json({ 'num': rows });
        });
    }

}
