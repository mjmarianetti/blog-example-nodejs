'use strict';

module.exports = (mongoose) => {

    const Schema = mongoose.Schema;
    const STATUSES = ['public', 'private', 'draft'];
    const DEFAULT_STATUS = STATUSES[0];

    const Post = new Schema({
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: STATUSES,
            required: false
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


    Post.pre('save', async function (next) {
        const post = this;

        if (!post.status) {
            post.status = DEFAULT_STATUS;
        }
        next();
    });


    return Post;
};