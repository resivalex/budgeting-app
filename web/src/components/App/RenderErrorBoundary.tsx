import { Component, ReactNode } from 'react'

interface Props {
  onForceRefresh: () => Promise<void>
  children: ReactNode
}

interface State {
  error: Error | null
  refreshAttempted: boolean
}

export default class RenderErrorBoundary extends Component<Props, State> {
  state: State = { error: null, refreshAttempted: false }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch() {
    if (this.state.refreshAttempted) return

    this.props.onForceRefresh().then(
      () => this.setState({ error: null, refreshAttempted: true }),
      () => this.setState({ refreshAttempted: true }),
    )
  }

  render() {
    const { error, refreshAttempted } = this.state

    if (!error) return this.props.children
    if (!refreshAttempted) return <SyncingSpinner />
    return <ErrorDetails error={error} />
  }
}

function SyncingSpinner() {
  return (
    <div style={centerStyle}>
      <progress className="progress is-info" max="100" style={{ width: '200px' }}>
        15%
      </progress>
      <p className="mt-3 has-text-grey">Синхронизация данных</p>
    </div>
  )
}

function ErrorDetails({ error }: { error: Error }) {
  return (
    <div className="container p-4">
      <div className="notification is-danger is-light">
        <p className="title is-5">Возникла ошибка</p>
        <pre style={preStyle}>
          {error.name}: {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </div>
    </div>
  )
}

const centerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
}

const preStyle: React.CSSProperties = {
  maxHeight: '60vh',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}
