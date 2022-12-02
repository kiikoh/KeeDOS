module TSOS {
  export class Dispatcher {
    constructor() {}

    public contextSwitchToPID(pid: number): void {
      const pcb = _Scheduler.residentList.get(pid);

      if (!pcb) {
        _Kernel.krnTrapError("Invalid PID: " + pid);
        return;
      }

      _CPU.PC = pcb.PC;
      _CPU.IR = pcb.IR;
      _CPU.Acc = pcb.Acc;
      _CPU.Xreg = pcb.Xreg;
      _CPU.Yreg = pcb.Yreg;
      _CPU.Zflag = pcb.Zflag;

      // whenever the pcb we try to switch to is on disk, roll it in, potentially rolling out first
      if (pcb.segment === "Disk" && pcb.state !== "Terminated") {
        _Kernel.krnTrace("Loading process from disk");

        const victim = _Scheduler.residentList.get(
          _Scheduler.readyQueue.q[_Scheduler.readyQueue.q.length - 1]
        );
        let victimSeg: Exclude<Segment, "Disk"> | undefined;

        if (victim) {
          victimSeg = this.rollOut(victim);
        }

        this.rollIn(pcb, victimSeg);
      }
    }

    // rolls a process out of memory to disk
    private rollOut(pcb: PCB): Exclude<Segment, "Disk"> {
      const data = [];
      for (let i = 0; i < 0x100; i++) {
        data.push(_MemoryAccessor.read(i, pcb.PID));
      }

      _krnDiskDriver.create("!" + pcb.PID);
      _krnDiskDriver.write("!" + pcb.PID, data);

      const victimSeg = pcb.segment as Exclude<Segment, "Disk">;
      pcb.segment = "Disk";

      return victimSeg;
    }

    // rolls a process in from disk to memory
    private rollIn(
      pcb: PCB,
      nextSegment = _MemoryManager.getFirstOpenSegment()
    ): void {
      const data = _krnDiskDriver.readBytes("!" + pcb.PID);
      _krnDiskDriver.delete("!" + pcb.PID);

      console.log(nextSegment);

      if (nextSegment !== false && nextSegment !== "Disk") {
        pcb.segment = nextSegment;
        pcb.bounds = [nextSegment * 0x100, (nextSegment + 1) * 0x100];
      }

      for (let i = 0; i < data.length; i++) {
        _MemoryAccessor.write(i, data[i], pcb.PID);
      }
    }
  }
}
