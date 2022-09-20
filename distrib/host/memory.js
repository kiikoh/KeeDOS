var TSOS;
(function (TSOS) {
    class Memory extends Array {
        constructor() {
            super(768);
        }
        init() {
            this.fill(0);
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map