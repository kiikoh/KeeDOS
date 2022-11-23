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
        public readyProcess(): void {

            if (this.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                if (this.runningProcess !== null) this.getActivePCB().state = "Terminated";
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

        public killProcess(pid = this.runningProcess): void {

            // remove the process from the ready queue
            this.readyQueue.q = this.readyQueue.q.filter((p) => p !== pid);

            // set the process state to terminated
            this.residentList.get(pid).state = "Terminated";

            // if the process is running, then we need to context switch
            if (this.runningProcess === pid) {
                _Kernel.krnTrace("Context Switch")
                this.runningProcess = null;
                this.readyProcess();
            }

            Control.updatePCBs()
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
            if (pcb?.quantumRemaining > 0) {
                pcb.quantumRemaining--;
            }

            // if the quantum is 0 and there is something ready, then we need to context switch
            if (pcb?.quantumRemaining === 0 && !this.readyQueue.isEmpty()) {
                pcb.quantumRemaining = this.quantum;
                pcb.state = "Ready";
                this.readyQueue.enqueue(pcb.PID);

                _Kernel.krnTrace("Context Switch")
                this.enqueueProcess();
            }
        }

        public getActivePCB(): PCB {
            return this.residentList.get(this.runningProcess);
        }


    }
}