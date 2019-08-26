module TSOS {
    export class UserCommand {
        constructor(public command:string = "",
                    public args:string[] = []) {
        }
    }
}
