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

module TSOS {

    export class CPU {

        constructor(public PC: number = 0,
                    public IR: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: boolean = false,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = false;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            // get the instruction and run it
            this.IR = _MemoryAccessor.read(this.PC++)
            const op = instructions.get(this.IR);

            if(!op) {
                _Kernel.krnTrapError("Invalid Op Code executed: " + this.IR)
                return
            }

            op(this);

            this.writeCPUtoPCB()
            TSOS.Control.updateCPU()
        }

        public writeCPUtoPCB(): void {
            const pcb = _Processes.get(_activeProcess)

            pcb.update({
                Acc: this.Acc, 
                IR: this.IR, 
                PC: this.PC, 
                Xreg: this.Xreg, 
                Yreg: this.Yreg, 
                Zflag: this.Zflag
            })

        }

        public loadCPUfromPCB(pcb: PCB): void {
            this.PC = pcb.PC
            this.IR = pcb.IR
            this.Acc = pcb.Acc
            this.PC = pcb.PC
            this.PC = pcb.PC
            this.PC = pcb.PC
        }
    }
}
