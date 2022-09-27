var TSOS;
(function (TSOS) {
    TSOS.instructions = new Map();
    TSOS.instructions.set(0xA9, state => {
        // Load the accumulator with a constant
        state.Acc = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xAD, state => {
        // Load the accumulator from memory
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        // console.log(`hob: ${hob.toString(16)}, lob: ${lob.toString(16)}`)
        const address = hob << 8 | lob;
        state.Acc = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0x8D, state => {
        // Store the accumulator in memory
        // get address to store at
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        _MemoryAccessor.write(address, state.Acc);
    });
    TSOS.instructions.set(0x6D, state => {
        // Add with carry
        // get address to add
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        state.Acc = TSOS.Utils.compAddition(state.Acc, _MemoryAccessor.read(address));
    });
    TSOS.instructions.set(0xA2, state => {
        // Load X from constant
        state.Xreg = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xAE, state => {
        // Load X from memory
        // get address to add
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        state.Xreg = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0xA0, state => {
        // Load Y from constant
        state.Yreg = _MemoryAccessor.read(state.PC++);
    });
    TSOS.instructions.set(0xAC, state => {
        // Load Y from memory
        // get address to add
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        state.Yreg = _MemoryAccessor.read(address);
    });
    TSOS.instructions.set(0xEA, state => {
        // No Op
    });
    TSOS.instructions.set(0x00, state => {
        // Break (which is really a system call)
        _CPU.isExecuting = false;
    });
    TSOS.instructions.set(0xEC, state => {
        // Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
        // get address to compare
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        state.Zflag = (state.Xreg === _MemoryAccessor.read(address));
    });
    TSOS.instructions.set(0xD0, state => {
        // Branch n bytes if Z flag = 0
        const bytesToBranch = _MemoryAccessor.read(state.PC++);
        if (state.Zflag === false) {
            // console.log(`Branching ${bytesToBranch} bytes from ${state.PC}`)
            state.PC += bytesToBranch;
            if (state.PC > 0xFF) {
                state.PC -= 0x100;
            }
            // console.log("to " + state.PC)
        }
    });
    TSOS.instructions.set(0xEE, state => {
        // Increment the value of a byte
        // get address to increment
        const [lob, hob] = [_MemoryAccessor.read(state.PC++), _MemoryAccessor.read(state.PC++)];
        const address = hob << 8 | lob;
        // safely add to byte and write it back
        _MemoryAccessor.write(address, TSOS.Utils.compAddition(1, _MemoryAccessor.read(address)));
    });
    TSOS.instructions.set(0xFF, state => {
        // System Call
        if (state.Xreg === 1) { // Print the integer in the Y register
            _Console.putText(state.Yreg.toString(16));
        }
        else if (state.Xreg === 2) { // Print the 0x00 terminated string stored at address in the Y register
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