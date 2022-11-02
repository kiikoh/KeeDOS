module TSOS {
    export class MemoryManager {
        constructor() {

        }

        public isSegmentOpen(segment: Segment): boolean {
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

        public getFirstOpenSegment(): Segment | false {
            if (this.isSegmentOpen(0))
                return 0;
            if (this.isSegmentOpen(1))
                return 1;
            if (this.isSegmentOpen(2))
                return 2;
            return false;
        }

        public load(data: number[]): PCB | false {

            const segment = this.getFirstOpenSegment();

            //can't use simple negation because segment can be 0
            if (segment === false) {
                return false;
            }

            const pcb = new PCB(segment);

            pcb.state = "Resident"
            _Scheduler.residentList.set(pcb.PID, pcb)
            Control.updatePCBs();

            for (let i = 0; i < 0x100; i++) {
                _MemoryAccessor.write(i, data[i] ?? 0, pcb.PID);
            }

            return pcb;
        }

    }

    export type Segment = 0 | 1 | 2;
}