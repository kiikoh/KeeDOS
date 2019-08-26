/* ------------
   Interrupt.ts
   ------------ */

module TSOS {
    export class Interrupt {
        constructor(public irq: number, public params: any[]) {
        }
    }
}
