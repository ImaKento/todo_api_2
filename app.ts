import 'dotenv/config';
import express from 'express';
import { prisma } from './src/db/prisma.js';
import { TodoRepository } from './src/repository/TodoRepository.js';
import { TodoUsecase } from './src/usecase/TodoUsecase.js';
import { TodoController } from './src/controller/todoController.js';
import { createTodoRouter } from './src/router/router.js';

const app = express();
const db = prisma;
const todoRepository = new TodoRepository(db);
const todoUsecase = new TodoUsecase(todoRepository);
const todoController = new TodoController(todoUsecase);
const todoRouter = createTodoRouter(todoController);

app.use(express.json());
app.use('/api/todos', todoRouter);

const PORT = process.env.PORT || 3000;

// Sever起動
app.listen(PORT, () => {
    console.log(`Server running at PORT: http://localhost:${PORT}`);
}).on("error", (error: Error) => {
    throw new Error(error.message);
})
