import { Request, Response } from 'express';
import CommentsTable from '../models/commentsTable';
import App from '../app';


export default class CommentsCtrl {
    constructor(private comments: CommentsTable = App.getInstance().getTable('comments')) {
    }

    public find(request: Request, response: Response): void {
        this.comments.find(request.query.id, (row: any) => {
            response.json(row);
        });
    }

    public add(request: Request, response: Response): void {
        this.comments.create({ 'name': request.body.name, 'content': request.body.comment, 'articleId': request.body.postId },
         (data: any) => {
            response.json({ 'id': data });
        });
    }

    public delete(request: Request, response: Response): void {
        this.comments.delete(request.query.id);
        response.json({});
    }

}
