module.exports = class UsersCtrl {

    constructor() {
        this.users = require('../app').getTable('users');
        this.jwt = require('jsonwebtoken');

    }

    login(request, response) {
            const sha1 = require('sha1')
           // console.log(this.jwt)
            
            this.users.login([request.body.username, sha1(request.body.password)], (row) => {
                if (row !== null) {
                    console.log(row.admin)
                    let res = this.jwt.sign({'id': row.id,'admin': row.admin,'user':request.body.username,exp: Date.now()+60*60*60*24 },'finalFlash')
                    response.json({token: res,id: row.id, 'bool':true,'admin': row.admin});
                } else {
                    response.json({ 'bool': false });
                }
            });
        } //END login

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
