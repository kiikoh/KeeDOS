var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        init() {
        }
        read(address) {
            return _Memory[address];
        }
        write(address, value) {
            _Memory[address] = value;
            TSOS.Control.updateMemory(address, value); // update the UI
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAcessor.js.map