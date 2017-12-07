const table = require('../../core/table/table');

class articlesTable extends table {

    constructor() {
        super();
        this.tab = 'articles';
    }

    countByCategorie(id, cb) {
        this[this.tab].count({ where: { 'categoryId': id } }).then((res) => {
            cb(res)
        })
    }

    lastByCategorie(id, arg = [], cb) {

        this[this.tab].findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            where: { "categoryId": id },
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res) => {
            cb(res)
        })
    }

    last(arg = [], cb) {
        this[this.tab].findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res) => {
            cb(res)
        })

    }

    all(arg = [], cb) {
        this[this.tab].findAll({
            offset: arg[0],
            order: [
                ['date', 'DESC']
            ],
            attributes: ['id', 'date', 'titre', 'categoryId']
        }).then((res) => {

            cb(res)
        })

    }

    search(index, arg = [], cb) {
        let z = [];
        let a = index.split(' ');
        z = a.join('%');

        this[this.tab].findAll({
            include: [this.categories],
            offset: arg[0],
            limit: arg[1],
            where: { "titre": { $like: '%' + z + '%' } },
            order: [
                ['date', 'DESC']
            ],
            attributes: [
                [this.db.fn('SUBSTRING', this.db.col('contenu'), 1, 200), 'contenu'],
                'id', 'date', 'titre', 'categoryId'
            ]
        }).then((res) => {
            cb(res)
        })
    }

    countSearch(index, cb) {
        let z = [];
        let a = index.split(' ');
        z = a.join('%');

        this[this.tab].count({ where: { "titre": { $like: '%' + z + '%' } } }).then((res) => {
            cb(res)
        })
    }

    find(id, cb) {
        this[this.tab].find({
            include: [this.categories],
            where: { "id": id }
        }).then((res) => {
            cb(res)
        })
    }

}

module.exports = new articlesTable();