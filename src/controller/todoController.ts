import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../db/prisma.js'
import { ITodoUsecase } from '../usecase/TodoUsecase.js';

export interface ITodoController {
    getTodos(req: Request, res: Response): Promise<void>
    getTodoById(req: Request, res: Response): Promise<void>
    createTodo(req: Request, res: Response): Promise<void>
    duplicateTodo(req: Request, res: Response): Promise<void>
    updateTodo(req: Request, res: Response): Promise<void>
    deleteTodo(req: Request, res: Response): Promise<void>
}

export class TodoController implements ITodoController {
    constructor(private readonly todoUsecase: ITodoUsecase) {}

    async getTodos(req: Request, res: Response): Promise<void> {
        const { title, body, completed, dueFrom, dueTo } =  req.query;

        try {
            const todos = await this.todoUsecase.getTodos({
                title: title ? title as string : undefined,
                body: body ? body as string : undefined,
                completed: completed ? completed as string : undefined,
                dueFrom: dueFrom ? dueFrom as string : undefined,
                dueTo: dueTo ? dueTo as string : undefined,
            })
            if (!todos) {
                res.status(404).json({ error: 'Not found todos' });
                return;
            } 

            res.status(200).json(todos);
        } catch (error) {
            console.log('Failed to search todos: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTodoById(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;

        try {
            const todo = await this.todoUsecase.getTodoById(targetId);
            if (!todo) {
                res.status(404).json({ error: 'Todo not Found' });
                return;
            }
            res.status(200).json(todo);
        } catch (error) {
            console.log('Failed to serch todo by id: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createTodo(req: Request, res: Response): Promise<void> {
        const { title, body, dueDate, completedAt } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        try {
            const newTodo = await this.todoUsecase.createTodo({ title, body, dueDate, completedAt });
            res.status(201).json(newTodo);
        } catch (error) {
            console.log('Failed to crate todo: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async duplicateTodo(req: Request, res: Response): Promise<void> {
        const duplicatedId = req.params.id;
        try {
            const originalTodo = await this.todoUsecase.getTodoById(duplicatedId);
            if (!originalTodo) {
                res.status(404).json({ error: 'Todo not Found' });
                return;
            }
            const { title, body } = originalTodo;
            const duplicatedTodo = await this.todoUsecase.createTodo({ title: `${title}のコピー`, body: body ? body : undefined });
            res.status(201).json(duplicatedTodo);
        } catch (error) {
            console.log('Failed to duplicate todo: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateTodo(req: Request, res: Response): Promise<void> {
        const targetId = req.params.id;
        const { title, body, dueDate, completedAt } = req.body;
        try {
            const updatedTodo = await this.todoUsecase.updatedTodo({ targetId, title, body, dueDate, completedAt });
            res.json(updatedTodo);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find todo for update: ', error);
                res.status(404).json({ error: 'Todo not Found' });
                return;
            }
            console.log('Failed to update todo: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteTodo(req: Request, res: Response): Promise<void> {
        const deleteId = req.params.id;
        try {
            const deletedTodo = await this.todoUsecase.deleteTodo(deleteId);
            if (!deletedTodo) {
                res.status(404).json({ error: 'Todo not Found' });
                return;
            }
            res.json({ })
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                console.log('Failed to find todo for delete: ', error);
                res.status(404).json({ error: 'Todo not Found' });
                return;
            }
            console.log('Failed to delete todo: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}