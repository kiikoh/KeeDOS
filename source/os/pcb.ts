module TSOS {
    export class PCB {

        static numProcesses = 0;
        public PID = PCB.numProcesses++;
        public PC = 0 
        public IR = 0
        public Acc = 0
        public Xreg = 0
        public Yreg = 0 
        public Zflag = false
        public state: PCBState = "Resident"
        public segment: Segment = 0 // TODO: Make this dynamic

        constructor(segment: Segment) {
            this.segment = segment;
        }

        public update({PC, IR, Acc, Xreg, Yreg, Zflag}: {PC: number, IR: number, Acc: number, Xreg: number, Yreg: number, Zflag: boolean}): void {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            TSOS.Control.updatePCBs();
        }
    }

    export type PCBState = "Resident" | "Ready" | "Running" | "Terminated";
}