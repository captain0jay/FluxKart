import { CustomError } from './exception.js'

interface TryCatchContext {
  resourceType?: string;
  log?: string;
  message?: string;
  statusCode?: number;
  meta?: Record<string, any>;
}

async function asyncTryCatchHandler<T>(
  fn: () => Promise<T>,
  context: TryCatchContext = {}
): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    const timestamp = new Date().toISOString()
    console.error(
      `[${context?.resourceType}] [${context?.log}] [${timestamp}] Async error in withErrorHandlingAsync, Message: ${error?.message}, Stack: ${error?.stack}, ${
        context?.meta ? `Meta:, ${JSON.stringify(context?.meta || {})}` : ''
      }`
    )

    throw new CustomError(
      context?.message || '',
      context?.statusCode || 500
    )
  }
}

export { asyncTryCatchHandler }
