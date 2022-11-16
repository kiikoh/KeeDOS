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
            TSOS.Control.updateDisk();
        }
        create(fileName) {
            const freeBlock = this.findNextFATBlock();
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
                TSOS.Control.updateDisk();
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
                const freeBlock = this.findNextDataBlock();
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
            let dataBlockHead = this.tsb(fatEntryData[1], fatEntryData[2], fatEntryData[3]);
            let dataBlockData = sessionStorage.getItem(dataBlockHead).split(" ");
            //write out the data
            let i = 0;
            while (data[i]) {
                const charCode = data.charCodeAt(i);
                dataBlockData[4 + (i % 60)] = charCode.toString(16);
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
            TSOS.Control.updateDisk();
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
                    return data;
                }
            }
            return null;
        }
        ls() {
            const files = [];
            for (let s = 0; s < this.sectors; s++) {
                for (let b = 0; b < this.blocks; b++) {
                    //ignore the MBR
                    if (s === 0 && b === 0)
                        continue;
                    const block = sessionStorage.getItem(this.tsb(0, s, b)).split(" ");
                    if (block[0] === "1") {
                        files.push(this.decodeData(block));
                    }
                }
            }
            return files;
        }
        tsb(track, sector, block) {
            return `${track}:${sector}:${block}`;
        }
        getEmptyBlock() {
            let emptyBlock = new Array(64);
            emptyBlock.fill("0");
            return emptyBlock;
        }
        findNextFATBlock() {
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
        findNextDataBlock(lookahead = 0) {
            let count = 0;
            for (let t = 1; t < this.tracks; t++) {
                for (let s = 0; s < this.sectors; s++) {
                    for (let b = 0; b < this.blocks; b++) {
                        const block = sessionStorage.getItem(this.tsb(t, s, b)).split(" ");
                        if (block[0] === "0" && count === lookahead) {
                            return this.tsb(t, s, b);
                        }
                        else if (block[0] === "0") {
                            count++;
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
                if (index === 64) {
                    const nextBlock = this.tsb(data[1], data[2], data[3]);
                    data = sessionStorage.getItem(nextBlock).split(" ");
                    index = 4;
                }
            }
            return decodedData;
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map