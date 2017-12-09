module.exports = class CommentsCtrl {
    constructor() {
        this.comments = require('../app').getTable('comments');
    }

    find(request, response) {
        this.comments.find(request.query.id, (row) => {
            response.json(row)
        });
    }

    add(request, response) {
        this.comments.create({ "name": request.body.name, "content": request.body.comment, "articleId": request.body.postId }, (data) => {
            response.json({ 'id': data });
        });
    }

    delete(request, response) {
        this.comments.delete(request.body.id);
        response.json({});
    }

}
