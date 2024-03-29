module TSOS {
  export class DeviceDriverDisk extends DeviceDriver {
    tracks = 4;
    sectors = 8;
    blocks = 8;
    blockSize = 64;
    public isFormatted = false;

    constructor() {
      super();

      this.driverEntry = this.krnDiskDriverEntry;
    }

    public krnDiskDriverEntry() {
      this.status = "loaded";
    }

    public format() {
      _Kernel.krnTrace("Formatting Disk");

      for (let t = 0; t < this.tracks; t++) {
        for (let s = 0; s < this.sectors; s++) {
          for (let b = 0; b < this.blocks; b++) {
            const block = this.getEmptyBlock();
            if (t === 0 && s === 0 && b === 0) {
              block[0] = "1";
            }

            sessionStorage.setItem(this.tsb(t, s, b), block.join(" "));
          }
        }
      }

      this.isFormatted = true;
      Control.updateDisk();
    }

    public create(fileName: string): boolean {
      const freeBlock = this.findNextFATBlock();
      if (!freeBlock) {
        _Kernel.krnTrace("No storage available");
        return false;
      }

      const freeBlockData = sessionStorage.getItem(freeBlock).split(" ");
      freeBlockData[0] = "1";

      // point to 0 0 0 which means points to nothing, bcuz that is reserved for MBR
      freeBlockData[1] = "0";
      freeBlockData[2] = "0";
      freeBlockData[3] = "0";

      for (let i = 0; i < fileName.length; i++) {
        const charCode = fileName.charCodeAt(i);
        freeBlockData[4 + i] = charCode.toString(16);
      }

      sessionStorage.setItem(freeBlock, freeBlockData.join(" "));
      Control.updateDisk();
      return true;
    }

    public write(fileName: string, data: string | number[]): boolean {
      const fatEntry = this.findFATEntry(fileName);

      if (!fatEntry) {
        return false;
      }

      // maybe delete old data first TODO

      const fatEntryData = sessionStorage.getItem(fatEntry).split(" ");

      // the file hasn't been written to yet
      if (
        fatEntryData[1] === "0" &&
        fatEntryData[2] === "0" &&
        fatEntryData[3] === "0"
      ) {
        // find a location to a new data block
        const freeBlock = this.findNextDataBlock();

        if (freeBlock) {
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
      let dataBlockHead = this.tsb(
        fatEntryData[1],
        fatEntryData[2],
        fatEntryData[3]
      );
      let dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");

      //write out the data
      let i = 0;
      while (typeof data[i] === "number" || data[i]) {
        if (typeof data !== "string") {
          dataBlockData[4 + (i % 60)] = data[i].toString(16).padStart(2, "0");
        } else {
          const charCode = data.charCodeAt(i);
          dataBlockData[4 + (i % 60)] = charCode.toString(16);
        }

        i++;
        // if we are at the end of the block
        if (i % 60 === 0 && i !== 0) {
          // find a location to a new data block
          const freeBlock = this.findNextDataBlock(1);

          if (freeBlock) {
            //get the track, sector, and block of the free block
            const [t, s, b] = freeBlock.split(":");

            dataBlockData[0] = "1";
            dataBlockData[1] = t;
            dataBlockData[2] = s;
            dataBlockData[3] = b;

            // update the FAT entry
            sessionStorage.setItem(dataBlockHead, dataBlockData.join(" "));

            // change to the new data block
            dataBlockHead = this.tsb(t, s, b);
            dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");
          }
        }
      }
      dataBlockData[4 + (i % 60)] = "0";

      // set to active
      dataBlockData[0] = "1";

      sessionStorage.setItem(dataBlockHead, dataBlockData.join(" "));

      Control.updateDisk();
      return true;
    }

    public delete(fileName: string) {
      const fatEntryLoc = this.findFATEntry(fileName);

      // the filename exists
      if (fatEntryLoc) {
        // get the data block
        const fatEntry = sessionStorage.getItem(fatEntryLoc).split(" ");
        let dataBlockHead = this.tsb(fatEntry[1], fatEntry[2], fatEntry[3]);
        let dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");

        // must be inactive, and not the MBR
        while (dataBlockData[0] === "1" && dataBlockHead !== "0:0:0") {
          const nextBlock = this.tsb(
            dataBlockData[1],
            dataBlockData[2],
            dataBlockData[3]
          );
          dataBlockData[0] = "0";
          sessionStorage.setItem(dataBlockHead, dataBlockData.join(" "));
          dataBlockHead = nextBlock;
          dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");
        }

        // delete the FAT entry
        const emptyBlock = this.getEmptyBlock();
        sessionStorage.setItem(fatEntryLoc, emptyBlock.join(" "));
      }

      Control.updateDisk();
    }

    public read(fileName: string): string {
      if (this.isFormatted) {
        const fatEntry = this.findFATEntry(fileName);

        if (fatEntry) {
          const fileData = sessionStorage.getItem(fatEntry).split(" ");
          const dataBlock = this.tsb(fileData[1], fileData[2], fileData[3]);

          const data = this.decodeData(
            sessionStorage.getItem(dataBlock).split(" ")
          );

          return data;
        }
      }
      return null;
    }

    public readBytes(fileName: string): number[] {
      if (this.isFormatted) {
        const fatEntry = this.findFATEntry(fileName);

        if (fatEntry) {
          const fileData = sessionStorage.getItem(fatEntry).split(" ");
          const dataBlock = this.tsb(fileData[1], fileData[2], fileData[3]);

          let data = sessionStorage.getItem(dataBlock).split(" ");

          let index = 4;
          let readBytes: number[] = [];
          while (data[index] !== "0") {
            const charCode = parseInt(data[index], 16);
            readBytes.push(charCode);
            index++;
            if (index === 64) {
              const nextBlock = this.tsb(data[1], data[2], data[3]);
              data = sessionStorage.getItem(nextBlock).split(" ");
              index = 4;
            }
          }

          return readBytes;
        }
      }
      return null;
    }

    public rename(oldName: string, newName: string): boolean {
      const fatEntry = this.findFATEntry(oldName);

      if (!fatEntry || this.findFATEntry(newName)) {
        return false;
      }
      // existing filename exists and new filename doesn't

      const fatEntryData = sessionStorage.getItem(fatEntry).split(" ");

      for (let i = 0; i < newName.length; i++) {
        const charCode = newName.charCodeAt(i);
        fatEntryData[4 + i] = charCode.toString(16);
      }

      // terminate with a 0
      fatEntryData[4 + newName.length] = "0";

      sessionStorage.setItem(fatEntry, fatEntryData.join(" "));
      Control.updateDisk();
      return true;
    }

    public copy(fileName: string, newFileName: string): boolean {
      const data = this.read(fileName);

      // if the newFileName doesn't exist, create it
      if (!this.findFATEntry(newFileName)) {
        // make sure we can create the file
        if (!this.create(newFileName)) return false;
      }

      if (data) {
        return this.write(newFileName, data);
      }

      return false;
    }

    public ls(showHidden = true): string[] {
      const files = [];
      for (let s = 0; s < this.sectors; s++) {
        for (let b = 0; b < this.blocks; b++) {
          //ignore the MBR
          if (s === 0 && b === 0) continue;

          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if (block[0] === "1") {
            const blockData = this.decodeData(block);
            if (blockData.startsWith("!")) continue;
            if (blockData.startsWith(".") && !showHidden) continue;
            files.push(blockData);
          }
        }
      }

      return files;
    }

    public tsb(
      track: number | string,
      sector: number | string,
      block: number | string
    ): string {
      return `${track}:${sector}:${block}`;
    }

    public getEmptyBlock(): string[] {
      let emptyBlock = new Array(64);

      emptyBlock.fill("0");

      return emptyBlock;
    }

    public findNextFATBlock(): string {
      for (let s = 0; s < this.sectors; s++) {
        for (let b = 0; b < this.blocks; b++) {
          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if (block[0] === "0") {
            return this.tsb(0, s, b);
          }
        }
      }

      return null;
    }

    public findNextDataBlock(lookahead: number = 0): string {
      let count = 0;
      for (let t = 1; t < this.tracks; t++) {
        for (let s = 0; s < this.sectors; s++) {
          for (let b = 0; b < this.blocks; b++) {
            const block = sessionStorage.getItem(this.tsb(t, s, b)).split(" ");
            if (block[0] === "0" && count === lookahead) {
              return this.tsb(t, s, b);
            } else if (block[0] === "0") {
              count++;
            }
          }
        }
      }

      return null;
    }

    // gets the FAT entry(t:s:b) for a filename
    public findFATEntry(fileName: string): string {
      for (let s = 0; s < this.sectors; s++) {
        for (let b = 0; b < this.blocks; b++) {
          const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
          if (block[0] === "1") {
            const blockData = this.decodeData(block);
            if (blockData === fileName) {
              return this.tsb(0, s, b);
            }
          }
        }
      }
    }

    public decodeData(data: string[]): string {
      let index = 4;
      let decodedData = "";
      while (data[index] !== "0") {
        const charCode = parseInt(data[index], 16);
        decodedData += String.fromCharCode(charCode);
        index++;
        if (index === 64) {
          const nextBlock = this.tsb(data[1], data[2], data[3]);
          data = sessionStorage.getItem(nextBlock).split(" ");
          index = 4;
        }
      }

      return decodedData;
    }
  }
}
