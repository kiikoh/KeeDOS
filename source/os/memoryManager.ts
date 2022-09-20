module TSOS {
    export class MemoryManager {
        constructor() {

        }

        public load(data: number[]) {
            for(let i = 0; i < _Memory.length;i++) {
                if(data[i]) _MemoryAccessor.write(i, data[i])
            }
            return new TSOS.PCB();
        }
    }
}