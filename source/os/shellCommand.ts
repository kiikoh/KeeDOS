module TSOS {
    export class ShellCommand {
        constructor(public func: any,
                    public command: string = "",
                    public description: string = "") {
        }
    }
}
