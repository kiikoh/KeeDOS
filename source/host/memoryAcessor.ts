module TSOS {
    export class MemoryAccessor {

        constructor() {

        }

        public init(): void {
            
        }

        public read(address: number): number {
            return _Memory[address]
        }

        public write(address: number, value: number):void  {
            _Memory[address] = value;
            TSOS.Control.updateMemory(address, value); // update the UI
        }

    }
}
    