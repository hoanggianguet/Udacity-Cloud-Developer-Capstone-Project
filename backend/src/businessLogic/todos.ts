import { TodosAccess } from '../dataLayer/todosAcess';
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger("todos");
const todoAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function createTodo(model: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info(`Create todo for user: ${userId}`);

    const newItem: TodoItem = {} as TodoItem;
    newItem.userId = userId;
    newItem.todoId = uuidv4();
    newItem.createdAt = new Date().toISOString();
    newItem.name = model.name;
    newItem.dueDate = model.dueDate;
    newItem.priority = model.priority;
    newItem.done = false;

    return await todoAccess.createTodo(newItem);
}

export async function getTodosForUser(userId: string): Promise<any> {
    logger.info(`Get todo for user: ${userId}`);

    return await todoAccess.getTodos(userId);
}

export async function updateTodo(todoId: string, userId: string, model: UpdateTodoRequest) {
    logger.info(`Update todo id: ${todoId}`)

    await todoAccess.updateTodo(todoId, userId, model);
}

export async function deleteTodo(todoId: string, userId: string) {
    logger.info(`Delete todo id: ${todoId}`);

    await todoAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info("Create attachment presigned url: ${userId} ");

    const dbUrl: string = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`;
    const attachmentUrl: string = attachmentUtils.getSignedUrl(todoId);

    await todoAccess.updateAttachmentForTodo(todoId, userId, dbUrl);

    return attachmentUrl;
}

export async function getTodosFinished(userId: string): Promise<any> {
    logger.info('Get list todo finished: ${userId}');
    return await todoAccess.getTodosFinished(userId);
}

export async function getTodosNotFinished(userId: string): Promise<any> {
    logger.info('Get list todo not finished: ${userId}');
    return await todoAccess.getTodosNotFinished(userId);
}

export async function getTodosPriorityDesc(userId: string): Promise<any> {
    logger.info(`Get todo for user sort by Priority Descending: ${userId}`);
    return await todoAccess.getTodosPriorityDesc(userId);
}

export async function getTodosPriorityAsc(userId: string): Promise<any> {
    logger.info(`Get todo for user sort by Priority Ascending: ${userId}`);
    return await todoAccess.getTodosPriorityAsc(userId);
}

export async function getTodosDueDateAsc(userId: string): Promise<any> {
    logger.info(`Get todo sort by Due Date Ascending: ${userId}`);
    return await todoAccess.getTodosDueDateAsc(userId);
}

export async function getTodosDueDateDesc(userId: string): Promise<any> {
    logger.info(`Get todo sort by Due Date Descending: ${userId}`);
    return await todoAccess.getTodosDueDateDesc(userId);
}