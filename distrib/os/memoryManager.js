var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        load(data) {
            var _a;
            for (let i = 0; i < 0x100; i++) {
                _MemoryAccessor.write(i, (_a = data[i]) !== null && _a !== void 0 ? _a : 0);
            }
            return new TSOS.PCB();
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map