var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        isSegmentOpen(segment) {
            return Array.from(_Processes).every(([_, pcb]) => {
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
            return false;
        }
        load(data) {
            var _a;
            const segment = this.getFirstOpenSegment();
            //can't use simple negation because segment can be 0
            if (segment === false) {
                return false;
            }
            const pcb = new TSOS.PCB(segment);
            pcb.state = "Resident";
            _Processes.set(pcb.PID, pcb);
            TSOS.Control.updatePCBs();
            for (let i = 0; i < 0x100; i++) {
                _MemoryAccessor.write(i, (_a = data[i]) !== null && _a !== void 0 ? _a : 0, pcb.PID);
            }
            return pcb;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map