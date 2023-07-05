import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Label,
  Dropdown
} from 'semantic-ui-react'

import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  getTodosFinished,
  getTodosNotFinished,
  getTodosSortByPriorityDesc,
  getTodosSortByPriorityAsc,
  getTodosSortByDueDateAsc,
  getTodosSortByDueDateDesc
} from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
  dueDate: string
  priority: number
  initialDate: Date
  resetDate: boolean
}

const priorityOptions = [
  {
    key: 'Low Priority',
    text: 'Low Priority',
    value: 1
  },
  {
    key: 'Medium Priority',
    text: 'Medium Priority',
    value: 2
  },
  {
    key: 'High Priority',
    text: 'High Priority',
    value: 3
  }
]

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    dueDate: '',
    priority: 0,
    initialDate: new Date(),
    resetDate: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      if (this.state.newTodoName.trim() === '') {
        alert('Please input task name')
        return
      }
      if (this.state.dueDate === '') {
        alert('Please input due date')
        return
      }
      if (this.state.priority === 0) {
        alert('Please select task priority')
        return
      }
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate: this.state.dueDate,
        priority: this.state.priority
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: '',
        priority: 0,
        dueDate: '',
        resetDate: true
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter((todo) => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onGetTodoFinished = async () => {
    try {
      const todos = await getTodosFinished(this.props.auth.getIdToken())
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onGetTodoNotFinished = async () => {
    try {
      const todos = await getTodosNotFinished(this.props.auth.getIdToken())
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onSortByPriorityDesc = async () => {
    try {
      const todos = await getTodosSortByPriorityDesc(
        this.props.auth.getIdToken()
      )
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onSortByPriorityAsc = async () => {
    try {
      const todos = await getTodosSortByPriorityAsc(
        this.props.auth.getIdToken()
      )
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onSortByDueDateAsc = async () => {
    try {
      const todos = await getTodosSortByDueDateAsc(this.props.auth.getIdToken())
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onSortByDueDateDesc = async () => {
    try {
      const todos = await getTodosSortByDueDateDesc(
        this.props.auth.getIdToken()
      )
      this.setState({
        todos: todos
      })
    } catch {
      alert('Todo Not found')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  handleDateChange = (event: React.SyntheticEvent | undefined, data: any) => {
    const valueDate = dateFormat(data.value, 'yyyy-mm-dd')
    this.setState({ dueDate: valueDate })
    console.log(valueDate)
  }

  handlePriorityChange = (
    event: React.SyntheticEvent | undefined,
    data: any
  ) => {
    this.setState({ priority: data.value })
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid>
        <Grid.Row columns="three">
          <Grid.Column width={9}>
            <Label>Task Name</Label>
          </Grid.Column>
          <Grid.Column width={3}>
            <Label>Due Date</Label>
          </Grid.Column>
          <Grid.Column width={2}>
            <Label>Priority </Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns="three">
          <Grid.Column width={9}>
            <Input
              action={{
                color: 'teal',
                labelPosition: 'left',
                icon: 'add',
                content: 'New task',
                onClick: this.onTodoCreate
              }}
              fluid
              actionPosition="left"
              placeholder="To change the world..."
              value={this.state.newTodoName}
              onChange={this.handleNameChange}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <SemanticDatepicker
              onChange={this.handleDateChange}
              value={
                this.state.resetDate === true
                  ? this.state.initialDate
                  : undefined
              }
            />
          </Grid.Column>
          <Grid.Column width={2}>
            <Dropdown
              placeholder="Select priority"
              fluid
              selection
              onChange={this.handlePriorityChange}
              options={priorityOptions}
              value={this.state.priority}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Button
            icon
            color="orange"
            onClick={() => this.onSortByPriorityDesc()}
          >
            Sort By Priority Descending
          </Button>
          <Button
            icon
            color="orange"
            onClick={() => this.onSortByPriorityAsc()}
          >
            Sort By Priority Ascending
          </Button>
          <Button icon color="orange" onClick={() => this.onSortByDueDateAsc()}>
            Sort By DueDate Ascending
          </Button>
          <Button
            icon
            color="orange"
            onClick={() => this.onSortByDueDateDesc()}
          >
            Sort By DueDate Descending
          </Button>
          <Button icon color="orange" onClick={() => this.onGetTodoFinished()}>
            Get todo Finish
          </Button>
          <Button
            icon
            color="orange"
            onClick={() => this.onGetTodoNotFinished()}
          >
            Get todo Not Finish
          </Button>
        </Grid.Row>
      </Grid>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={9} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {priorityOptions.filter(
                  (element) => element.value === todo.priority
                ) !== null
                  ? priorityOptions.filter(
                      (element) => element.value === todo.priority
                    )[0]['text']
                  : ''}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
