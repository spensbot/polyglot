export namespace Log {
  export function temp(message: string, arg?: any) {
    console.log(`[TEMP] ${message}`, arg);
  }

  export function info(message: string, arg?: any) {
    console.log(`${message}`, arg);
  }

  export function warn(message: string, arg?: any) {
    console.warn(`${message}`, arg);
  }

  export function error(message: string, arg?: any) {
    console.error(`${message}`, arg);
  }
}