/* ------------
   Interrupt.ts
   ------------ */
var TSOS;
(function (TSOS) {
    class Interrupt {
        constructor(irq, params) {
            this.irq = irq;
            this.params = params;
        }
    }
    TSOS.Interrupt = Interrupt;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=interrupt.js.map