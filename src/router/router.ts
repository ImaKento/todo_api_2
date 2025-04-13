import express from 'express';
import { ITodoController } from '../controller/todoController.js'


export function createTodoRouter(controller: ITodoController): express.Router {
    const router = express.Router();
    

    router.get('/', controller.getTodos.bind(controller));
    router.post('/', controller.createTodo.bind(controller));
    router.get('/:id', controller.getTodoById.bind(controller));
    router.post('/:id/duplicate', controller.duplicateTodo.bind(controller));
    router.patch('/:id', controller.updateTodo.bind(controller));
    router.delete('/:id', controller.deleteTodo.bind(controller));
    return router
}
