// frontend/pages/index.js

'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';

// ใช้ public environment variable สำหรับ Backend URL โดยตรง
// ค่านี้มาจาก NEXT_PUBLIC_BACKEND_URL ใน build args ของ docker-compose.yml
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState(''); 
  const [newTodoPriority, setNewTodoPriority] = useState('Medium'); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined! Check NEXT_PUBLIC_BACKEND_URL.");
        setError("Configuration error: Backend URL not set.");
        setIsLoading(false);
        return;
      }
      console.log('Fetching todos from:', `${BACKEND_URL}/todos`);
      const response = await fetch(`${BACKEND_URL}/todos`, { cache: 'no-store' });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }
      const data = await response.json();
      const formattedData = data.map(todo => ({
        ...todo,
        status: todo.is_completed ? 'Completed' : 'Pending'
      }));
      setTodos(formattedData);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.message || "Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim()) {
      console.warn('Task title cannot be empty!');
      setError('Task title cannot be empty!');
      return;
    }

    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined! Check NEXT_PUBLIC_BACKEND_URL.");
        setError("Configuration error: Backend URL not set.");
        return;
      }
      console.log('Adding todo to:', `${BACKEND_URL}/todos`);
      const response = await fetch(`${BACKEND_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription,
          due_date: newTodoDueDate || null,
          priority: newTodoPriority,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      const addedTodo = await response.json();
      const formattedAddedTodo = {
        ...addedTodo,
        status: addedTodo.is_completed ? 'Completed' : 'Pending'
      };
      setTodos((prevTodos) => [...prevTodos, formattedAddedTodo]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoDueDate(''); 
      setNewTodoPriority('Medium'); 
      console.log('Task added successfully:', addedTodo);

    } catch (err) {
      console.error("Error adding todo:", err);
      setError(err.message || "Failed to add task.");
    }
  };

  const toggleTodoStatus = async (todo) => {
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined! Check NEXT_PUBLIC_BACKEND_URL.");
        setError("Configuration error: Backend URL not set.");
        return;
      }
      const updatedTodoData = { ...todo, is_completed: !todo.is_completed };
      const response = await fetch(`${BACKEND_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: updatedTodoData.is_completed }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      const data = await response.json();
      const formattedData = {
        ...data,
        status: data.is_completed ? 'Completed' : 'Pending'
      };
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? formattedData : t))
      );
      console.log('Task status toggled:', data);
    } catch (err) {
      console.error('Error toggling todo status:', err);
      setError(err.message || 'Failed to toggle task status.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined! Check NEXT_PUBLIC_BACKEND_URL.");
        setError("Configuration error: Backend URL not set.");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      console.log('Task deleted successfully:', id);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete task.');
    }
  };

  const { pendingTasks, completedTasks } = useMemo(() => {
    const sortedTodos = [...todos].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA - dateB; 
    });

    const pending = sortedTodos.filter(todo => todo.status === 'Pending');
    const completed = sortedTodos.filter(todo => todo.status === 'Completed');

    return { pendingTasks: pending, completedTasks: completed };
  }, [todos]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center">
      <Navbar />

      <div className="card w-full max-w-2xl bg-base-100 shadow-xl p-8 my-8 mt-16">
        <Header />

        <AddTodoForm
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          newTodoDescription={newTodoDescription}
          setNewTodoDescription={setNewTodoDescription}
          newTodoDueDate={newTodoDueDate}
          setNewTodoDueDate={setNewTodoDueDate}
          newTodoPriority={newTodoPriority}
          setNewTodoPriority={setNewTodoPriority}
          addTodo={addTodo}
        />

        <TodoList
          pendingTodos={pendingTasks}
          completedTodos={completedTasks}
          isLoading={isLoading}
          error={error}
          toggleTodoStatus={toggleTodoStatus}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  );
}