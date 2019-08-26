/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */

module TSOS {
    export class DeviceDriver {
        public version = '0.07';
        public status = 'unloaded';
        public preemptable = false;

        public driverEntry = null;
        public isr = null;

        // The constructor below is useless because child classes
        // cannot pass "this" arguments when calling super().
        //constructor(public driverEntry = null,
        //            public isr = null) {
        //}
    }
}
