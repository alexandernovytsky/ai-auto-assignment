import 'reflect-metadata';
import './container.js';
import app from './app.js';

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`validator service listening on :${port}`));
