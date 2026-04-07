import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { TaskBoard } from '@/pages/task-board'
import type { Task } from '@/types/task'

const initialTasks: Task[] = [
  { id: '1', title: 'Setup project structure', status: 'done' },
  { id: '2', title: 'Add authentication', status: 'todo' },
  { id: '3', title: 'Build dashboard page', status: 'in-progress' },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = (title: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
    }
    setTasks((prev) => [...prev, task])
  }

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <TaskBoard
          tasks={tasks}
          onAddTask={addTask}
          onUpdateStatus={updateTaskStatus}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  )
}

export default App
