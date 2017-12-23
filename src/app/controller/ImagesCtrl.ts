import { Request, Response } from 'express';
import ImagesTable from '../models/imagesTable';
import App from '../app';
import * as fs from 'fs';


export default class ImagesCtrl {
    constructor(private images: ImagesTable = App.getInstance().getTable('images')) {

    }

    public find(request: Request, response: Response): void  {
        this.images.findImg(request.query.id, (row: any) => {
            response.json(row);
        });

    }

    public delete(request: Request, response: Response): void {

        this.images.find(request.query.id, (row: any) => {
            fs.unlink(`dist/img/articles/${row.name}`, (err) => {
                if (err) console.log(err);
                else this.images.delete(request.query.id);
            });
        });
        response.json({});
    }

}
