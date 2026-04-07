import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Task, TaskStatus } from '@/types/task'

const nextStatus: Record<TaskStatus, TaskStatus> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
}

const statusLabel: Record<TaskStatus, string> = {
  'todo': 'Start',
  'in-progress': 'Complete',
  'done': 'Restart',
}

interface TaskCardProps {
  task: Task
  onUpdateStatus: (id: string, status: TaskStatus) => void
  onDeleteTask: (id: string) => void
}

export function TaskCard({ task, onUpdateStatus, onDeleteTask }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{task.title}</p>
        <Badge variant="secondary" className="mt-1 text-xs">
          {task.status}
        </Badge>
      </div>
      <div className="ml-2 flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateStatus(task.id, nextStatus[task.status])}
        >
          {statusLabel[task.status]}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
