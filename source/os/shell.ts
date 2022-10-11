/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList: ShellCommand[] = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public history: string[] = [];

        constructor() {
        }

        public init() {
            // Load the command list.
            // I refactored this because I felt that it didn't make much sense to have the manual entries 
            // and the rest of the commands in different places, I modified the ShellCommand class to handle this
            // Further improvements would be to use a map for command lookups

            // ver
            this.commandList.push(new ShellCommand(
                this.shellVer,
                "ver",
                "- Displays the current version data.",
                "Get the current version number of the OS"
            ));

            // help
            this.commandList.push(new ShellCommand(
                this.shellHelp,
                "help",
                "- This is the help command. Seek help.",
                "Help displays a list of (hopefully) valid commands."
            ))

            // shutdown
            this.commandList.push(new ShellCommand(
                this.shellShutdown,
                "shutdown",
                "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.",
                "Starve me of energy"
            ))

            // cls
            this.commandList.push(new ShellCommand(
                this.shellCls,
                "cls",
                "- Clears the screen and resets the cursor position.",
                "Erase the screen"
            ))

            // man <topic> 
            this.commandList.push(new ShellCommand(
                this.shellMan,
                "man",
                "<topic> - Displays the MANual page for <topic>.",
                "It's short for 'manual' do you want to read one?"
            ))

            // trace <on | off>
            this.commandList.push(new ShellCommand(
                this.shellTrace,
                "trace",
                "<on | off> - Turns the OS trace on or off.",
                "Enable/disable the trace feature"
            ))

            // rot13 <string>
            this.commandList.push(new ShellCommand(
                this.shellRot13,
                "rot13",
                "<string> - Does rot13 obfuscation on <string>.",
                "13 Character caesar cipher"
            ))

            // prompt <string>
            this.commandList.push(new ShellCommand(
                this.shellPrompt,
                "prompt",
                "<string> - Sets the prompt.",
                "<-- Change the prompt"
            ))

            // date
            this.commandList.push(new ShellCommand(
                this.shellDate,
                "date",
                "- Display the current date",
                "Check the date"
            ))

            // whereami
            this.commandList.push(new ShellCommand(
                this.shellWhereAmI,
                "whereami",
                "- Figure out where you are",
                "I will try to guess your location"
            ))

            // roulette
            this.commandList.push(new ShellCommand(
                this.shellRoulette,
                "roulette",
                "- Play a game",
                "Just play the game and see what happens, its better that way"
            ))

            // status
            this.commandList.push(new ShellCommand(
                this.shellStatus,
                "status",
                "- Set the status displayed in the taskbar",
                "Provide a status to set for the taskbar"
            ))

            // bsod
            this.commandList.push(new ShellCommand(
                this.shellBSOD,
                "bsod",
                "- Trigger an error",
                "Causes an error to take place, used for testing the BSOD"
            ))

            // load
            this.commandList.push(new ShellCommand(
                this.shellLoad,
                "load",
                "- Load the program in the user program area",
                "Validates and loads the program provided by the user in the input on the right"
            ))

            // run
            this.commandList.push(new ShellCommand(
                this.shellRun,
                "run",
                "<number> - Run the program with a given pid",
                "Makes the program loaded execute"
            ))

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
            this.shellStatus(["Content"])
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer: string) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //Add the input buffer to our history
            _OsShell.history.push(buffer)
            
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
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class. Hey, I got the better solution here!

            // var index: number = 0;
            // var found: boolean = false;
            // var fn = undefined;
            // while (!found && index < this.commandList.length) {
            //     if (this.commandList[index].command === cmd) {
            //         found = true;
            //         fn = this.commandList[index].func;
            //     } else {
            //         ++index;
            //     }
            // }

            // Better version of the above
            const fn = this.commandList.find(({command}) => command === cmd)?.func

            if (fn) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn: Function, args?: string[]) {
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

        public parseInput(buffer: string): UserCommand {

            // trim and split the buffer
            // get the first element as the cmd, and the rest as args
            let [cmd, ...args] = buffer.trim().split(" "); 

            // lowercase and remove leading and trailing whitespace
            cmd = cmd.toLowerCase().trim()

            // trim each of the args in the list
            args = args.map(arg => arg.trim())

            return new UserCommand(cmd, args);
        }

        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {
                const topic = args[0].toLowerCase();

                // Get the manual entry, or if not found, say no manual entry
                const manual = _OsShell.commandList.find(cmd => cmd.command === topic)?.manual || "No manual entry for " + args[0] + "."
                
                _StdOut.putText(manual)
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0].toLowerCase();
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate() {
            const now = new Date()

            _StdOut.putText("It is " + now.toDateString())
        }

        public shellWhereAmI() {
            const places = ["the beach", "the mall", "your house", "the park", "the library"]
            const i = Math.floor(places.length * Math.random())

            _StdOut.putText("You are at " + places[i])
        }

        public shellRoulette() {
            const bullet = Math.floor(6 * Math.random())

            if(bullet === 0) {
                _StdOut.putText("BANG! Your dead!")
            } else {
                _StdOut.putText("You live to see another day... for now")
            }
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                document.getElementById('status')!.innerText = `Status: ${args.join(" ")}`
            } else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        }

        public shellBSOD(args: string[]) {
            
            _Kernel.krnTrapError(args?.[0] ?? "Successfully Failed")
            
        }

        public shellLoad() {
            const inputElm = <HTMLInputElement>document.getElementById("taProgramInput")
            const userInput = inputElm.value;

            const result = Utils.validateHexString(userInput)

            if(result){

                inputElm.value = result
                const pcb = _MemoryManager.load(result.split(" ").map(pair => parseInt(pair, 16)))

                // Check if any processes are ready or running on segment 0
                if(!pcb) {
                    _StdOut.putText("There is no room in memory for this process")
                    return
                }

                pcb.state = "Resident"

                _Processes.set(pcb.PID, pcb)
                TSOS.Control.updatePCBs();
                _StdOut.putText("Process ID: " + pcb.PID)
            } else {
                _StdOut.putText("Program is not valid")
            }
        }

        public shellRun(args: string[]) {
            const pid = parseInt(args[0])

            // validate input
            if(args.length > 0 && !isNaN(pid)){
                // Odd way of looping over the processes, convert to array, the index 1 is the actual pcb
                if(Array.from(_Processes).some(([_, pcb]) => pcb.state === "Running")) {
                    _StdOut.putText("A program is currently running... please wait")
                    return
                }

                const pcb = _Processes.get(pid)
                if(!pcb) {
                    _StdOut.putText("Process ID does not exist")
                    return 
                }

                _activeProcess = pid // should be removed later when scheduler is added
                pcb.state = "Running"
                Control.updatePCBs()

                _CPU.loadCPUfromPCB(pcb)

                _CPU.isExecuting = true;
            } else {
                _StdOut.putText("A process ID number must be provided")
            }
        }
    }
}
