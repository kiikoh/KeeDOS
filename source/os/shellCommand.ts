module TSOS {
  export class ShellCommand {
    constructor(
      public func: (args: string[]) => void,
      public command: string = "",
      public description: string = "",
      public manual: string = ""
    ) {}
  }
}
