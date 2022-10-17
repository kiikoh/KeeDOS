/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        private historyIndex = 0;

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _Canvas.height - currentFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentYPosition = _Canvas.height - this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === "Enter" || chr === 13) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    this.historyIndex = 0
                } else if(chr === "Backspace") {
                    const removed = this.buffer.charAt(this.buffer.length - 1)
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1)

                    const charWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, removed)
                    const charHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + 1

                    _DrawingContext.clearRect(
                        this.currentXPosition - charWidth, 
                        this.currentYPosition - this.currentFontSize, 
                        charWidth,
                        charHeight
                    )
                    this.currentXPosition -= charWidth
                } else if(chr === "Tab") {
                    // command completion
                    const recs = _OsShell.commandList
                        .filter(cmd => cmd.command.startsWith(this.buffer)) // get all the options where the command matches the beginning
                        .map(cmd => cmd.command) // take only the command field


                    // if there is only one option use it, otherwise find the largest subset of it
                    // roulette, rot13... r -> ro
                    // load, loadimage... lo -> load.... loadi -> loadimage
                    // something like that
                    const rec = recs.length === 1 ? recs[0] : Utils.greatestCommonSubstring(recs) 

                    const newText = rec.substring(this.buffer.length)

                    this.buffer += newText
                    this.putText(newText)
                } else if(chr === "ArrowUp") {
                    this.historyIndex++;
                    if(this.historyIndex >= _OsShell.history.length) this.historyIndex = _OsShell.history.length; //protect against out of bounds
                    
                    // get the command to fill
                    const newBuff = _OsShell.history[_OsShell.history.length - this.historyIndex] ?? ""

                    this.setBuffer(newBuff)
                } else if(chr === "ArrowDown") {
                    this.historyIndex--;
                    if(this.historyIndex < 0) this.historyIndex = 0; //protect against out of bounds
                    
                    // get the command to fill
                    const newBuff = _OsShell.history[_OsShell.history.length - this.historyIndex] ?? ""
                    
                    this.setBuffer(newBuff)
                } else if(chr === "ctrl-c") {
                    
                    _CPU.isExecuting = false;
                    _Scheduler.getActivePCB() && (_Scheduler.getActivePCB().state = "Terminated")
                    TSOS.Control.updatePCBs()

                    this.historyIndex = 0
                    this.buffer = ""
                    this.advanceLine()
                    this.putText("^C")
                    this.advanceLine()
                    _OsShell.putPrompt()

                } else if(typeof chr === "string") {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                } 
            }
        }

        public setBuffer(text: string) {
            //get the x position of the prompt
            const promptOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr)
            const lineHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize)

            // clear the line of existing text
            _DrawingContext.clearRect(
                promptOffset, 
                this.currentYPosition - this.currentFontSize, //only count the ascent
                _Canvas.width,
                lineHeight + 1 // for some reason need to overshoot still
            )
            this.currentXPosition = promptOffset

            //set the command
            this.buffer = text;
            this.putText(text)
        }

        public putText(text: string): void {
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
                if(this.currentXPosition + offset > _Canvas.width) {
                    const words = text.split(" ")
                    let numWords = 0;
                    
                    // loop while the words dont overflow the line
                    while(CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, words.slice(0, numWords).join(" ")) + this.currentXPosition < _Canvas.width) {
                        numWords++;
                    }
                    numWords--;

                    // a word is too big, we need to split by letters
                    if(numWords === 0) {
                        const letters = words[0].split("")
                        let numLetters = 0;
                        
                        // loop while the words dont overflow the line
                        while(CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, letters.slice(0, numLetters).join("")) + this.currentXPosition < _Canvas.width) {
                            numLetters++;
                        }
                        numLetters--;
                        this.putText(letters.slice(0, numLetters).join("")) // print the letters on the first line
                        this.advanceLine()
                        this.putText(letters.slice(numLetters).join(" ")) // print the rest of the letters recursively
                        return this.putText(words.slice(1).join(" ")) // print the rest of the line
                    }

                    // print the maximum number of words on the line, then print the rest recursively
                    this.putText(words.slice(0, numWords).join(" "))
                    this.advanceLine()
                    return this.putText(words.slice(numWords).join(" "))
                }


                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                this.currentXPosition = this.currentXPosition + offset;
            }
        
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */


            const dY: number = _DefaultFontSize + 
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin

            this.currentYPosition += dY;

            if(this.currentYPosition > _Canvas.height){ // we need to scroll
                const hist = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height) //pick up the data 
                this.clearScreen()
                _DrawingContext.putImageData(hist, 0, -dY) // and move it somewhere else
                this.currentYPosition = _Canvas.height - this.currentFontSize; // the cursor should be at the bottom now
            }

        }
    }
 }
