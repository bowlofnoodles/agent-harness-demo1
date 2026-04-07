import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskCard } from '@/components/task-card'
import type { Task, TaskStatus } from '@/types/task'

interface TaskColumnProps {
  label: string
  tasks: Task[]
  onUpdateStatus: (id: string, status: TaskStatus) => void
  onDeleteTask: (id: string) => void
}

export function TaskColumn({
  label,
  tasks,
  onUpdateStatus,
  onDeleteTask,
}: TaskColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {label}
          <span className="text-muted-foreground">{tasks.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No tasks
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}
