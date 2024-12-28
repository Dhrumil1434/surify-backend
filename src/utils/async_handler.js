const asyncHandler = (fn) => async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1); // Exit process with failure
    }
  };
  
  export default asyncHandler;
  