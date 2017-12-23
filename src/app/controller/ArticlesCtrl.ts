import { Request, Response } from 'express';
import CategoriesTable from '../models/categoriesTable';
import ArticlesTable from '../models/articlesTable';
import ImagesTable from '../models/imagesTable';
import CommentsTable from '../models/commentsTable';
import * as fs from 'fs';
import App from '../app';

export default class ArticlesCtrl {

    constructor(
        private categories: CategoriesTable = App.getInstance().getTable('categories'),
        private articles: ArticlesTable = App.getInstance().getTable('articles'),
        private comments: CommentsTable = App.getInstance().getTable('comments'),
        private images: ImagesTable = App.getInstance().getTable('images'),
     ) {
        //  content
    }

    public index(request: Request, response: Response): void {
        this.articles.count((nbr: number) => {
            const parpage = 6;
            const page = request.query.page;
            const total = nbr;
            const nbpage = Math.ceil(total / parpage);
            const arg1 = page * parpage - parpage;
            const arg2 = parpage;
            //  ----------------------------
            this.articles.last([arg1, arg2], (rows) => {
                response.json({ 'art': rows, 'nbpage': nbpage });
            });
        });
    }


    public show(request: Request, response: Response): void {
        this.articles.find(request.query.id, (row) => {
            response.json(row);
        });
    }


    public search(request: Request, response: Response): void {
            this.articles.countSearch(request.query.search, (nbr: number) => {
                const parpage = 6;
                const page = request.query.page;
                const total = nbr;
                const nbpage = Math.ceil(total / parpage);
                const arg1 = page * parpage - parpage;
                const arg2 = parpage;
                //  ----------------------------
                this.articles.search(request.query.search, [arg1, arg2], (rows:any) => {
                    response.json({ 'art': rows, 'nbpage': nbpage });
                });
            });
        } //  END search

    public byCategorie(request: Request, response: Response): void {
        this.articles.countByCategorie(request.query.category_id, (nbr: number) => {
            const parpage = 6;
            const page = request.query.page;
            const total = nbr;
            const nbpage = Math.ceil(total / parpage);
            const arg1 = page * parpage - parpage;
            const arg2 = parpage;
            //  ----------------------------
            this.articles.lastByCategorie(request.query.category_id, [arg1, arg2], (rows: any) => {
                response.json({ 'art': rows, 'nbpage': nbpage });
            });
        });
    }

    public delete(request: Request, response: Response): void {

        this.images.findImg(request.query.id, (row: any) => {
            row.forEach((element: any) => {
                fs.unlink(`dist/img/articles/${element.name}`, (err: any) => {
                    if (err) console.log(err);
                });
            });
        });
        this.comments.deleteCom(request.query.id);
        this.images.deleteWithArticle(request.query.id);
        this.articles.delete(request.query.id);
        response.json({});
    }

    public add(request: Request, response: Response): void {
            this.articles.create({ 'titre': request.body.titre, 'contenu': request.body.content, 'categoryId': request.body.category },
             (postId: number) => {
                request.files.forEach((element: any) => {
                    console.log('hello')
                        if (element.mimetype.split('/')[0] === 'image') {
                            this.images.create({ 'articleId': postId }, (imgId) => {
                                    fs.rename(`dist/img/articles/${element.filename}`, `dist/img/articles/${imgId}.jpg`, () => {
                                            const name = imgId + '.jpg';
                                            this.images.update(imgId, { 'name': name });
                                        }); //  end rename
                                }); //  end image insert
                        } else {
                            fs.unlink(`dist/img/articles/${element.filename}`, (err: any) => {
                                if (err) console.log(err);
                            });
                        }
                    }); //  end files loop
                response.json({ 'id': postId });
            });
        } //  end create article

    public edit(request: Request, response: Response): void {
            let r: Array<any> = [];
            this.articles.update(request.body.id, { 'titre': request.body.titre, 'contenu': request.body.content, 'categoryId': request.body.category },
             () => {
                if (request.files.length > '0') {
                    request.files.forEach((element: any, i: number) => {
                        if (element.mimetype.split('/')[0] === 'image') {
                            this.images.create({ 'articleId': request.body.id }, (imgId: number) => {
                                    fs.rename(`dist/img/articles/${element.filename}`, `dist/img/articles/${imgId}.jpg`, (err: any) => {
                                            if (err) console.log(err);
                                            const name = imgId + '.jpg';
                                            this.images.update(imgId, { 'name': name });
                                            r.push({ 'id': imgId, 'name': name });
                                            if (i === request.files.length - 1) {
                                                response.json(r);
                                            }
                                        }); //  end rename
                                }); //  end image insert
                        } else {
                            fs.unlink(`dist/img/articles/${element.filename}`, (err: any) => {
                                if (err) console.log(err);
                            });
                        }
                    });
                } else {
                    response.json({});
                } //  end files loop
            });

        } //  end edit article

}
