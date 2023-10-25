import * as console from 'console';

class Logger extends console.Console {
  _traceId = '';
  setTraceId(traceId: string) {
    this._traceId = traceId;
  }

  generateLogPrefix(messageType: string) {
    if (this._traceId) {
      return `${messageType} [traceId:${this._traceId}]`;
    }
    return messageType;
  }

  error(...message: any[]) {
    // Ensure the error is prefixed with "ERROR" so that it is picked up by the monitor
    // Stringify the message so that it is logged as a single line
    console.error(
      this.generateLogPrefix('ERROR'),
      ...message
        .map(e => {
          if (e instanceof Error) {
            // Format exceptions
            return {
              message: e.message,
              name: e.name || e.constructor.name || 'Error',
              stack: e.stack,
            };
          }
          return e;
        })
        .map(e => JSON.stringify(e))
    );
  }

  warn(...message: any[]) {
    console.warn(this.generateLogPrefix('WARN'), ...message);
  }
  log(...message: any[]) {
    console.log(this.generateLogPrefix('INFO'), ...message);
  }
  info(...message: any[]) {
    console.info(this.generateLogPrefix('INFO'), ...message);
  }
  debug(...message: any[]) {
    console.debug(this.generateLogPrefix('DEBUG'), ...message);
  }
  trace(...message: any[]) {
    console.trace(this.generateLogPrefix('TRACE'), ...message);
  }
}

export default new Logger(process.stdout, process.stderr);
