export class Todo {
    constructor (
        public readonly id: string,
        public title: string,
        public body: string | null,
        public dueDate: Date | null,
        public completedAt: Date | null,
        public createdAt: Date,
        public updatedAt: Date | null,
     ) {}
}

export interface TodoInput {
    title: string,
    body: string | undefined,
    dueDate: Date | undefined,
    completedAt: Date | undefined,
}

export interface TodoSearchCondition {
    title?: string | null;
    body?: string | null;
    dueFrom?: string | null;
    dueTo?: string | null;
    completed?: string | null;
}
