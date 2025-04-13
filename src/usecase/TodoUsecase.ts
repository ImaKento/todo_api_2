import { Todo, TodoInput, TodoSearchCondition } from '../model/Todo.js';
import { ITodoRepository } from '../repository/TodoRepository.js';

export interface ITodoUsecase {
    getTodos(input: { title?: string, body?: string, dueFrom?: string, dueTo?: string, completed?: string }): Promise<Todo[] | null>
    getTodoById(id: string): Promise<Todo | null>
    createTodo(input: { title: string; body?: string; dueDate?: Date; completedAt?: Date }): Promise<Todo>
    updatedTodo(input: { targetId: string, title?: string, body?: string, dueDate?: Date; completedAt?: Date }): Promise<Todo>
    deleteTodo(id: string): Promise<Todo>
}

export class TodoUsecase {
    constructor(private readonly todoRepo: ITodoRepository) {}

    getTodos(input: { title?: string, body?: string, dueFrom?: string, dueTo?: string, completed?: string }): Promise<Todo[] | null> {
        const conditions: TodoSearchCondition = {
                    title: input.title ?? null,
                    body: input.body ?? null,
                    dueFrom: input.dueFrom ?? null,
                    dueTo: input.dueTo ?? null,
                    completed: input.completed ?? null
                }
        return this.todoRepo.findByConditions(conditions);
    }

    getTodoById(id: string): Promise<Todo | null> {
        return this.todoRepo.findById(id);
    }

    createTodo(input: { title: string; body?: string; dueDate?: Date; completedAt?: Date }): Promise<Todo> {
        const todoInput: TodoInput = {
            title: input.title,
            body: input.body ?? undefined,
            dueDate: input.dueDate ?? undefined,
            completedAt: input.completedAt ?? undefined
        }
        return this.todoRepo.save(todoInput);
    }

    updatedTodo(input: { targetId: string, title?: string, body?: string, dueDate?: Date; completedAt?: Date }): Promise<Todo> {
        return this.todoRepo.update(input);
    }

    deleteTodo(id: string): Promise<Todo> {
        return this.todoRepo.delete(id);
    }
}