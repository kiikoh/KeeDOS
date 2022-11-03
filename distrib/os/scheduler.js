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
        // this should be called only when a process is readied
        schedule() {
            console.log(JSON.stringify(this));
            if (this.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                if (this.runningProcess !== null)
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
        readyProcess() {
        }
        killProcess(pid = this.runningProcess) {
            // remove the process from the ready queue
            this.readyQueue.q = this.readyQueue.q.filter((p) => p !== pid);
            // set the process state to terminated
            this.residentList.get(pid).state = "Terminated";
            // if the process is running, then we need to context switch
            if (this.runningProcess === pid) {
                this.runningProcess = null;
                this.schedule();
            }
            TSOS.Control.updatePCBs();
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
            if ((pcb === null || pcb === void 0 ? void 0 : pcb.quantumRemaining) > 0) {
                pcb.quantumRemaining--;
            }
            // if the quantum is 0 and there is something ready, then we need to context switch
            if ((pcb === null || pcb === void 0 ? void 0 : pcb.quantumRemaining) === 0 && !this.readyQueue.isEmpty()) {
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