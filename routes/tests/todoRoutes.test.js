const request = require('supertest');
const { app } = require('../../app');
const db = require('../../models/index');

// Ensure DB is ready before tests run
beforeAll(async () => {
  await db.sequelize.sync();
});

describe('Todo API Integration Tests', () => {
  let todoId;

  test('POST /api/todo - Create a new Todo', async () => {
    const response = await request(app)
      .post('/api/todo')
      .send({ name: 'Integration Test', description: 'Testing API', isDone: false });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    todoId = response.body.id;
  });

  test('GET /api/todo - Get all Todos', async () => {
    const response = await request(app).get('/api/todo');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('PATCH /api/todo/:id/done - Mark Todo as Done', async () => {
    const response = await request(app).patch(`/api/todo/${todoId}/done`);
    expect(response.statusCode).toBe(200);
    expect(response.body.todo.isDone).toBe(true);
  });

  test('PATCH /api/todo/:id/done - Mark Non-existing Todo', async () => {
    const response = await request(app).patch('/api/todo/9999/done');
    expect(response.statusCode).toBe(404);
  });
});
