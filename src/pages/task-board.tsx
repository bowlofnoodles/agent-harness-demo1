import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TaskColumn } from '@/components/task-column'
import { AddTaskDialog } from '@/components/add-task-dialog'
import type { Task, TaskStatus } from '@/types/task'

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in-progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
]

interface TaskBoardProps {
  tasks: Task[]
  onAddTask: (title: string) => void
  onUpdateStatus: (id: string, status: TaskStatus) => void
  onDeleteTask: (id: string) => void
}

export function TaskBoard({
  tasks,
  onAddTask,
  onUpdateStatus,
  onDeleteTask,
}: TaskBoardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">
          All Tasks ({tasks.length})
        </h2>
        <Button onClick={() => setDialogOpen(true)}>Add Task</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((col) => (
          <TaskColumn
            key={col.status}
            label={col.label}
            tasks={tasks.filter((t) => t.status === col.status)}
            onUpdateStatus={onUpdateStatus}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={onAddTask}
      />
    </div>
  )
}
