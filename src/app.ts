import express from 'express';
import type { ErrorRequestHandler, NextFunction, RequestHandler, Request, Response } from 'express';
import modeConfigurationsRouter from './mode-configurations/mode-configurations.route.js';
import { addRequestId } from './middleware/request-id.js';

const app = express();
app.use(express.json());
app.use(addRequestId);

app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.use('/mode-configurations', modeConfigurationsRouter);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
  });
};
app.use(errorHandler);

const notFoundHandler: RequestHandler = (_req: Request, res: Response, _next: NextFunction) => {
  res.sendStatus(404);
};
app.use(notFoundHandler);

export default app;
