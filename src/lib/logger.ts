import React from 'react'
import { toast } from 'sonner'

interface LogContext {
  userId?: string
  companyId?: string
  sessionId?: string
  page?: string
  component?: string
  action?: string
  [key: string]: any
}

class FrontendLogger {
  private sessionId: string
  private userId?: string
  private companyId?: string

  constructor() {
    this.sessionId = this.generateSessionId()

    // Get user context from localStorage or auth context
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        this.userId = user.userId
        this.companyId = user.companyId
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCurrentPage(): string {
    if (typeof window === 'undefined') return 'server'
    return window.location.pathname
  }

  private createLogEntry(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: LogContext) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId: this.sessionId,
      userId: this.userId,
      companyId: this.companyId,
      page: this.getCurrentPage(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...context
    }
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: LogContext) {
    const logEntry = this.createLogEntry(level, message, context)

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      const color = {
        debug: '\x1b[36m', // cyan
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m'  // red
      }[level]

      console.log(`${color}[${level.toUpperCase()}] ${message}`, logEntry)
    }

    // In production, you could send to logging service
    // this.sendToLoggingService(logEntry)
  }

  // User Interaction Logging
  logUserAction(action: string, details?: any, context?: LogContext) {
    this.log('info', `User action: ${action}`, {
      event: 'user_action',
      action,
      ...details,
      ...context
    })
  }

  logButtonClick(buttonName: string, component?: string, details?: any) {
    this.log('info', `Button clicked: ${buttonName}`, {
      event: 'button_click',
      buttonName,
      component,
      ...details
    })
  }

  logFormSubmit(formName: string, data: any, context?: LogContext) {
    this.log('info', `Form submitted: ${formName}`, {
      event: 'form_submit',
      formName,
      formDataLength: JSON.stringify(data).length,
      ...context
    })
  }

  logNavigation(from: string, to: string, context?: LogContext) {
    this.log('info', `Navigation: ${from} → ${to}`, {
      event: 'navigation',
      from,
      to,
      ...context
    })
  }

  // API Request/Response Logging
  logApiRequest(endpoint: string, method: string, data?: any, context?: LogContext) {
    this.log('info', `API Request: ${method} ${endpoint}`, {
      event: 'api_request',
      endpoint,
      method,
      requestDataLength: data ? JSON.stringify(data).length : 0,
      ...context
    })
  }

  logApiResponse(endpoint: string, method: string, status: number, duration: number, context?: LogContext) {
    this.log('info', `API Response: ${method} ${endpoint} - ${status}`, {
      event: 'api_response',
      endpoint,
      method,
      status,
      duration,
      ...context
    })
  }

  logApiError(endpoint: string, method: string, error: any, context?: LogContext) {
    this.log('error', `API Error: ${method} ${endpoint}`, {
      event: 'api_error',
      endpoint,
      method,
      error: error?.message || String(error),
      ...context
    })
  }

  // Component Lifecycle Logging
  logComponentMount(componentName: string, props?: any, context?: LogContext) {
    this.log('debug', `Component mounted: ${componentName}`, {
      event: 'component_mount',
      componentName,
      ...context
    })
  }

  logComponentUnmount(componentName: string, context?: LogContext) {
    this.log('debug', `Component unmounted: ${componentName}`, {
      event: 'component_unmount',
      componentName,
      ...context
    })
  }

  logStateChange(componentName: string, stateKey: string, oldValue: any, newValue: any, context?: LogContext) {
    this.log('debug', `State changed: ${componentName}.${stateKey}`, {
      event: 'state_change',
      componentName,
      stateKey,
      oldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue).substring(0, 100) : oldValue,
      newValue: typeof newValue === 'object' ? JSON.stringify(newValue).substring(0, 100) : newValue,
      ...context
    })
  }

  // Drafting-Specific Logging
  logDraftingAction(action: string, draftId?: string, caseId?: string, details?: any) {
    this.log('info', `Drafting action: ${action}`, {
      event: 'drafting_action',
      action,
      draftId,
      caseId,
      ...details
    })
  }

  logEditorInteraction(action: string, draftId: string, contentLength?: number, details?: any) {
    this.log('info', `Editor interaction: ${action}`, {
      event: 'editor_interaction',
      action,
      draftId,
      contentLength,
      ...details
    })
  }

  // Error Logging
  logError(error: Error | string, component?: string, context?: LogContext) {
    const errorMessage = error instanceof Error ? error.message : error
    const stackTrace = error instanceof Error ? error.stack : undefined

    this.log('error', `Error: ${errorMessage}`, {
      event: 'error',
      errorMessage,
      stackTrace,
      component,
      ...context
    })

    // Show user-friendly error toast
    if (process.env.NODE_ENV === 'development') {
      toast.error(`Error: ${errorMessage}`)
    }
  }

  logUnhandledError(error: Error, errorInfo?: any) {
    this.log('error', `Unhandled error: ${error.message}`, {
      event: 'unhandled_error',
      errorMessage: error.message,
      stackTrace: error.stack,
      errorInfo,
      component: 'ErrorBoundary'
    })
  }

  // Performance Logging
  logPerformance(metric: string, value: number, context?: LogContext) {
    this.log('info', `Performance: ${metric} = ${value}`, {
      event: 'performance',
      metric,
      value,
      ...context
    })
  }

  // Feature Usage Logging
  logFeatureUsage(feature: string, action: string, details?: any) {
    this.log('info', `Feature used: ${feature} - ${action}`, {
      event: 'feature_usage',
      feature,
      action,
      ...details
    })
  }

  // Private method for sending logs to external service in production
  private async sendToLoggingService(logEntry: any) {
    // In production, you could send to services like:
    // - LogRocket, Sentry, DataDog, etc.
    // - Your own logging API endpoint

    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to your logging endpoint
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(logEntry)
        // })
      } catch (e) {
        // Don't let logging failures break the app
        console.error('Failed to send log to service:', e)
      }
    }
  }
}

// Global instance
export const logger = new FrontendLogger()

// Helper hooks for React components
export const useLogger = () => logger

// Higher-order component for automatic component logging
export const withLogging = (
  Component: React.ComponentType<any>,
  componentName: string
) => {
  return (props: any) => {
    React.useEffect(() => {
      logger.logComponentMount(componentName, { propsKeys: Object.keys(props) })

      return () => {
        logger.logComponentUnmount(componentName)
      }
    }, [])

    return React.createElement(Component, props)
  }
}
