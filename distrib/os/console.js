"use strict";
/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.historyIndex = 0;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
            document.getElementById('divConsole').scrollTop = 0;
        }
        handleInput() {
            var _a, _b, _c, _d;
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === "Enter") { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    this.historyIndex = 0;
                }
                else if (chr === "Backspace") {
                    const removed = this.buffer.charAt(this.buffer.length - 1);
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                    const charWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, removed);
                    const charHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + 1;
                    _DrawingContext.clearRect(this.currentXPosition - charWidth, this.currentYPosition - this.currentFontSize, charWidth, charHeight);
                    this.currentXPosition -= charWidth;
                }
                else if (chr === "Tab") {
                    // command completion
                    // finds the first instance where the current text is the start of a command
                    const reccomendation = (_b = (_a = _OsShell.commandList.find(cmd => cmd.command.startsWith(this.buffer))) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : this.buffer;
                    const newText = reccomendation.substring(this.buffer.length);
                    this.buffer += newText;
                    this.putText(newText);
                }
                else if (chr === "ArrowUp") {
                    this.historyIndex++;
                    if (this.historyIndex >= _OsShell.history.length)
                        this.historyIndex = _OsShell.history.length; //protect against out of bounds
                    // get the command to fill
                    const newBuff = (_c = _OsShell.history[_OsShell.history.length - this.historyIndex]) !== null && _c !== void 0 ? _c : "";
                    this.setBuffer(newBuff);
                }
                else if (chr === "ArrowDown") {
                    this.historyIndex--;
                    if (this.historyIndex < 0)
                        this.historyIndex = 0; //protect against out of bounds
                    // get the command to fill
                    const newBuff = (_d = _OsShell.history[_OsShell.history.length - this.historyIndex]) !== null && _d !== void 0 ? _d : "";
                    this.setBuffer(newBuff);
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        setBuffer(text) {
            //get the x position of the prompt
            const promptOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr);
            const lineHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // clear the line of existing text
            _DrawingContext.clearRect(promptOffset, this.currentYPosition - this.currentFontSize, //only count the ascent
            _Canvas.width, lineHeight + 1 // for some reason need to overshoot still
            );
            this.currentXPosition = promptOffset;
            //set the command
            this.buffer = text;
            this.putText(text);
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            document.getElementById('divConsole').scrollTop = this.currentYPosition + this.currentFontSize - 500;
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map