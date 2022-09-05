/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.history = [];
        }
        init() {
            // Load the command list.
            // I refactored this because I felt that it didn't make much sense to have the manual entries 
            // and the rest of the commands in different places, I modified the ShellCommand class to handle this
            // Further improvements would be to use a map for command lookups
            // ver
            this.commandList.push(new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.", "Get the current version number of the OS"));
            // help
            this.commandList.push(new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.", "Help displays a list of (hopefully) valid commands."));
            // shutdown
            this.commandList.push(new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.", "Starve me of energy"));
            // cls
            this.commandList.push(new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.", "Erase the screen"));
            // man <topic> 
            this.commandList.push(new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.", "It's short for 'manual' do you want to read one?"));
            // trace <on | off>
            this.commandList.push(new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.", "Enable/disable the trace feature"));
            // rot13 <string>
            this.commandList.push(new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.", "13 Character caesar cipher"));
            // prompt <string>
            this.commandList.push(new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.", "<-- Change the prompt"));
            // date
            this.commandList.push(new TSOS.ShellCommand(this.shellDate, "date", "- Display the current date", "Check the date"));
            // whereami
            this.commandList.push(new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Figure out where you are", "I will try to guess your location"));
            // roulette
            this.commandList.push(new TSOS.ShellCommand(this.shellRoulette, "roulette", "- Play a game", "Just play the game and see what happens, its better that way"));
            // status
            this.commandList.push(new TSOS.ShellCommand(this.shellStatus, "status", "- Set the status displayed in the taskbar", "Provide a status to set for the taskbar"));
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
            this.shellStatus(["Content"]);
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //Add the input buffer to our history
            _OsShell.history.push(buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            var _a;
            if (args.length > 0) {
                const topic = args[0];
                // Get the manual entry, or if not found, say no manual entry
                const manual = ((_a = _OsShell.commandList.find(cmd => cmd.command === topic)) === null || _a === void 0 ? void 0 : _a.manual) || "No manual entry for " + args[0] + ".";
                _StdOut.putText(manual);
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate() {
            const now = new Date();
            _StdOut.putText("It is " + now.toDateString());
        }
        shellWhereAmI() {
            const places = ["the beach", "the mall", "your house", "the park", "the library"];
            const i = Math.floor(places.length * Math.random());
            _StdOut.putText("You are at " + places[i]);
        }
        shellRoulette() {
            const bullet = Math.floor(6 * Math.random());
            if (bullet === 0) {
                _StdOut.putText("BANG! Your dead!");
            }
            else {
                _StdOut.putText("You live to see another day... for now");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                document.getElementById('status').innerText = `Status: ${args.join(" ")}`;
            }
            else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map