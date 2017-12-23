import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UsersTable from '../models/usersTable';
import App from '../app';
import { isNull, isNullOrUndefined } from 'util';
import sha1 = require ('sha1');


export default class UsersCtrl {

    private secret: string;

    constructor(private users: UsersTable = App.getInstance().getTable('users')) {
        this.secret = 'finalFlash';

    }

    public tokenCheck(request: Request, response: Response):void  {
        try {
            jwt.verify(request.body.token, this.secret);
            response.json({'bool': true});
        }
        catch (e) {
            response.json({'bool': false});
        }
    }

    public login(request: Request, response: Response):void {
        this.users.login([request.body.email, sha1(request.body.password)], (row:any) => {
            if (!isNull(row)) {
                const res = jwt.sign({
                        'sub': row.id,
                        'admin': row.admin,
                        'email': row.email,
                        'username': row.username,
                        'exp': Math.floor(Date.now() / 1000) + (60 * 60 * 24)
                    },
                    this.secret
                );
                response.json({'bool': true, 'token': res, 'admin': row.admin});
            } else {
                response.json({'bool': false});
            }
        });
    } //   END login

    public register(request: Request, response: Response):void {

        this.users.findExist(request.body.email, (row:any) => {
            if (isNullOrUndefined(row)) {
                this.users.create({
                        'email': request.body.email,
                        'password': sha1(request.body.password),
                        'username': request.body.username,
                    },
                    (row: any) => {
                        response.json({'created': true, 'id': row.id});
                    });
            } else {
                response.json({'created': false});
            }
        });

    } // END register

    public passwordCheck(request: Request, response: Response):void {
        const sha1 = require('sha1');
        this.users.findPass(request.body.id, sha1(request.body.password), (row) => {
            response.json(!isNull(row));
        });
    }

    public usernameChange(request: Request, response: Response):void  {
        this.users.update(request.body.id, {'username': request.body.username});
        response.json({});
    }

    public passwordChange(request: Request, response: Response):void {
        this.users.update(request.body.id, {'password': sha1(request.body.password)});
        response.json({});
    }

}
