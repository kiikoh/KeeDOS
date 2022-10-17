var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
        }
        contextSwitchToPID(pid) {
            const pcb = _Scheduler.residentList.get(pid);
            if (!pcb) {
                _Kernel.krnTrapError("Invalid PID: " + pid);
                return;
            }
            _CPU.PC = pcb.PC;
            _CPU.IR = pcb.IR;
            _CPU.Acc = pcb.Acc;
            _CPU.PC = pcb.PC;
            _CPU.PC = pcb.PC;
            _CPU.PC = pcb.PC;
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map