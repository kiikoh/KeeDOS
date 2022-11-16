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

    public create(fileName: string): boolean {
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
        return true
      } else {
        _Kernel.krnTrace("No storage available");
        return false
      }
    }

    public write(fileName: string, data: string): boolean {
      const fatEntry = this.findFATEntry(fileName);

      if(!fatEntry) {
        return false;
      }

      const fatEntryData = sessionStorage.getItem(fatEntry).split(" ");

      // the file hasn't been written to yet
      if(fatEntryData[1] === "0" && fatEntryData[2] === "0" && fatEntryData[3] === "0") {

        // find a location to a new data block
        const freeBlock = this.findFirstDataBlock();

        if(freeBlock) {
          //get the track, sector, and block of the free block
          const [t, s, b] = freeBlock.split(":");
          
          fatEntryData[1] = t;
          fatEntryData[2] = s;
          fatEntryData[3] = b;

          // update the FAT entry
          sessionStorage.setItem(fatEntry, fatEntryData.join(" "));
        } else {
          return false;
        }
      }

      // get the data block
      const dataBlockHead = this.tsb(parseInt(fatEntryData[1]), parseInt(fatEntryData[2]), parseInt(fatEntryData[3]));
      const dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");

      //write out the data
      let i = 0;
      while(data[i]) {
        const charCode = data.charCodeAt(i);
        dataBlockData[4 + i] = charCode.toString(16);
        i++;
      }
      dataBlockData[4 + i] = "0";

      // set to active
      dataBlockData[0] = "1";

      sessionStorage.setItem(dataBlockHead, dataBlockData.join(" "));

      return true
    }

    public delete(fileName: string) {

    }

    public read(fileName: string): string {
      if(this.isFormatted) {
        const fatEntry = this.findFATEntry(fileName);

        if(fatEntry) {
          const fileData = sessionStorage.getItem(fatEntry).split(" ");
          const dataBlock = this.tsb(fileData[1], fileData[2], fileData[3]);

          const data = this.decodeData(sessionStorage.getItem(dataBlock).split(" "));

          console.log(data)

          return data;
        }
      }
      return null;
    }

    public ls(): string[] {
      const files = [];
      for(let s = 0; s < this.sectors; s++) {
        for(let b = 0; b < this.blocks; b++) {
          //ignore the MBR
          if(s === 0 && b === 0) continue;

          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if(block[0] === "1") {
            files.push(this.decodeData(block));
          }
        }
      }

      return files;
    }

    public tsb(track: number | string, sector: number | string, block: number | string): string {
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

    public findFirstDataBlock(): string {
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

    public findFATEntry(fileName: string): string {
      for(let s = 0; s < this.sectors; s++) {
        for(let b = 0; b < this.blocks; b++) {

          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if(block[0] === "1") {
            const blockData = this.decodeData(block);
            if(blockData === fileName) {
              return this.tsb(0, s, b);
            }
          }
        }
      }
    }

    public decodeData(data: string[]): string {
      let index = 4;
      let decodedData = "";
      while(data[index] !== "0") {
        const charCode = parseInt(data[index], 16);
        decodedData += String.fromCharCode(charCode);
        index++;
      }

      return decodedData;
    }

  }

}