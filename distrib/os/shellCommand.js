"use strict";
var TSOS;
(function (TSOS) {
    class ShellCommand {
        constructor(func, command = "", description = "", manual = "") {
            this.func = func;
            this.command = command;
            this.description = description;
            this.manual = manual;
        }
    }
    TSOS.ShellCommand = ShellCommand;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shellCommand.js.map