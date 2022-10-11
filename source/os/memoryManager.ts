module TSOS {
    export class MemoryManager {
        constructor() {

        }

        public isSegmentOpen(segment: Segment): boolean {
            return Array.from(_Processes).every(([_, pcb]) => {

                //Return true if the pcb is not in conflict with the segment

                if(pcb.segment !== segment) {
                    return true;
                }

                if(pcb.state === "Terminated") {
                    return true;
                }

                return false;
            });
        }

        public getFirstOpenSegment(): Segment | false {
            if(this.isSegmentOpen(0))
                return 0;
            if(this.isSegmentOpen(1))
                return 1;
            if(this.isSegmentOpen(2))
                return 2;
            return false;
        }

        public load(data: number[]): PCB | false{

            const segment = this.getFirstOpenSegment();

            console.log(segment)

            //can't use simple negation because segment can be 0
            if (segment === false) {
                return false;
            }

            const base = segment * 0x100;

            for(let i = 0 + base; i < 0x100 + base;i++) {
                _MemoryAccessor.write(i, data[i] ?? 0)
            }
            return new TSOS.PCB(segment);
        }
    }

    export type Segment = 0 | 1 | 2;
}