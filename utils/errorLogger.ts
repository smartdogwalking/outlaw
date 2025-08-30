// Production error logging utility
interface ErrorLogEntry {
  message: string;
  stack?: string;
  url?: string;
  userId?: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  context?: Record<string, any>;
}

class ErrorLogger {
  private isProduction = import.meta.env.MODE === 'production';
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const logEntry: ErrorLogEntry = {
      message,
      stack: error?.stack,
      url: window.location.href,
      userId: this.userId || undefined,
      timestamp: new Date().toISOString(),
      level: 'error',
      context
    };

    this.logToService(logEntry);
    
    // Only log to console in development
    if (!this.isProduction) {
      console.error('[ErrorLogger]', message, error, context);
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const logEntry: ErrorLogEntry = {
      message,
      url: window.location.href,
      userId: this.userId || undefined,
      timestamp: new Date().toISOString(),
      level: 'warn',
      context
    };

    this.logToService(logEntry);
    
    if (!this.isProduction) {
      console.warn('[ErrorLogger]', message, context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const logEntry: ErrorLogEntry = {
      message,
      url: window.location.href,
      userId: this.userId || undefined,
      timestamp: new Date().toISOString(),
      level: 'info',
      context
    };

    this.logToService(logEntry);
    
    if (!this.isProduction) {
      console.info('[ErrorLogger]', message, context);
    }
  }

  private async logToService(logEntry: ErrorLogEntry) {
    if (!this.isProduction) {
      return; // Only send to service in production
    }

    try {
      // Send to logging service (can be replaced with Sentry, LogRocket, etc.)
      await fetch('/api/client-errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      // Silently fail - don't create infinite error loops
    }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Global error handler
window.addEventListener('error', (event) => {
  errorLogger.error('Global error', new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Global unhandled promise rejection handler  
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.error('Unhandled promise rejection', new Error(String(event.reason)), {
    reason: event.reason
  });
});

export default errorLogger;
