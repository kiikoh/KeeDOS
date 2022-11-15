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
            }
            else {
                _Kernel.krnTrace("No storage available");
            }
        }
        write(fileName, data) {
        }
        delete(fileName) {
        }
        read(fileName) {
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
        findFirstFreeDataBlock() {
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
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map