const logger = (req, res, next) => {
  const start = Date.now();
  
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${new Date().toISOString()}`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

module.exports = logger;
