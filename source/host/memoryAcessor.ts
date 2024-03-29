module TSOS {
  export class MemoryAccessor {
    constructor() {}

    public init(): void {}

    public read(
      address: number,
      pid: number = _Scheduler.runningProcess
    ): number {
      const [base, limit] = _Scheduler.residentList.get(pid).bounds;
      const physicalAddress = address + base;

      if (physicalAddress < base || physicalAddress > limit) {
        _Kernel.krnTrapError("Memory Read Access Violation: " + address);
        return -1;
      }

      return _Memory[physicalAddress];
    }

    public write(
      address: number,
      value: number,
      pid: number = _Scheduler.runningProcess
    ): void {
      const [base, limit] = _Scheduler.residentList.get(pid).bounds;
      const physicalAddress = address + base;

      if (physicalAddress < base || physicalAddress > limit) {
        _Kernel.krnTrapError("Memory Write Access Violation: " + address);
        return;
      }

      _Memory[physicalAddress] = value;
      TSOS.Control.updateMemory(physicalAddress, value); // update the UI
    }

    public clearMemory() {
      for (let i = 0; i < _Memory.length; i++) {
        _Memory[i] = 0;
        TSOS.Control.updateMemory(i, 0); // update the UI
      }
    }
  }
}
