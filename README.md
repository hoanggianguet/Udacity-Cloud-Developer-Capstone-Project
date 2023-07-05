# Serverless TODO List

To implement this project, you need to implement a simple TODO application using AWS Lambda and Serverless framework. 

# Image About TODO List
Todo List App:
![Alt text](images/TodoListApp.png?raw=true "Image 6")
Sort Todo Task By Priority Descending:
![Alt text](images/SortByPriorityDescending.png?raw=true "Image 7")
Sort Todo Task By Priority Ascending:
![Alt text](images/SortByPriorityAscending.png?raw=true "Image 8")
Sort Todo Task By Due Date Descending:
![Alt text](images/SortByDueDateDescending.png?raw=true "Image 9")
Sort Todo Task By Due Date Ascending:
![Alt text](images/SortByDueDateAscending.png?raw=true "Image 10")
Sort Todo Task Completed:
![Alt text](images/GetTodoFinished.png?raw=true "Image 11")
Sort Todo Task Not Completed:
![Alt text](images/GetToDoNotFinished.png?raw=true "Image 12")
Validate Todo Task Name:
![Alt text](images/PleaseInputTaskName.png?raw=true "Image 13")
Validate Todo Task DueDate:
![Alt text](images/PleaseInputDate.png?raw=true "Image 14")
Validate Todo Task Priority:
![Alt text](images/PleaseInputPriority.png?raw=true "Image 15")
# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.
User can sort todo task by Priority, DueDae and display task has completed or not completed.
# TODO items

The application should store TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item
* `priority` (number) - priority of todo task



# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
