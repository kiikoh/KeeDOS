/* ------------
   Interrupt.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var Interrupt = /** @class */ (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    }());
    TSOS.Interrupt = Interrupt;
})(TSOS || (TSOS = {}));
