import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the task board with initial tasks', () => {
    render(<App />)
    expect(screen.getByText('Task Board')).toBeInTheDocument()
    expect(screen.getByText('Setup project structure')).toBeInTheDocument()
    expect(screen.getByText('Add authentication')).toBeInTheDocument()
    expect(screen.getByText('Build dashboard page')).toBeInTheDocument()
  })

  it('opens add task dialog and creates a new task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText('Add Task'))
    expect(screen.getByText('Add New Task')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Enter task title...'), 'New test task')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(screen.getByText('New test task')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('Add authentication')).toBeInTheDocument()

    // Find the task card containing "Add authentication" and click its Delete button
    const taskText = screen.getByText('Add authentication')
    const taskCard = taskText.closest('[class*="rounded-md border"]')!
    const deleteButton = taskCard.querySelector('button:last-child')!
    await user.click(deleteButton)

    expect(screen.queryByText('Add authentication')).not.toBeInTheDocument()
  })
})
