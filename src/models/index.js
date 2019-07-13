"use strict";

module.exports = (mongoose) => {

    let models = {};

    models.Post = mongoose.model('Post', require('./post')(mongoose), 'posts');    

    return models;
};