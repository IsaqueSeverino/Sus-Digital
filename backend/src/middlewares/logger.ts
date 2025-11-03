import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const inicio = Date.now(); 

  res.on('finish', () => {
    const duracao = Date.now() - inicio; 
    const log = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duracao}ms - ${new Date().toISOString()}`;
    console.log(log);
  });

  next(); 
};

export default logger;

