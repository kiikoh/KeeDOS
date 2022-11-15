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
      const freeBlock = this.findFirstFATBlock();
      if(freeBlock) {

        const freeBlockData = sessionStorage.getItem(freeBlock).split(" ");
        freeBlockData[0] = "1";

        // point to 0 0 0 which means points to nothing, bcuz that is reserved for MBR
        freeBlockData[1] = "0"
        freeBlockData[2] = "0"
        freeBlockData[3] = "0"

        for(let i = 0; i < fileName.length; i++) {
          const charCode = fileName.charCodeAt(i);
          freeBlockData[4 + i] = charCode.toString(16); 
        }

        sessionStorage.setItem(freeBlock, freeBlockData.join(" "));

      } else {
        _Kernel.krnTrace("No storage available");
      }
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

    public findFirstFATBlock(): string {
      for(let s = 0; s < this.sectors; s++) {
        for(let b = 0; b < this.blocks; b++) {

          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if(block[0] === "0") {
            return this.tsb(0, s, b);
          }
        }
      }
      

      return null;
    }

    public findFirstFreeDataBlock(): string {
      for(let t = 1; t < this.tracks; t++) {
        for(let s = 0; s < this.sectors; s++) {
          for(let b = 0; b < this.blocks; b++) {

            const block = sessionStorage.getItem(this.tsb(t, s, b)).split(" ");
            if(block[0] === "0") {
              return this.tsb(t, s, b);
            }
          }
        }
      }

      return null;
    }

  }

}