const Todo = require("../models/todo");

class TodoController {
  async getUserTodos(req, res) {
    try {
      const userId = req.user.id;
      const todos = await Todo.findByUserId(userId);
      res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      console.error("Error in getUserTodos:", error);
      res.status(500).json({
        success: false,
        error: "Error fetching todos",
        message: error.message,
      });
    }
  }

  async createTodo(req, res) {
    try {
      const { description } = req.body;

      if (!description || description.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Description is required and cannot be empty",
        });
      }

      const todoData = {
        user_id: req.user.id,
        description: description.trim(),
      };

      const newTodo = await Todo.create(todoData);
      res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: newTodo,
      });
    } catch (error) {
      console.error("Error in createTodo:", error);
      res.status(500).json({
        success: false,
        error: "Error creating todo",
        message: error.message,
      });
    }
  }

  async updateTodo(req, res) {
    try {
      const todoId = req.params.id;
      const { description, is_completed } = req.body;

      if (description === undefined && is_completed === undefined) {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "No update data provided",
        });
      }

      if (description !== undefined && description.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "Description cannot be empty",
        });
      }

      const updateData = {};
      if (description !== undefined) {
        updateData.description = description.trim();
      }
      if (is_completed !== undefined) {
        updateData.is_completed = is_completed;
      }

      const updatedTodo = await Todo.update(todoId, updateData);
      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (error) {
      console.error("Error in updateTodo:", error);
      res.status(500).json({
        success: false,
        error: "Error updating todo",
        message: error.message,
      });
    }
  }

// controllers/todoController.js
async deleteTodo(req, res) {
    try {
      const todoId = req.params.id;
      const deletedTodo = await Todo.delete(todoId, req);
  
      res.status(200).json({
        success: true,
        message: deletedTodo.message,
      });
    } catch (error) {
      console.error("Error in deleteTodo:", error);
      res.status(500).json({
        success: false,
        error: "Error deleting todo",
        message: error.message,
      });
    }
  }
  
}

module.exports = new TodoController();
