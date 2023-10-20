import * as console from 'console';

class Logger extends console.Console {
  error(...message: any[]) {
    // Ensure the error is prefixed with "ERROR" so that it is picked up by the monitor
    // Stringify the message so that it is logged as a single line
    console.error(
      'ERROR',
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
}

export default new Logger(process.stdout, process.stderr);
