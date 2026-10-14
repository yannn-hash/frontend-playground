export interface LogContext {
  scope: string;
  gameId?: string;
  missionId?: string;
  code: string;
}
export function reportError(error: unknown, context: LogContext) {
  // User draft/source is deliberately omitted from diagnostic context.
  console.error('[arcade]', {
    ...context,
    release: import.meta.env.VITE_RELEASE_SHA ?? 'local',
    message: error instanceof Error ? error.message : String(error),
  });
}
