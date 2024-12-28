const handleError = (res,statusCode,message)=>{

    console.error(`Error ${statusCode} : ${message}`);

    return res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode,
          message: message,
        },
      });
    };
export default handleError;
