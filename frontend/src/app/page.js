'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';

// กำหนด URL ของ Backend ตามสภาพแวดล้อม
// ถ้าโค้ดกำลังรันบน Server (ใน Docker) ให้ใช้ BACKEND_URL_INTERNAL
// ถ้าโค้ดกำลังรันบน Client (ใน Browser) ให้ใช้ NEXT_PUBLIC_BACKEND_URL
const getBackendUrl = () => {
  if (typeof window === 'undefined') {
    // กำลังรันบน Server (Next.js server-side rendering)
    // ใช้ URL ภายใน Docker network
    return process.env.BACKEND_URL_INTERNAL;
  } else {
    // กำลังรันบน Client (Browser)
    // ใช้ URL ที่ Browser สามารถเข้าถึงได้ (localhost บน Host machine)
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
};

const BACKEND_URL = getBackendUrl(); // กำหนดค่า BACKEND_URL จากฟังก์ชัน

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  // --- เพิ่ม State ใหม่สำหรับ Due Date และ Priority ---
  const [newTodoDueDate, setNewTodoDueDate] = useState(''); // เก็บค่าวันที่ในรูปแบบ YYYY-MM-DD
  const [newTodoPriority, setNewTodoPriority] = useState('Medium'); // ค่าเริ่มต้นเป็น 'Medium'
  // ---------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // --- ฟังก์ชัน fetchTodos (ดึงข้อมูล To-Do ทั้งหมด) ---
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined!");
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
      // Backend ของเราใช้ `is_completed` เป็น boolean, แปลงให้เป็น `status` ที่ Frontend เข้าใจ
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

  // --- ฟังก์ชัน addTodo (เพิ่ม To-Do ใหม่) ---
  const addTodo = async () => {
    if (!newTodoTitle.trim()) {
      console.warn('Task title cannot be empty!');
      setError('Task title cannot be empty!');
      return;
    }

    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined!");
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
          // --- ส่ง Due Date และ Priority ไป Backend ---
          due_date: newTodoDueDate || null, // ส่งค่า due_date, ถ้าว่างให้เป็น null
          priority: newTodoPriority,       // ส่งค่า priority
          // ------------------------------------------
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      const addedTodo = await response.json();
      // หลังจากเพิ่มเสร็จ แปลง `is_completed` เป็น `status` ก่อนอัปเดต state
      const formattedAddedTodo = {
        ...addedTodo,
        status: addedTodo.is_completed ? 'Completed' : 'Pending'
      };
      setTodos((prevTodos) => [...prevTodos, formattedAddedTodo]);
      setNewTodoTitle('');
      setNewTodoDescription('');
      // --- รีเซ็ต State ของ Due Date และ Priority ---
      setNewTodoDueDate(''); // รีเซ็ตค่าเป็นว่างเปล่า
      setNewTodoPriority('Medium'); // รีเซ็ตกลับเป็นค่าเริ่มต้น
      // ---------------------------------------------
      console.log('Task added successfully:', addedTodo);

    } catch (err) {
      console.error("Error adding todo:", err);
      setError(err.message || "Failed to add task.");
    }
  };

  // --- ฟังก์ชัน toggleTodoStatus (เปลี่ยนสถานะ To-Do) ---
  const toggleTodoStatus = async (todo) => {
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined!");
        setError("Configuration error: Backend URL not set.");
        return;
      }
      // ส่ง `is_completed` (boolean) ไป Backend
      const updatedTodoData = { ...todo, is_completed: !todo.is_completed };
      const response = await fetch(`${BACKEND_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: updatedTodoData.is_completed }), // ส่งแค่ is_completed ไป
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
      }

      const data = await response.json();
      // หลังจากอัปเดต แปลง `is_completed` เป็น `status` ก่อนอัปเดต state
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

  // --- ฟังก์ชัน deleteTodo (ลบ To-Do) ---
  const deleteTodo = async (id) => {
    try {
      if (!BACKEND_URL) {
        console.error("Backend URL is not defined!");
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

  // --- Filter and Sort Logic ด้วย useMemo ---
  // จะทำการคำนวณใหม่เมื่อ `todos` state เปลี่ยนแปลงเท่านั้น
  const { pendingTasks, completedTasks } = useMemo(() => {
    // สร้างสำเนาของ todos ก่อนทำการ sort เพื่อไม่ให้กระทบ todos state โดยตรง
    const sortedTodos = [...todos].sort((a, b) => {
      // ตรวจสอบให้แน่ใจว่า created_at มีค่าและเป็น string ที่ Date constructor เข้าใจ
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA - dateB; // เรียงจากเก่าไปใหม่ (ascending)
      // ถ้าอยากเรียงจากใหม่ไปเก่า (descending): return dateB - dateA;
    });

    // กรองงานตามสถานะ
    const pending = sortedTodos.filter(todo => todo.status === 'Pending');
    const completed = sortedTodos.filter(todo => todo.status === 'Completed');

    return { pendingTasks: pending, completedTasks: completed };
  }, [todos]); // Dependency array: useMemo จะ re-run เมื่อ `todos` เปลี่ยนแปลง

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center">
      <Navbar />

      {/* เพิ่ม mt-16 เพื่อดันเนื้อหาลงมาให้พ้น Navbar */}
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl p-8 my-8 mt-16">
        <Header />

        <AddTodoForm
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          newTodoDescription={newTodoDescription}
          setNewTodoDescription={setNewTodoDescription}
          // --- ส่ง Props ใหม่ให้ AddTodoForm ---
          newTodoDueDate={newTodoDueDate}
          setNewTodoDueDate={setNewTodoDueDate}
          newTodoPriority={newTodoPriority}
          setNewTodoPriority={setNewTodoPriority}
          // ------------------------------------
          addTodo={addTodo}
        />

        {/* ส่ง tasks ที่ถูก Filter และ Sort ไปยัง TodoList */}
        <TodoList
          pendingTodos={pendingTasks}    // ส่งรายการงานที่ยังไม่เสร็จ
          completedTodos={completedTasks} // ส่งรายการงานที่เสร็จแล้ว
          isLoading={isLoading}
          error={error}
          toggleTodoStatus={toggleTodoStatus}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  );
}