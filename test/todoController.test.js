const { createTodo, getAllTodos, markTodoDone } = require('../controllers/todoController');
const Todo = require('../models/todo.model');
const httpMocks = require('node-mocks-http');
const { jest } = require('@jest/globals');


// Mocking the database model
jest.mock('../models/todo.model', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

describe('Todo Controller Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTodo - success', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { name: 'Test Task', description: 'Test Description', isDone: false },
    });
    const res = httpMocks.createResponse();
    
    Todo.create.mockResolvedValue(req.body);
    
    await createTodo(req, res);
    
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('createTodo - validation error', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: { name: '', description: '' },
    });
    const res = httpMocks.createResponse();
    
    await createTodo(req, res);
    
    expect(res.statusCode).toBe(400);
  });

  test('getAllTodos - success', async () => {
    const todosMock = [{ id: 1, name: 'Task 1', description: 'Test', isDone: false }];
    Todo.findAll.mockResolvedValue(todosMock);
    
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    
    await getAllTodos(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(todosMock);
  });

  test('markTodoDone - success', async () => {
    const todoMock = { update: jest.fn(), id: 1, name: 'Test Task', isDone: false };
    Todo.findByPk.mockResolvedValue(todoMock);
    todoMock.update.mockResolvedValue({ isDone: true });

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    await markTodoDone(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty('message', 'Todo marked as done');
  });

  test('markTodoDone - not found', async () => {
    Todo.findByPk.mockResolvedValue(null);

    const req = httpMocks.createRequest({ params: { id: 1 } });
    const res = httpMocks.createResponse();

    await markTodoDone(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toHaveProperty('error', 'Todo not found');
  });
});

