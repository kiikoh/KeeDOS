module TSOS {
  
  export class DeviceDriverDisk extends DeviceDriver {

    tracks = 4
    sectors = 8
    blocks = 8
    blockSize = 64
    public isFormatted = false

    constructor() {
      super();

      this.driverEntry = this.krnDiskDriverEntry;
    }

    public krnDiskDriverEntry() {
      this.status = "loaded";
    }

    public format() {
      _Kernel.krnTrace("Formatting Disk");


      for(let t = 0; t < this.tracks; t++) {
        for(let s = 0; s < this.sectors; s++) {
          for(let b = 0; b < this.blocks; b++) {
            const block = this.getEmptyBlock()
            if(t === 0 && s === 0 && b === 0) {
              block[0] = "1";
            }
            sessionStorage.setItem(this.tsb(t, s, b), block.join(" "));
          }
        }
      }

      this.isFormatted = true;
    }

    public create(fileName: string) {

    }

    public write(fileName: string, data: string) {

    }

    public delete(fileName: string) {

    }

    public read(fileName: string) {

    }

    public tsb(track: number, sector: number, block: number): string {
      return `${track}:${sector}:${block}`;
    }

    public getEmptyBlock(): string[] {
      let emptyBlock = new Array(64)

      emptyBlock.fill("0");

      return emptyBlock;

    }

  }

}