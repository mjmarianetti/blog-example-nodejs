'use strict';


const DEFAULT_PAGE_ITEM = 10;

module.exports = (logger) => {

    const ResponseHelper = require('../helpers/response-helper')(logger);

    class BaseController {

        constructor() {
            this.limit = DEFAULT_PAGE_ITEM;
            this.HTTP_NOT_FOUND = "NOT FOUND";
        }

        param(req, res, next) {
            logger.info("parsing ID param: " + req.params.id);
            if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.sendStatus(400);
            } else {
                next();
            }
        }

        notFound(req, res, error) {
            return ResponseHelper.notFound(req, res, error);
        }

        sendErrorResponse(req, res, error) {
            logger.error(error);

            if (error === this.HTTP_NOT_FOUND) {
                return ResponseHelper.notFound(req, res, error);
            } else {
                return ResponseHelper.internalError(req, res, error);
            }
        }

    }

    return BaseController;
};