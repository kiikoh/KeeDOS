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
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map