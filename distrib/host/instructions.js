var TSOS;
(function (TSOS) {
    TSOS.instructions = new Map();
    const readTwoByteEndian = (pc) => {
        const [lob, hob] = [_MemoryAccessor.read(pc), _MemoryAccessor.read(pc + 1)];
        const address = (hob << 8) | lob;
        return address;
    };
    TSOS.instructions.set(0xa9, (state) => {
        // Load the accumulator with a constant
        state.Acc = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xad, (state) => {
        // Load the accumulator from memory
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        state.Acc = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0x8d, (state) => {
        // Store the accumulator in memory
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        _MemoryAccessor.write(address, state.Acc);
    });
    TSOS.instructions.set(0x6d, (state) => {
        // Add with carry
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        state.Acc = TSOS.Utils.compAddition(state.Acc, _MemoryAccessor.read(address));
    });
    TSOS.instructions.set(0xa2, (state) => {
        // Load X from constant
        state.Xreg = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xae, (state) => {
        // Load X from memory
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        state.Xreg = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0xa0, (state) => {
        // Load Y from constant
        state.Yreg = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xac, (state) => {
        // Load Y from memory
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        state.Yreg = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0xea, (state) => {
        // No Op
    });
    TSOS.instructions.set(0x00, (state) => {
        // Break (which is really a system call)
        _CPU.writeCPUtoPCB();
        _Scheduler.killProcess();
    });
    TSOS.instructions.set(0xec, (state) => {
        // Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        state.Zflag = state.Xreg === _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0xd0, (state) => {
        // Branch n bytes if Z flag = 0
        const bytesToBranch = _MemoryAccessor.read(state.PC++);
        if (state.Zflag === false) {
            // console.log(`Branching ${bytesToBranch} bytes from ${state.PC}`)
            state.PC += bytesToBranch;
            if (state.PC > 0xff) {
                state.PC -= 0x100;
            }
            // console.log("to " + state.PC)
        }
    });
    TSOS.instructions.set(0xee, (state) => {
        // Increment the value of a byte
        const address = readTwoByteEndian(state.PC);
        state.PC += 2;
        // safely add to byte and write it back
        _MemoryAccessor.write(address, _MemoryAccessor.read(address) + 1);
    });
    TSOS.instructions.set(0xff, (state) => {
        // System Call
        if (state.Xreg === 1) {
            // Print the integer in the Y register
            _Console.putText(state.Yreg.toString());
        }
        else if (state.Xreg === 2) {
            // Print the 0x00 terminated string stored at address in the Y register
            let address = state.Yreg;
            let charCode = _MemoryAccessor.read(address);
            while (charCode !== 0x00) {
                _Console.putText(String.fromCharCode(charCode));
                charCode = _MemoryAccessor.read(++address);
            }
        }
    });
})(TSOS || (TSOS = {}));
//# sourceMappingURL=instructions.js.map