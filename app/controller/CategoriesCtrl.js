module.exports = class CategoriesCtrl {

    constructor() {
        this.categories = require('../app').getTable('categories');
    }

    all(request, response) {
        this.categories.all((row) => {
            response.json({ 'art': row });
        })
    }

    index(request, response) {
        this.categories.count((nbr) => {
            let parpage = 6;
            let page = request.body.page;
            let total = nbr;
            let nbpage = Math.ceil(total / parpage);
            let arg1 = page * parpage - parpage;
            let arg2 = parpage;
            //----------------------------
            this.categories.allP([arg1, arg2], (rows) => {
                response.json({ 'art': rows, 'nbpage': nbpage });
            });
        })
    }

    add(request, response) {
        this.categories.create({ 'titre': request.body.title });
        response.json({});
    }

    edit(request, response) {
        this.categories.update(request.body.id, { 'titre': request.body.title });
        response.json({});
    }

    delete(request, response) {
        const articles = require('../app').getTable('articles');
        articles.countByCategorie(request.body.id, (rows) => {
            if (rows == 0) {
                this.categories.delete(request.body.id);
            }
            response.json({ 'num': rows })
        })
    }

}
