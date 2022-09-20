module TSOS {
    export class MemoryManager {
        constructor(public id = 0) {

        }

        load(data: number[]) {
            for(let i = 0; i < _Memory.length;i++) {
                if(data[i]) _MemoryAccessor.write(i, data[i])
            }
        }
    }
}