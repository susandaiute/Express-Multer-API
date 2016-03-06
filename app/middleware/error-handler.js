'use strict';

const errorHandler = (error, request, response, next) => {
  //jshint unused:false
  const errorResponse = {
    error: {
      message: error.message,
    },
  };

  // include stacktrace
  if (request.app.get('env') === 'development') {
    errorResponse.error.error = error;
  }

  response.status(error.status || 500).json(errorResponse);
};

module.exports = errorHandler;
