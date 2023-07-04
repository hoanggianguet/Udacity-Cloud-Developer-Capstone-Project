import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();

const logger = createLogger('TodosAccess');

export class TodosAccess {
    constructor(
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos');

        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };

        const result = await docClient.query(params).promise();

        return result.Items as TodoItem[];
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.debug('Create new todo');

        await docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();

        return todo as TodoItem;
    }

    async updateTodo(todoId: string, userId: string, model: TodoUpdate): Promise<TodoItem> {
        logger.debug('Update todo');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: "set #todoName = :todoName, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: { '#todoName': "name" },
            ExpressionAttributeValues: {
                ":todoName": model.name,
                ":dueDate": model.dueDate,
                ":done": model.done
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await docClient.update(params).promise();

        return result.Attributes as TodoItem;
    }

    async deleteTodo(todoId: string, userId: string): Promise<any> {
        console.log("Deleting todo");

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
        };

        return await docClient.delete(params).promise();
    }

    async updateAttachmentForTodo(todoId: string, userId: string, attachmentUrl: string): Promise<TodoItem> {
        logger.debug('Update attachment');

        const params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: "set attachmentUrl = :url",
            ExpressionAttributeValues: {
                ":url": attachmentUrl
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await docClient.update(params).promise();

        return result.Attributes as TodoItem;
    }

    async getTodosFinished(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos finished');

        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'done = :done',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':done': true,
            }
        }

        const result = await docClient.query(params).promise();
        return result.Items as TodoItem[];
    }

    async getTodosNotFinished(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos not finished');

        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'done = :done',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':done': false,
            }
        }

        const result = await docClient.query(params).promise();
        return result.Items as TodoItem[];
    }

    async getTodosPriorityDesc(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos for user sorted by priority descending');

        const params = {
            TableName: this.todosTable,
            IndexName: 'PriorityIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        };

        const result = await docClient.query(params).promise();

        return result.Items as TodoItem[];
    }

    async getTodosPriorityAsc(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos for user sorted by priority ascending');

        const params = {
            TableName: this.todosTable,
            IndexName: 'PriorityIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: true
        };

        const result = await docClient.query(params).promise();

        return result.Items as TodoItem[];
    }

    async getTodosDueDateAsc(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos sort by due date Ascending');

        const params = {
            TableName: this.todosTable,
            IndexName: 'DueDateIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: true
        };

        const result = await docClient.query(params).promise();

        return result.Items as TodoItem[];
    }

    async getTodosDueDateDesc(userId: string): Promise<TodoItem[]> {
        logger.debug('Getting all todos sort by due date Descending');

        const params = {
            TableName: this.todosTable,
            IndexName: 'DueDateIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        };

        const result = await docClient.query(params).promise();

        return result.Items as TodoItem[];
    }
}