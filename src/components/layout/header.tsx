export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <h1 className="text-xl font-semibold text-foreground">Task Board</h1>
        <p className="text-sm text-muted-foreground">
          A simple task management demo
        </p>
      </div>
    </header>
  )
}
