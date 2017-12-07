module.exports = class ArticlesCtrl {

    constructor() {
        this.articles = require('../app').getTable('articles');
    }

    index(request, response) {
        this.articles.count((nbr) => {
            let parpage = 6;
            let page = request.body.page;
            let total = nbr;
            let nbpage = Math.ceil(total / parpage);
            let arg1 = page * parpage - parpage;
            let arg2 = parpage;
            //----------------------------
            this.articles.last([arg1, arg2], (rows) => {
                let array = { 'art': rows, 'nbpage': nbpage };
                response.json(array);
            });
        })
    }


    show(request, response) {
        this.articles.find(request.body.id, (row) => {
            response.json(row)
        });
    }


    search(request, response) {
            this.articles.countSearch(request.body.search, (nbr) => {
                let parpage = 6;
                let page = request.body.page;
                let total = nbr;
                let nbpage = Math.ceil(total / parpage);
                let arg1 = page * parpage - parpage;
                let arg2 = parpage;
                //----------------------------
                this.articles.search(request.body.search, [arg1, arg2], (rows) => {
                    let array = { 'art': rows, 'nbpage': nbpage };
                    response.json(array);
                });
            })
        } //END search

    byCategorie(request, response) {
        this.articles.countByCategorie(request.body.category_id, (nbr) => {
            let parpage = 6;
            let page = request.body.page;
            let total = nbr;
            let nbpage = Math.ceil(total / parpage);
            let arg1 = page * parpage - parpage;
            let arg2 = parpage;
            //----------------------------
            this.articles.lastByCategorie(request.body.category_id, [arg1, arg2], (rows) => {
                let array = { 'art': rows, 'nbpage': nbpage };
                response.json(array);
            });
        })
    }

    delete(request, response) {
        const comments = require('../app').getTable('comments');
        const images = require('../app').getTable('images');
        const fs = require('fs');
        images.findImg(request.body.id, (row) => {
            row.forEach((element) => {
                fs.unlink(`img/articles/${element.name}`, (err, res) => {
                    if (err) {};
                });
            })
        })
        comments.deleteCom(request.body.id);
        images.deleteWithArticle(request.body.id);
        this.articles.delete(request.body.id);
        response.json({});
    }

    add(request, response) {
            const fs = require('fs');
            this.articles.create({ 'titre': request.body.titre, 'contenu': request.body.content, 'categoryId': request.body.category }, (postId) => {
                const images = require('../app').getTable('images');
                request.files.forEach((element) => {
                        if (element.mimetype.split('/')[0] === 'image') {
                            images.create({ 'articleId': postId }, (imgId) => {
                                    fs.rename(`img/articles/${element.filename}`, `img/articles/${imgId}.jpg`, () => {
                                            let name = imgId + '.jpg';
                                            images.update(imgId, { 'name': name });
                                        }) //end rename
                                }) //end image insert
                        } else {
                            fs.unlink(`img/articles/${element.filename}`, (err) => {
                                if (err) {};
                            })
                        }
                    }) //end files loop
                let array = { 'id': postId };
                response.json(array)
            });
        } //end create article

    edit(request, response) {
            const fs = require('fs');
            let r = [];
            this.articles.update(request.body.id, { 'titre': request.body.titre, 'contenu': request.body.content, 'categoryId': request.body.category }, () => {
                const images = require('../app').getTable('images');
                if (request.files.length > '0') {
                    request.files.forEach((element, i) => {
                        if (element.mimetype.split('/')[0] === 'image') {
                            images.create({ 'articleId': request.body.id }, (imgId) => {
                                    fs.rename(`img/articles/${element.filename}`, `img/articles/${imgId}.jpg`, (err) => {
                                            if (err) {}
                                            let name = imgId + '.jpg';
                                            images.update(imgId, { 'name': name });
                                            r.push({ 'id': imgId, 'name': name });
                                            if (i === request.files.length - 1) {
                                                response.json(r);
                                            }
                                        }) //end rename
                                }) //end image insert
                        } else {
                            fs.unlink(`img/articles/${element.filename}`, (err) => {
                                if (err) {}
                            })
                        }
                    })
                } else {
                    response.json({});
                } //end files loop
            });

        } //end edit article

}
