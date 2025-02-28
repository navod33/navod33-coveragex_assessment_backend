const { Todo } = require('../models');
const Joi = require('joi');

// Joi Validation Schema
const todoSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  isDone: Joi.boolean(),
});

// Create a Todo
exports.createTodo = async (req, res) => {
  try {
    const { error } = todoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const newTodo = await Todo.create(req.body);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all Todos
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { isDone: false }, 
      order: [['createdAt', 'DESC']], 
      limit: 5, 
    });

    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Mark Todo as Done
exports.markTodoDone = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id', id);
    const todo = await Todo.findByPk(id);

    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    await todo.update({ isDone: true });

    res.status(200).json({ message: 'Todo marked as done', todo });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
