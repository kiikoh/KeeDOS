/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _Canvas.height - currentFontSize, buffer = "") {
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
            this.currentYPosition = this.currentYPosition =
                _Canvas.height - this.currentFontSize;
        }
        handleInput() {
            var _a, _b;
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === "Enter" || chr === 13) {
                    // the Enter key
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
                    const charHeight = this.currentFontSize +
                        _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                        1;
                    _DrawingContext.clearRect(this.currentXPosition - charWidth, this.currentYPosition - this.currentFontSize, charWidth, charHeight);
                    this.currentXPosition -= charWidth;
                }
                else if (chr === "Tab") {
                    // command completion
                    const recs = _OsShell.commandList
                        .filter((cmd) => cmd.command.startsWith(this.buffer)) // get all the options where the command matches the beginning
                        .map((cmd) => cmd.command); // take only the command field
                    // if there is only one option use it, otherwise find the largest subset of it
                    // roulette, rot13... r -> ro
                    // load, loadimage... lo -> load.... loadi -> loadimage
                    // something like that
                    const rec = recs.length === 1 ? recs[0] : TSOS.Utils.greatestCommonSubstring(recs);
                    const newText = rec.substring(this.buffer.length);
                    this.buffer += newText;
                    this.putText(newText);
                }
                else if (chr === "ArrowUp") {
                    this.historyIndex++;
                    if (this.historyIndex >= _OsShell.history.length)
                        this.historyIndex = _OsShell.history.length; //protect against out of bounds
                    // get the command to fill
                    const newBuff = (_a = _OsShell.history[_OsShell.history.length - this.historyIndex]) !== null && _a !== void 0 ? _a : "";
                    this.setBuffer(newBuff);
                }
                else if (chr === "ArrowDown") {
                    this.historyIndex--;
                    if (this.historyIndex < 0)
                        this.historyIndex = 0; //protect against out of bounds
                    // get the command to fill
                    const newBuff = (_b = _OsShell.history[_OsShell.history.length - this.historyIndex]) !== null && _b !== void 0 ? _b : "";
                    this.setBuffer(newBuff);
                }
                else if (chr === "ctrl-c") {
                    if (_CPU.isExecuting)
                        _Scheduler.killProcess();
                    this.historyIndex = 0;
                    this.buffer = "";
                    this.advanceLine();
                    this.putText("^C");
                    this.advanceLine();
                    _OsShell.putPrompt();
                }
                else if (typeof chr === "string") {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        }
        setBuffer(text) {
            //get the x position of the prompt
            const promptOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr);
            const lineHeight = this.currentFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
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
                // Get how big the text is to draw
                let offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                // we cant write this line, need to wrap
                if (this.currentXPosition + offset > _Canvas.width) {
                    const words = text.split(" ");
                    let numWords = 0;
                    // loop while the words dont overflow the line
                    while (TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, words.slice(0, numWords).join(" ")) +
                        this.currentXPosition <
                        _Canvas.width) {
                        numWords++;
                    }
                    numWords--;
                    // a word is too big, we need to split by letters
                    if (numWords === 0) {
                        const letters = words[0].split("");
                        let numLetters = 0;
                        // loop while the words dont overflow the line
                        while (TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, letters.slice(0, numLetters).join("")) +
                            this.currentXPosition <
                            _Canvas.width) {
                            numLetters++;
                        }
                        numLetters--;
                        this.putText(letters.slice(0, numLetters).join("")); // print the letters on the first line
                        this.advanceLine();
                        this.putText(letters.slice(numLetters).join(" ")); // print the rest of the letters recursively
                        return this.putText(words.slice(1).join(" ")); // print the rest of the line
                    }
                    // print the maximum number of words on the line, then print the rest recursively
                    this.putText(words.slice(0, numWords).join(" "));
                    this.advanceLine();
                    return this.putText(words.slice(numWords).join(" "));
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
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
            const dY = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            this.currentYPosition += dY;
            if (this.currentYPosition > _Canvas.height) {
                // we need to scroll
                const hist = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height); //pick up the data
                this.clearScreen();
                _DrawingContext.putImageData(hist, 0, -dY); // and move it somewhere else
                this.currentYPosition = _Canvas.height - this.currentFontSize; // the cursor should be at the bottom now
            }
        }
        screensaver() {
            const SCALE = 0.3;
            // const DVD_IMAGE = new Image();
            // DVD_IMAGE.src = "../images/DVD_logo.svg";
            const DVD_IMAGE = new Path2D("M118.895 20.346s-13.743 16.922-13.04 18.001c.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H22.175l-2.56 11.068h23.878c12.415 0 19.995 5.132 17.878 14.225-2.287 9.901-13.123 14.128-24.665 14.128H32.39l5.552-24.208H18.647l-8.192 35.368h27.398c20.612 0 40.166-11.067 43.692-25.288.617-2.614.53-9.185-1.054-13.053 0-.093-.091-.271-.178-.537-.087-.093-.178-.722.178-.814.172-.092.525.271.525.358 0 0 .179.456.351.813l17.44 50.315 44.404-51.216 18.761-.092h4.579c12.424 0 20.09 5.132 17.969 14.225-2.29 9.901-13.205 14.128-24.75 14.128h-4.405L161 19.987h-19.287l-8.198 35.368h27.398c20.611 0 40.343-11.067 43.604-25.288 3.347-14.225-11.101-25.293-31.89-25.293H131.757c-10.834 13.049-12.862 15.572-12.862 15.572zM99.424 67.329C47.281 67.329 5 73.449 5 81.012 5 88.57 47.281 94.69 99.424 94.69c52.239 0 94.524-6.12 94.524-13.678.001-7.563-42.284-13.683-94.524-13.683zm-3.346 18.544c-11.98 0-21.58-2.072-21.58-4.595 0-2.523 9.599-4.59 21.58-4.59 11.888 0 21.498 2.066 21.498 4.59 0 2.523-9.61 4.595-21.498 4.595z");
            const [width, height] = [185, 100];
            // clear the screen
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
            _screensaverState.x += _screensaverState.vx;
            _screensaverState.y += _screensaverState.vy;
            // bounce off the walls
            if (_screensaverState.x > _Canvas.width - width ||
                _screensaverState.x < 0) {
                _screensaverState.vx *= -1;
            }
            if (_screensaverState.y > _Canvas.height - height ||
                _screensaverState.y < 0) {
                _screensaverState.vy *= -1;
            }
            _DrawingContext.fillStyle =
                "hsl(" + (_screensaverState.hue++ % 360) + ", 100%, 50%)";
            _DrawingContext.setTransform(1, 0, 0, 1, _screensaverState.x, _screensaverState.y);
            _DrawingContext.fill(DVD_IMAGE, "evenodd");
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map