var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(id = 0) {
            this.id = id;
        }
        load(data) {
            for (let i = 0; i < _Memory.length; i++) {
                if (data[i])
                    _MemoryAccessor.write(i, data[i]);
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map