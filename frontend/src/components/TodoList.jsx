// frontend/src/components/TodoList.jsx
import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ pendingTodos, completedTodos, isLoading, error, toggleTodoStatus, deleteTodo }) {
  if (isLoading) {
    return (
      <div role="alert" className="alert alert-info shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error: {error}</span>
      </div>
    );
  }


  return (
    <div className="mt-8">
      {/* ส่วนแสดงผลงานที่ยังไม่เสร็จ */}
      <h2 className="text-2xl font-semibold mb-4 text-primary">Pending Tasks</h2>
      {pendingTodos.length === 0 ? (
        <div className="alert alert-success shadow-lg mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>All tasks completed! Or add a new one.</span>
        </div>
      ) : (
        <ul className="space-y-4 mb-8">
          {pendingTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodoStatus={toggleTodoStatus}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      )}

      {/* ส่วนแสดงผลงานที่เสร็จแล้ว */}
      <h2 className="text-2xl font-semibold mb-4 text-success">Completed Tasks</h2>
      {completedTodos.length === 0 ? (
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>No completed tasks yet.</span>
        </div>
      ) : (
        <ul className="space-y-4">
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodoStatus={toggleTodoStatus}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}