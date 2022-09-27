/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class CPU {
        constructor(PC = 0, IR = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = false, isExecuting = false) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // get the instruction and run it
            this.IR = _MemoryAccessor.read(this.PC++);
            const op = TSOS.instructions.get(this.IR);
            if (!op) {
                _Kernel.krnTrapError("Invalid Op Code executed: " + this.IR);
                return;
            }
            op(this);
            this.writeCPUtoPCB();
            TSOS.Control.updateCPU();
        }
        writeCPUtoPCB() {
            const pcb = _Processes.get(_activeProcess);
            pcb.update({
                Acc: this.Acc,
                IR: this.IR,
                PC: this.PC,
                Xreg: this.Xreg,
                Yreg: this.Yreg,
                Zflag: this.Zflag
            });
        }
        loadCPUfromPCB(pcb) {
            this.PC = pcb.PC;
            this.IR = pcb.IR;
            this.Acc = pcb.Acc;
            this.PC = pcb.PC;
            this.PC = pcb.PC;
            this.PC = pcb.PC;
            console.log(this);
        }
    }
    TSOS.CPU = CPU;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map