// frontend/src/components/TodoItem.jsx
import React from 'react';

export default function TodoItem({ todo, toggleTodoStatus, deleteTodo }) {
  const handleToggle = () => {
    toggleTodoStatus(todo);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const formattedDate = new Date(todo.created_at).toLocaleString();

  
  const formattedDueDate = todo.due_date
    ? new Date(todo.due_date).toLocaleString('en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',   
        minute: '2-digit', 
      })
    : 'No due date';

  const priorityColorClass = {
    Low: 'text-gray-400',
    Medium: 'text-yellow-400',
    High: 'text-red-400',
  }[todo.priority || 'Medium']; 

  return (
    <li
      className={`bg-base-300 p-4 rounded-lg shadow-md flex items-center justify-between
        ${todo.status === 'Completed' ? 'opacity-70 line-through' : ''}
      `}
    >
      <div className="flex-grow">
        <h3 className={`text-lg font-medium ${todo.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-gray-400 text-sm">{todo.description}</p>
        )}
        <p className="text-gray-500 text-xs">Created: {formattedDate}</p>

        {/* แสดง Due Date และ Priority */}
        <p className="text-gray-500 text-xs mt-1">
          Due: <span className="font-semibold">{formattedDueDate}</span>
        </p>
        <p className={`text-xs font-semibold ${priorityColorClass}`}>
          Priority: {todo.priority || 'Medium'}
        </p>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {/* Toggle button */}
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={todo.status === 'Completed'}
            onChange={handleToggle}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>

        {/* Delete button */}
        <button onClick={handleDelete} className="btn btn-ghost btn-circle text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </li>
  );
}