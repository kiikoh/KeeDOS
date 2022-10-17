var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() { }
        init() {
            this.readyQueue = new TSOS.Queue();
            this.residentList = new Map();
            this.runningProcess = null;
            this.quantum = 6;
            this.schedulingMode = "RoundRobin";
        }
        // this should be called only when a process is readied or terminated
        schedule() {
            console.log(JSON.stringify(this));
            if (this.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                this.getActivePCB().state = "Terminated";
                this.runningProcess = null;
                TSOS.Control.updatePCBs();
                return;
            }
            // If a process is running, then we need to load the process
            if (this.runningProcess === null) {
                _Kernel.krnTrace("Context Switch");
                this.enqueueProcess();
                _CPU.isExecuting = true;
                return;
            }
        }
        // Determine the next process to execute
        enqueueProcess() {
            switch (this.schedulingMode) {
                case "RoundRobin":
                case "FCFS":
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                    break;
                case "Priority":
                    //TODO: implement priority scheduling, enqueue the lowest priority process
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
                    break;
            }
        }
        quantumTick() {
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
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [this.readyQueue.dequeue()]));
            }
        }
        getActivePCB() {
            return this.residentList.get(this.runningProcess);
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map