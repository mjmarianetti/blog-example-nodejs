'use strict';

module.exports = (mongoose) => {

    var Schema = mongoose.Schema;

    const Post = new Schema({
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });


    return Post;
};