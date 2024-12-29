const db = require("../config/database");

class Todo {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.description = data.description;
    this.is_completed = data.is_completed === 1;
    this.created_at = data.created_at;
    this.completed_at = data.completed_at;
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query("SELECT * FROM todos WHERE user_id = ?", [userId]);
      return rows.map(row => new Todo(row));
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Error fetching user todos: " + error.message);
    }
  }

  static async create(todoData) {
    const { user_id, description } = todoData;

    try {
      const [result] = await db.query(
        `INSERT INTO todos (user_id, description, is_completed, created_at) VALUES (?, ?, ?, NOW())`,
        [user_id, description, false]
      );

      const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);

      if (rows.length === 0) {
        throw new Error("Todo creation failed.");
      }

      return new Todo(rows[0]);
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Error creating new todo: " + error.message);
    }
  }

  static async update(todoId, updateData) {
    try {
      const updateFields = [];
      const updateValues = [];

      if (updateData.description !== undefined) {
        updateFields.push("description = ?");
        updateValues.push(updateData.description);
      }

      if (updateData.is_completed !== undefined) {
        updateFields.push("is_completed = ?");
        updateValues.push(updateData.is_completed ? 1 : 0);
        
        if (updateData.is_completed) {
          updateFields.push("completed_at = NOW()");
        } else {
          updateFields.push("completed_at = NULL");
        }
      }

      if (updateFields.length === 0) {
        throw new Error("No update fields provided");
      }

      updateValues.push(todoId);

      const query = `UPDATE todos SET ${updateFields.join(", ")} WHERE id = ?`;
      const [result] = await db.query(query, updateValues);

      if (result.affectedRows === 0) {
        throw new Error("Todo not found or no changes made");
      }

      const [rows] = await db.query("SELECT * FROM todos WHERE id = ?", [todoId]);

      if (rows.length === 0) {
        throw new Error("Updated todo not found");
      }

      return new Todo(rows[0]);
    } catch (error) {
      console.error("Database error in update:", error);
      throw new Error("Error updating todo: " + error.message);
    }
  }

  static async delete(todoId) {
    try {
      const [result] = await db.query("DELETE FROM todos WHERE id = ?", [todoId]);

      if (result.affectedRows === 0) {
        throw new Error("Todo not found or could not be deleted");
      }

      return { message: "Todo deleted successfully" };
    } catch (error) {
      console.error("Database error in delete:", error);
      throw new Error("Error deleting todo: " + error.message);
    }
  }
}

module.exports = Todo;
