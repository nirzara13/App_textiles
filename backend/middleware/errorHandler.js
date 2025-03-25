export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: process.env.NODE_ENV === 'production' 
        ? 'Une erreur est survenue' 
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  };