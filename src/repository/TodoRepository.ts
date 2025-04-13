import { PrismaClient } from '@prisma/client'
import { Todo, TodoInput, TodoSearchCondition } from '../model/Todo.js'


export interface ITodoRepository {
    findById(id: string): Promise<Todo | null>
    findByConditions(conditions: TodoSearchCondition): Promise<Todo[] | null>
    save(todo: TodoInput): Promise<Todo> 
    update(input: { targetId: string, title?: string, body?: string, dueDate?: Date; completedAt?: Date }): Promise<Todo>
    delete(id: string): Promise<Todo> 
}

export class TodoRepository implements ITodoRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: string): Promise<Todo | null> {
        const record = await this.prisma.todos.findUnique({
            where: { id: id }
        });
        if (!record) return null;

        return new Todo(
            record.id,
            record.title,
            record.body,
            record.dueDate,
            record.completedAt,
            record.createdAt,
            record.updatedAt
        )
    }

    async findByConditions(conditions: TodoSearchCondition): Promise<Todo[] | null> {
        const { title, body, dueFrom, dueTo, completed } = conditions;

        const records = await this.prisma.todos.findMany({
            where: {
                ...(title ? { title: { contains: title as string } } : {}),
                ...(body ? { body: { contains: body as string } } : {}),
                ...(completed === 'true'
                    ? { completedAt: { not: null } }
                    : completed === 'false'
                    ? { completedAt: null }
                    : {}
                ),
                ...(dueFrom || dueTo
                    ? {
                        dueDate: {
                            ...(dueFrom ? { gte: new Date(dueFrom as string) } : {}),
                            ...(dueTo ? { lte: new Date(dueTo as string) } : {}),
                        }
                      }
                    : {}
                ),
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!records) return null;

        return records.map((record) => {
            return new Todo (
                record.id,
                record.title,
                record.body,
                record.dueDate,
                record.completedAt,
                record.createdAt,
                record.updatedAt
            )
        });
    }

    async save(todo: TodoInput): Promise<Todo> {
        const {title, body, dueDate, completedAt} = todo;
        
        const newRecord = await this.prisma.todos.create({
            data: {
                title: title as string ?? null,
                body: body ?? null,
                dueDate: dueDate ? new Date(dueDate) : null,
                completedAt: completedAt ? new Date(completedAt) : null,
            }
        });

        return new Todo (
            newRecord.id,
            newRecord.title,
            newRecord.body,
            newRecord.dueDate,
            newRecord.completedAt,
            newRecord.createdAt,
            newRecord.updatedAt
        );
    }

    async update(input: { targetId: string, title?: string, body?: string, dueDate?: Date; completedAt?: Date }): Promise<Todo> {
        const { targetId, title, body, dueDate, completedAt } = input;
        console.log(targetId, title, body, dueDate, completedAt)
        const updatedRecord = await this.prisma.todos.update({
            where: { id: targetId },
            data
            : {
                ...(title? { title: title } : {}),
                ...(body !== undefined ? { body: body } : {}),
                ...(dueDate !== undefined
                    ? { dueDate: dueDate ? new Date(dueDate) : null }
                    : {}
                ),
                ...(completedAt !== undefined
                    ? { completedAt: completedAt ? new Date(completedAt) : null }
                    : {}
                ),
            }
        });
        
        return new Todo (
            updatedRecord.id,
            updatedRecord.title,
            updatedRecord.body,
            updatedRecord.dueDate,
            updatedRecord.completedAt,
            updatedRecord.createdAt,
            updatedRecord.updatedAt
        );
    }

    async delete(id: string): Promise<Todo> {
        const deletedTodo = await this.prisma.todos.delete({
            where: { id: id }
        });
        return deletedTodo;
    }
}