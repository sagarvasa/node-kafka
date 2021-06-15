declare namespace NodeJS {
  interface Global {
    env: string;
  }

  interface Process {
    currentRes: any;
  }
}
