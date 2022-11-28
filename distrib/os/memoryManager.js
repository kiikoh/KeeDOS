var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        isSegmentOpen(segment) {
            return Array.from(_Scheduler.residentList).every(([_, pcb]) => {
                //Return true if the pcb is not in conflict with the segment
                if (pcb.segment !== segment) {
                    return true;
                }
                if (pcb.state === "Terminated") {
                    return true;
                }
                return false;
            });
        }
        getFirstOpenSegment() {
            if (this.isSegmentOpen(0))
                return 0;
            if (this.isSegmentOpen(1))
                return 1;
            if (this.isSegmentOpen(2))
                return 2;
            if (_krnDiskDriver.isFormatted) {
                return "Disk";
            }
            return false;
        }
        load(data) {
            const segment = this.getFirstOpenSegment();
            //can't use simple negation because segment can be 0
            if (segment === false) {
                return false;
            }
            const pcb = new TSOS.PCB(segment);
            pcb.state = "Resident";
            _Scheduler.residentList.set(pcb.PID, pcb);
            TSOS.Control.updatePCBs();
            while (data.length < 0x100) {
                data.push(0);
            }
            if (segment === "Disk") {
                _krnDiskDriver.create("!" + pcb.PID);
                _krnDiskDriver.write("!" + pcb.PID, data);
                return pcb;
            }
            for (let i = 0; i < data.length; i++) {
                _MemoryAccessor.write(i, data[i], pcb.PID);
            }
            return pcb;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map