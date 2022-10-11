var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        init() {
        }
        read(address, pid = _activeProcess) {
            const [base, limit] = _Processes.get(pid).bounds;
            const physicalAddress = address + base;
            if (physicalAddress < base || physicalAddress > limit) {
                _Kernel.krnTrapError("Memory Read Access Violation: " + address);
                return -1;
            }
            return _Memory[physicalAddress];
        }
        write(address, value, pid = _activeProcess) {
            const [base, limit] = _Processes.get(pid).bounds;
            const physicalAddress = address + base;
            if (physicalAddress < base || physicalAddress > limit) {
                _Kernel.krnTrapError("Memory Write Access Violation: " + address);
                return;
            }
            _Memory[physicalAddress] = value;
            TSOS.Control.updateMemory(physicalAddress, value); // update the UI
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAcessor.js.map