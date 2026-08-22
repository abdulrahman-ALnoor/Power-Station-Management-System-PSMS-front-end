import React, { type ErrorInfo, type ReactNode } from 'react'

interface DebugBoundaryProps {
 children: ReactNode
}

interface DebugBoundaryState {
 hasError: boolean
 error: Error | null
 errorInfo: ErrorInfo | null
}

export class DebugBoundary extends React.Component<
 DebugBoundaryProps,
 DebugBoundaryState
> {
 constructor(props: DebugBoundaryProps) {
 super(props)

 this.state = {
 hasError: false,
 error: null,
 errorInfo: null,
 }
 }

 static getDerivedStateFromError(
 error: Error,
 ): Partial<DebugBoundaryState> {
 return {
 hasError: true,
 error,
 }
 }

 componentDidCatch(
 error: Error,
 errorInfo: ErrorInfo,
 ): void {
 console.error('DebugBoundary caught an error:', error)
 console.error('Component stack:', errorInfo.componentStack)

 this.setState({
 errorInfo,
 })
 }

 render() {
 if (this.state.hasError) {
 return (
 <div
 style={{
 padding: '20px',
 background: '#dc2626',
 color: '#ffffff',
 minHeight: '100vh',
 position: 'relative',
 zIndex: 9999,
 }}
 >
 <h1>Something went wrong.</h1>

 <details
 open
 style={{
 whiteSpace: 'pre-wrap',
 marginTop: '16px',
 }}
 >
 <summary>Error details</summary>

 <div style={{ marginTop: '12px' }}>
 {this.state.error?.toString()}
 </div>

 {this.state.errorInfo?.componentStack && (
 <div style={{ marginTop: '12px' }}>
 {this.state.errorInfo.componentStack}
 </div>
 )}
 </details>
 </div>
 )
 }

 return this.props.children
 }
}