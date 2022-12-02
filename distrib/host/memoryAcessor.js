var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() { }
        init() { }
        read(address, pid = _Scheduler.runningProcess) {
            const [base, limit] = _Scheduler.residentList.get(pid).bounds;
            const physicalAddress = address + base;
            if (physicalAddress < base || physicalAddress > limit) {
                _Kernel.krnTrapError("Memory Read Access Violation: " + address);
                return -1;
            }
            return _Memory[physicalAddress];
        }
        write(address, value, pid = _Scheduler.runningProcess) {
            const [base, limit] = _Scheduler.residentList.get(pid).bounds;
            const physicalAddress = address + base;
            if (physicalAddress < base || physicalAddress > limit) {
                _Kernel.krnTrapError("Memory Write Access Violation: " + address);
                return;
            }
            _Memory[physicalAddress] = value;
            TSOS.Control.updateMemory(physicalAddress, value); // update the UI
        }
        clearMemory() {
            for (let i = 0; i < _Memory.length; i++) {
                _Memory[i] = 0;
                TSOS.Control.updateMemory(i, 0); // update the UI
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAcessor.js.map