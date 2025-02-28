const express = require('express');
const { createTodo, getAllTodos, markTodoDone } = require('../controllers/todoController');

const router = express.Router();

router.post('/', createTodo);    
router.get('/', getAllTodos);       
router.patch('/:id/done', markTodoDone); 

module.exports = router;
