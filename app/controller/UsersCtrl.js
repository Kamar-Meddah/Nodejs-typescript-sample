module.exports = class UsersCtrl {

    constructor() {
        this.users = require('../app').getTable('users');
        this.jwt = require('jsonwebtoken');

    }

    login(request, response) {
            const sha1 = require('sha1')
           // console.log(this.jwt)
            
            this.users.login([request.body.email, sha1(request.body.password)],(row) => {
                if (row !== null) {
                    console.log(row.admin)
                    let res = this.jwt.sign({
                        'id': row.id,
                        'admin': row.admin,
                        'email':row.email,
                        'username': row.username,
                        exp: Date.now()+1000*60*60*24
                    },
                    'finalFlash'
                );
                
                response.json({'bool':true, token: res,id: row.id, 'admin': row.admin, 'username': row.username});
                
            } else {
                    response.json({ 'bool': false });
                }
            });
        } //END login

        register(request, response) {
            const sha1 = require('sha1')

            this.users.findExist(request.body.email, (row) =>{
                if (row == null) {
                    this.users.create({
                        'email': request.body.email,
                        'password': sha1(request.body.password),
                        'username': request.body.username,
                    },
                    (row) => {
                      response.json({"created": true, "id": row.id});
                    });
                } else {
                    response.json({"created":false})
                }
            });
            

                
        } //END register

    passwordCheck(request, response) {
        const sha1 = require('sha1')
        this.users.findPass(request.body.id, sha1(request.body.password), (row) => {
            let bool = row !== null;
            response.json(bool);
        })
    }

    usernameChange(request, response) {
        this.users.update(request.body.id, { 'username': request.body.username });
        response.json({});
    }

    passwordChange(request, response) {
        const sha1 = require('sha1')
        this.users.update(request.body.id, { 'password': sha1(request.body.password) })
        response.json({});
    }

}
