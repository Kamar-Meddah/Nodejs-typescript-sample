const Sequelize = require('sequelize');

module.exports = class table { //Begin Class

    constructor(db = require('../../app/app').getDb()) {
        this.tab = '';
        this.db = db;

        //categories table
        this.categories = this.db.define('categories', {
            titre: { type: Sequelize.STRING }
        });
        this.categories.sync();

        //articles table
        this.articles = this.db.define('articles', {
            titre: { type: Sequelize.STRING },
            contenu: { type: Sequelize.TEXT },
            date: { type: Sequelize.DATE, defaultValue: this.db.fn('NOW') },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: this.categories,
                    key: 'id',
                }
            }
        });
        this.articles.sync();

        //users table
        this.users = this.db.define('users', {
            username: { type: Sequelize.STRING },
            password: { type: Sequelize.STRING },
            admin :{type: Sequelize.BOOLEAN}
        })
        this.users.sync();

        //images table
        this.images = this.db.define('images', {
            name: { type: Sequelize.STRING },
            articleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: this.articles,
                    key: 'id',
                }
            }
        })
        this.images.sync();

        //comments table
        this.comments = this.db.define('comments', {
            name: { type: Sequelize.STRING },
            content: { type: Sequelize.TEXT },
            date: { type: Sequelize.DATE, defaultValue: this.db.fn('NOW') },
            articleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: this.articles,
                    key: 'id',
                }
            }
        })
        this.comments.sync();

        //constraines
        //articles - categories
        this.articles.belongsTo(this.categories)
        this.categories.hasMany(this.articles)
            //images - articles
        this.images.belongsTo(this.articles)
        this.articles.hasMany(this.images)
            //comments - articles
        this.comments.belongsTo(this.articles)
        this.articles.hasMany(this.comments)


    }

    count(cb) {
        this[this.tab].count().then(res => {
            cb(res)
        })
    }

    all(cb) {
        this[this.tab].findAll({ order: [
                ['titre', 'ASC']
            ] }).then((res) => {
            cb(res)
        })
    }

    find(id, cb) {
        this[this.tab].find({ where: { 'id': id } }).then((res) => {
            cb(res)
        })
    }

    last(arg = [], cb) {
        this[this.tab].findAll({ offset: arg[0], limit: arg[1], order: [
                ['date', 'DESC']
            ] }).then((res) => {
            cb(res)
        })
    }

    create(obj, cb = null) {
        this[this.tab].create(obj).then((res) => {
            if (cb !== null) { cb(res.id) }
        })
    }

    update(id, obj, cb = null) {
        this[this.tab].update(obj, { where: { 'id': id } }).then((res) => {
            if (cb !== null) { cb() }
        })
    }

    delete(id) {
        this[this.tab].destroy({ where: { 'id': id } })
    }

} //End Class
