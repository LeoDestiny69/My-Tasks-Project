
import React from 'react';


export default function AddTodoForm({
  newTodoTitle,
  setNewTodoTitle,
  newTodoDescription,
  setNewTodoDescription,
  newTodoDueDate,      
  setNewTodoDueDate,   
  newTodoPriority,     
  setNewTodoPriority,  
  addTodo,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Task Title</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Buy groceries"
          className="input input-bordered w-full"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          required 
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description (Optional)</span>
        </label>
        <textarea
          placeholder="Detailed description of the task"
          className="textarea textarea-bordered h-24 w-full"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
        ></textarea>
      </div>

      {/* เพิ่ม Due Date Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Due Date (Optional)</span>
        </label>
        <input
          type="datetime-local" 
          className="input input-bordered w-full"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
        />
      </div>

      {/* เพิ่ม Priority Select/Dropdown */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Priority Level</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={newTodoPriority}
          onChange={(e) => setNewTodoPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Add New Task
      </button>
    </form>
  );
}