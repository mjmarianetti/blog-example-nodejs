'use strict';

module.exports = (logger) => {
    // Helper for responses throughout the application
    class ResponseHelper {
        /**
     * Returns a default response object for use in controller handlers
     *
     * @param  {string} key The object key to use for response data
     *                      Default: 'data'
     *
     * @return {object}     Default response object
     */
        static defaultErrorResponse(err) {
            // Set default return value
            const ret = {
                message: err
            };

            return ret;
        }

        /**
     * internalError Helper method for sending a Internal Server Error response code and default JSON output
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {Error} error - Error object for runtime and internal error
     */
        static internalError(req, res, error) {
            // Log error is present
            if (error) {
                logger.error('internal server error', error);
            }

            return res
                .status(500)
                .json(ResponseHelper.defaultErrorResponse(error));
        }

        /**
     * methodNotAllowed Helper method for sending a Method Not Allowed response code and default JSON output
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @return {json}
     */
        static methodNotAllowed(req, res) {
            return res
                .status(405)
                .json(ResponseHelper.defaultErrorResponse("Method not allowed"));
        }

        /**
     * methodNotImplemented Helper method for sending a Method Not Implemented response code and default JSON output
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @return {json}
     */
        static methodNotImplemented(req, res) {
            return res
                .status(501)
                .json(ResponseHelper.defaultErrorResponse("Method not implemented"));
        }

        /**
     * notFound Helper method for sending a Not Found response code and default JSON output
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @return {json}
     */
        static notFound(req, res) {
            return res
                .status(404)
                .json(ResponseHelper.defaultErrorResponse("NOT FOUND"));
        }
    }

    return ResponseHelper;
}
