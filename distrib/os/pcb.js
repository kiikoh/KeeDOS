var TSOS;
(function (TSOS) {
    class PCB {
        constructor(segment) {
            this.PID = PCB.numProcesses++;
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.state = "Resident";
            this.segment = 0; // TODO: Make this dynamic
            this.segment = segment;
        }
        update({ PC, IR, Acc, Xreg, Yreg, Zflag }) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            TSOS.Control.updatePCBs();
        }
    }
    PCB.numProcesses = 0;
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map