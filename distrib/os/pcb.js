var TSOS;
(function (TSOS) {
    class PCB {
        constructor() {
            this.PID = PCB.numProcesses++;
            this.PC = 0;
            this.IR = 0;
            this.ACC = 0;
            this.X = 0;
            this.Y = 0;
            this.Z = false;
            console.log(this);
        }
    }
    PCB.numProcesses = 0;
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map