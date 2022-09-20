module TSOS {
    export class PCB {

        static numProcesses = 0;
        public PID = PCB.numProcesses++;
        public PC = 0 
        public IR = 0
        public ACC = 0
        public X = 0
        public Y = 0 
        public Z = 0 

        constructor() {
            console.log(this)
        }
    }
}