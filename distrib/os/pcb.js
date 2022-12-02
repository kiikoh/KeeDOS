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
            this.bounds = [0, 0];
            this.quantumRemaining = _Scheduler.quantum;
            this.segment = segment;
            if (segment === "Disk") {
                this.bounds = [768, 768];
            }
            else {
                this.bounds = [+this.segment * 0x100, (+this.segment + 1) * 0x100 - 1];
            }
            TSOS.Control.updatePCBs();
        }
        update({ PC, IR, Acc, Xreg, Yreg, Zflag, }) {
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