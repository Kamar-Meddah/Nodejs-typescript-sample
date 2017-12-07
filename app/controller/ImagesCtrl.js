module.exports = class ImagesCtrl {
    constructor() {
        this.images = require('../app').getTable('images');
    }

    find(request, response) {
        this.images.findImg(request.body.id, (row) => {
            response.json(row);
        })

    }

    delete(request, response) {
        const fs = require('fs');
        this.images.find(request.body.id, (row) => {
            fs.unlink(`img/articles/${row.name}`, (err) => {
                if (err) {};
                this.images.delete(request.body.id);
            })
        })
        response.json({});
    }

}
