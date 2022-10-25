module TSOS {
    export class Dispatcher {

        constructor() {

        }

        public contextSwitchToPID(pid: number): void {

            const pcb = _Scheduler.residentList.get(pid);

            if (!pcb) {
                _Kernel.krnTrapError("Invalid PID: " + pid);
                return;
            }

            _CPU.PC = pcb.PC
            _CPU.IR = pcb.IR
            _CPU.Acc = pcb.Acc
            _CPU.Xreg = pcb.Xreg
            _CPU.Yreg = pcb.Yreg
            _CPU.Zflag = pcb.Zflag
        }

    }
}