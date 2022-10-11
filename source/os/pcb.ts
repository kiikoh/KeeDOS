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
        public segment: Segment
        public bounds: [number, number] = [0, 0]

        constructor(segment: Segment) {
            this.segment = segment;
            this.bounds = [this.segment * 0x100, (this.segment + 1) * 0x100 - 1]
            TSOS.Control.updatePCBs();
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