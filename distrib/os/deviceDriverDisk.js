var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 64;
            this.isFormatted = false;
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            this.status = "loaded";
        }
        format() {
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
        }
        create(fileName) {
            const freeBlock = this.findFirstFATBlock();
            if (freeBlock) {
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
                return true;
            }
            else {
                _Kernel.krnTrace("No storage available");
                return false;
            }
        }
        write(fileName, data) {
            const fatEntry = this.findFATEntry(fileName);
            if (!fatEntry) {
                return false;
            }
            const fatEntryData = sessionStorage.getItem(fatEntry).split(" ");
            // the file hasn't been written to yet
            if (fatEntryData[1] === "0" && fatEntryData[2] === "0" && fatEntryData[3] === "0") {
                // find a location to a new data block
                const freeBlock = this.findFirstDataBlock();
                if (freeBlock) {
                    //get the track, sector, and block of the free block
                    const [t, s, b] = freeBlock.split(":");
                    fatEntryData[1] = t;
                    fatEntryData[2] = s;
                    fatEntryData[3] = b;
                    // update the FAT entry
                    sessionStorage.setItem(fatEntry, fatEntryData.join(" "));
                }
                else {
                    return false;
                }
            }
            // get the data block
            const dataBlockHead = this.tsb(parseInt(fatEntryData[1]), parseInt(fatEntryData[2]), parseInt(fatEntryData[3]));
            const dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");
            //write out the data
            let i = 0;
            while (data[i]) {
                const charCode = data.charCodeAt(i);
                dataBlockData[4 + i] = charCode.toString(16);
                i++;
            }
            dataBlockData[4 + i] = "0";
            // set to active
            dataBlockData[0] = "1";
            sessionStorage.setItem(dataBlockHead, dataBlockData.join(" "));
            return true;
        }
        delete(fileName) {
        }
        read(fileName) {
            if (this.isFormatted) {
                const fatEntry = this.findFATEntry(fileName);
                if (fatEntry) {
                    const fileData = sessionStorage.getItem(fatEntry).split(" ");
                    const dataBlock = this.tsb(fileData[1], fileData[2], fileData[3]);
                    const data = this.decodeData(sessionStorage.getItem(dataBlock).split(" "));
                    console.log(data);
                    return data;
                }
            }
            return null;
        }
        tsb(track, sector, block) {
            return `${track}:${sector}:${block}`;
        }
        getEmptyBlock() {
            let emptyBlock = new Array(64);
            emptyBlock.fill("0");
            return emptyBlock;
        }
        findFirstFATBlock() {
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
        findFirstDataBlock() {
            for (let t = 1; t < this.tracks; t++) {
                for (let s = 0; s < this.sectors; s++) {
                    for (let b = 0; b < this.blocks; b++) {
                        const block = sessionStorage.getItem(this.tsb(t, s, b)).split(" ");
                        if (block[0] === "0") {
                            return this.tsb(t, s, b);
                        }
                    }
                }
            }
            return null;
        }
        findFATEntry(fileName) {
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
        decodeData(data) {
            let index = 4;
            let decodedData = "";
            while (data[index] !== "0") {
                const charCode = parseInt(data[index], 16);
                decodedData += String.fromCharCode(charCode);
                index++;
            }
            return decodedData;
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map