import { createApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const app = createApp();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;
export { server };
