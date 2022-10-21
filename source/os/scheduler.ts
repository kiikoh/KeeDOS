module TSOS {
    export class Scheduler {

        public readyQueue: Queue<number>;
        public residentList: Map<number, PCB>
        public runningProcess: number | null
        public quantum: number
        public schedulingMode: "RoundRobin" | "Priority" | "FCFS"

        constructor() { }

        public init(): void {
            this.readyQueue = new Queue<number>();
            this.residentList = new Map<number, PCB>();
            this.runningProcess = null;
            this.quantum = 6;
            this.schedulingMode = "RoundRobin";
        }

        // this should be called only when a process is readied
        public schedule(): void {
            console.log(JSON.stringify(this))

            if (this.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                this.getActivePCB().state = "Terminated";
                this.runningProcess = null;
                TSOS.Control.updatePCBs();
                return;
            }

            // If a process is running, then we need to load the process
            if (this.runningProcess === null) {
                _Kernel.krnTrace("Context Switch")
                this.enqueueProcess();
                _CPU.isExecuting = true;
                return;
            }

        }

        public readyProcess(): void {

        }

        public terminateCurrProcess(): void {
            this.getActivePCB().state = "Terminated";
            this.runningProcess = null;

            if (this.readyQueue.isEmpty()) {
                Control.updatePCBs();
                _CPU.isExecuting = false;
            } else {
                this.enqueueProcess();
            }
        }

        // Determine the next process to execute
        private enqueueProcess(): void {
            switch (this.schedulingMode) {
                case "RoundRobin":
                case "FCFS":
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                    break;
                case "Priority":
                    //TODO: implement priority scheduling, enqueue the lowest priority process
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                    break;
            }
        }

        public quantumTick(): void {
            // get the quantum left on the running process
            let pcb = this.residentList.get(this.runningProcess);
            if (pcb.quantumRemaining > 0) {
                pcb.quantumRemaining--;
            }

            // if the quantum is 0, then we need to context switch
            if (pcb.quantumRemaining === 0) {
                pcb.quantumRemaining = this.quantum;
                pcb.state = "Ready";
                this.readyQueue.enqueue(pcb.PID);

                _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
            }
        }

        public getActivePCB(): PCB {
            return this.residentList.get(this.runningProcess);
        }


    }
}