class Logger {
  error(...message: any[]) {
    // Ensure the error is prefixed with "ERROR" so that it is picked up by the monitor
    console.error('ERROR', ...message);
  }
  log(...message: any[]) {
    console.log(...message);
  }
  debug(...message: any[]) {
    console.debug(...message);
  }
  warn(...message: any[]) {
    console.warn(...message);
  }
}

const logger = new Logger();

export default logger;
