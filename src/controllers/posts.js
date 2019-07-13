'use strict';

module.exports = (logger, models) => {

    const BaseController = require('./base')(logger);

    class PostsController extends BaseController {

        async list(req, res, next) {
            try {

                const filters = {};

                const totalResults = await models.Post.countDocuments(filters);
                const results = await models.Post.find(filters, null);

                const response = {
                    total: totalResults,
                    totalPages: Math.ceil(totalResults / this.limit),
                    data: results
                };


                return res.status(200).json(response);
            } catch (error) {
                return this.sendErrorResponse(req, res, error);
            }
        }

        async get(req, res, next) {
            try {
                const result = await models.Post.findById(req.params.id);
                if (!result) {
                    return this.notFound(req, res);
                }
                return res.status(200).json(result);
            } catch (error) {
                return this.sendErrorResponse(req, res, error);
            }
        }

        async post(req, res, next) {

            try {
                let item = new models.Post(req.body);
                const result = await item.save();

                if (!result) {
                    return this.notFound(req, res);
                }

                return res.status(200).json(result);
            } catch (error) {
                return this.sendErrorResponse(req, res, error);
            }
        }

        async put(req, res, next) {

            try {
                const item = await models.Post.findById(req.params.id);

                item.title = req.body.title;
                item.body = req.body.body;

                const result = await item.save();

                if (!result) {
                    return this.notFound(req, res);
                }

                return res.status(200).json(result);
            } catch (error) {
                return this.sendErrorResponse(req, res, error);
            }
        }

        async delete(req, res, next) {
            try {
                const result = await models.Post.findById(req.params.id);
                if (!result) {
                    //this needs to be idempotent, otherwise we could return a 404 NOT FOUND
                    return res.status(200).json({
                        message: "Registro eliminado correctamente"
                    });
                }

                await result.remove();

                return res.status(200).json({
                    message: "Registro eliminado correctamente"
                });
            } catch (error) {
                return this.sendErrorResponse(req, res, error);
            }
        }
    }

    return PostsController;
};