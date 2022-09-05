/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var key = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key: " + key + " shifted:" + isShifted);
            // I ripped out alot of the logic here as there is now newer APIs 
            // that can abstract this functionality away, also because the existing 
            // functionality relied on a deprecated API and was giving me problems
            // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/which is no longer being used
            // Do we want to process the key press?
            if (key.length === 1 || key === "Enter" || key === "Backspace") {
                _KernelInputQueue.enqueue(key);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map