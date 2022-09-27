var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        load(data) {
            for (let i = 0; i < 0x100; i++) {
                if (data[i])
                    _MemoryAccessor.write(i, data[i]);
            }
            return new TSOS.PCB();
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map