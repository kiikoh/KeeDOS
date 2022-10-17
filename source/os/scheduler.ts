module TSOS {
    export class Scheduler {

        public readyQueue: Queue<number>;
        public residentList: Map<number, PCB>
        public runningProcess: number | null
        public quantum: number
        public schedulingMode: "RoundRobin" | "Priority" | "FCFS"

        constructor() {}

        public init(): void {
            this.readyQueue = new Queue<number>();
            this.residentList = new Map<number, PCB>();
            this.runningProcess = null;
            this.quantum = 6;
            this.schedulingMode = "RoundRobin";
        }

        // this should be called only when a process is readied or terminated
        public schedule(): void {

            if(this.readyQueue.isEmpty()) {
                
                return;
            }

            // If a process is running, then we need to load the process
            if (this.runningProcess === null) {
                _Kernel.krnTrace("Context Switch")
                this.enqueueProcess();
                _CPU.isExecuting = true;
                return;
            }

            if(1===1) {}
            
        }

        // Determine the next process to execute
        private enqueueProcess(): void {
            switch(this.schedulingMode) {
                case "RoundRobin":
                case "FCFS":
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                case "Priority":
                    //TODO: implement priority scheduling, enqueue the lowest priority process
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                    break;
            }
        }

        public quantumTick(): void {
            // get the quantum left on the running process
            let pcb = this.residentList.get(this.runningProcess);
            if(pcb.quantumRemaining > 0) {
                pcb.quantumRemaining--;
            }
        }

        public getActivePCB(): PCB {
            return this.residentList.get(this.runningProcess);
        }


    }
}