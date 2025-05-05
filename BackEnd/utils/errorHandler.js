

export class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(
            this /**instance of error being created */,
            this.constructor /**skip including this method/function in the stack trace */
        );
    }
}

export class ValidationError extends CustomError {
    constructor(statusCode, errorMessage) {
        super(statusCode || 400, errorMessage || "Bad Credentials.");

        Error.captureStackTrace(
            this, // error to be created
            this.constructor // don't include this class in the error to keep it clean
        )
    }
}

export class CastError extends CustomError {
    constructor(statusCode, errorMessage) {
        super(statusCode || 400, errorMessage || "Invalid data type provided.");

        Error.captureStackTrace(
            this, // error to be created
            this.constructor // don't include this class in the error to keep it clean
        );
    }
}


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.log(err)
    const error = {
        status: "error",
        error: message,
    }
    if (process.env.development) {
        err.stack = err.stack;
    }
    res.status(statusCode).json(error)
}

export default errorHandler;