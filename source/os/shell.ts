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
    public curses =
      "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    public apologies = "[sorry]";
    public history: string[] = [];

    constructor() {}

    public init() {
      // Load the command list.
      // I refactored this because I felt that it didn't make much sense to have the manual entries
      // and the rest of the commands in different places, I modified the ShellCommand class to handle this
      // Further improvements would be to use a map for command lookups

      // ver
      this.commandList.push(
        new ShellCommand(
          this.shellVer,
          "ver",
          "- Displays the current version data.",
          "Get the current version number of the OS"
        )
      );

      // help
      this.commandList.push(
        new ShellCommand(
          this.shellHelp,
          "help",
          "- This is the help command. Seek help.",
          "Help displays a list of (hopefully) valid commands."
        )
      );

      // shutdown
      this.commandList.push(
        new ShellCommand(
          this.shellShutdown,
          "shutdown",
          "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.",
          "Starve me of energy"
        )
      );

      // cls
      this.commandList.push(
        new ShellCommand(
          this.shellCls,
          "cls",
          "- Clears the screen and resets the cursor position.",
          "Erase the screen"
        )
      );

      // man <topic>
      this.commandList.push(
        new ShellCommand(
          this.shellMan,
          "man",
          "<topic> - Displays the MANual page for <topic>.",
          "It's short for 'manual' do you want to read one?"
        )
      );

      // trace <on | off>
      this.commandList.push(
        new ShellCommand(
          this.shellTrace,
          "trace",
          "<on | off> - Turns the OS trace on or off.",
          "Enable/disable the trace feature"
        )
      );

      // rot13 <string>
      this.commandList.push(
        new ShellCommand(
          this.shellRot13,
          "rot13",
          "<string> - Does rot13 obfuscation on <string>.",
          "13 Character caesar cipher"
        )
      );

      // prompt <string>
      this.commandList.push(
        new ShellCommand(
          this.shellPrompt,
          "prompt",
          "<string> - Sets the prompt.",
          "<-- Change the prompt"
        )
      );

      // date
      this.commandList.push(
        new ShellCommand(
          this.shellDate,
          "date",
          "- Display the current date",
          "Check the date"
        )
      );

      // whereami
      this.commandList.push(
        new ShellCommand(
          this.shellWhereAmI,
          "whereami",
          "- Figure out where you are",
          "I will try to guess your location"
        )
      );

      // roulette
      this.commandList.push(
        new ShellCommand(
          this.shellRoulette,
          "roulette",
          "- Play a game",
          "Just play the game and see what happens, its better that way"
        )
      );

      // status
      this.commandList.push(
        new ShellCommand(
          this.shellStatus,
          "status",
          "- Set the status displayed in the taskbar",
          "Provide a status to set for the taskbar"
        )
      );

      // bsod
      this.commandList.push(
        new ShellCommand(
          this.shellBSOD,
          "bsod",
          "- Trigger an error",
          "Causes an error to take place, used for testing the BSOD"
        )
      );

      // load
      this.commandList.push(
        new ShellCommand(
          this.shellLoad,
          "load",
          "- Load the program in the user program area",
          "Validates and loads the program provided by the user in the input on the right"
        )
      );

      // run
      this.commandList.push(
        new ShellCommand(
          this.shellRun,
          "run",
          "<number> - Run the program with a given pid",
          "Makes the program loaded execute"
        )
      );

      // ps  - list the running processes and their IDs
      this.commandList.push(
        new ShellCommand(
          this.shellPs,
          "ps",
          "- List the running processes and their IDs",
          "Lists the running processes and their IDs"
        )
      );

      this.commandList.push(
        new ShellCommand(
          this.shellRunAll,
          "runall",
          "- Runs all programs in memory",
          "Runs all programs in memory"
        )
      );

      // killall
      this.commandList.push(
        new ShellCommand(
          this.shellKillAll,
          "killall",
          "- Kills all running processes",
          "Kills all running processes"
        )
      );

      // kill <id> - kills the specified process id.

      this.commandList.push(
        new ShellCommand(
          this.shellKill,
          "kill",
          "<number> - Kills the process with the given pid",
          "Kills the process with the given pid"
        )
      );

      // quantum
      this.commandList.push(
        new ShellCommand(
          this.shellQuantum,
          "quantum",
          "<number> - Sets the quantum for round robin scheduling",
          "Sets the quantum for round robin scheduling"
        )
      );

      // clearmem
      this.commandList.push(
        new ShellCommand(
          this.shellClearMem,
          "clearmem",
          "- Clears all memory partitions",
          "Clears all memory partitions"
        )
      );

      // format
      this.commandList.push(
        new ShellCommand(
          this.shellFormat,
          "format",
          "- Formats the disk",
          "Formats the disk"
        )
      );

      // create
      this.commandList.push(
        new ShellCommand(
          this.shellCreate,
          "create",
          "<filename> - Creates a file",
          "Creates a file"
        )
      );

      // write
      this.commandList.push(
        new ShellCommand(
          this.shellWrite,
          "write",
          '<filename> "data" - Writes data to a file',
          "Writes data to a file"
        )
      );

      // read
      this.commandList.push(
        new ShellCommand(
          this.shellRead,
          "read",
          "<filename> - Reads data from a file",
          "Reads data from a file"
        )
      );

      // ls
      this.commandList.push(
        new ShellCommand(
          this.shellLs,
          "ls",
          "- Lists all files",
          "Lists all files"
        )
      );

      this.commandList.push(
        new ShellCommand(
          this.shellDelete,
          "delete",
          "<filename> - Deletes a file",
          "Deletes a file"
        )
      );

      this.commandList.push(
        new ShellCommand(
          this.shellRename,
          "rename",
          "<filename> <newfilename> - Renames a file",
          "Renames a file"
        )
      );

      this.commandList.push(
        new ShellCommand(
          this.shellCopy,
          "copy",
          "<filename> <newfilename> - Copies a file",
          "Copies a file"
        )
      );

      // Display the initial prompt.
      this.putPrompt();
      this.shellStatus(["Content"]);
    }

    public putPrompt() {
      _StdOut.putText(this.promptStr);
    }

    public handleInput(buffer: string) {
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
      const fn = this.commandList.find(({ command }) => command === cmd)?.func;

      if (fn) {
        this.execute(fn, args); // Note that args is always supplied, though it might be empty.
      } else {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {
          // Check for curses.
          this.execute(this.shellCurse);
        } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
          // Check for apologies.
          this.execute(this.shellApology);
        } else {
          // It's just a bad command. {
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
      // split on spaces, but keep spaces in quotes
      let [cmd, ...args] = buffer.trim().match(/(?:[^\s"]+|"[^"]*")+/g);

      // lowercase and remove leading and trailing whitespace
      cmd = cmd.toLowerCase().trim();

      // trim each of the args in the list
      args = args.map((arg) => arg.trim());

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
        _StdOut.putText(
          "  " +
            _OsShell.commandList[i].command +
            " " +
            _OsShell.commandList[i].description
        );
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
        const manual =
          _OsShell.commandList.find((cmd) => cmd.command === topic)?.manual ||
          "No manual entry for " + args[0] + ".";

        _StdOut.putText(manual);
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
        _StdOut.putText(
          args.join(" ") + " = '" + Utils.rot13(args.join(" ")) + "'"
        );
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
      const now = new Date();

      _StdOut.putText("It is " + now.toDateString());
    }

    public shellWhereAmI() {
      const places = [
        "the beach",
        "the mall",
        "your house",
        "the park",
        "the library",
      ];
      const i = Math.floor(places.length * Math.random());

      _StdOut.putText("You are at " + places[i]);
    }

    public shellRoulette() {
      const bullet = Math.floor(6 * Math.random());

      if (bullet === 0) {
        _StdOut.putText("BANG! Your dead!");
      } else {
        _StdOut.putText("You live to see another day... for now");
      }
    }

    public shellStatus(args: string[]) {
      if (args.length > 0) {
        document.getElementById("status")!.innerText = `Status: ${args.join(
          " "
        )}`;
      } else {
        _StdOut.putText("Usage: status <string> Please supply a string.");
      }
    }

    public shellBSOD(args: string[]) {
      _Kernel.krnTrapError(args?.[0] ?? "Successfully Failed");
    }

    public shellLoad() {
      const inputElm = <HTMLInputElement>(
        document.getElementById("taProgramInput")
      );
      const userInput = inputElm.value;

      const result = Utils.validateHexString(userInput);

      if (result) {
        inputElm.value = result;
        const pcb = _MemoryManager.load(
          result.split(" ").map((pair) => parseInt(pair, 16))
        );

        // Check if any processes are ready or running on segment 0
        if (!pcb) {
          _StdOut.putText("There is no room in memory for this process");
          return;
        }

        _StdOut.putText(
          "Process ID " +
            pcb.PID +
            " loaded successfully to segment " +
            pcb.segment
        );
      } else {
        _StdOut.putText("Program is not valid");
      }
    }

    public shellRun(args: string[]) {
      const pid = parseInt(args[0]);

      // validate input
      if (args.length > 0 && !isNaN(pid)) {
        const pcb = _Scheduler.residentList.get(pid);
        if (!pcb) {
          _StdOut.putText("Process ID does not exist");
          return;
        }

        if (pcb.state !== "Resident") {
          _StdOut.putText("Process has already been run");
          return;
        }

        pcb.state = "Ready";
        _Scheduler.readyQueue.enqueue(pcb.PID);
        _Scheduler.readyProcess();
        Control.updatePCBs();
      } else {
        _StdOut.putText("A process ID number must be provided");
      }
    }

    public shellPs() {
      Array.from(_Scheduler.residentList)
        .map(([pid, pcb]) => `PID: ${pid}        State: ${pcb.state}`)
        .forEach((line) => {
          _StdOut.putText(line);
          _StdOut.advanceLine();
        });
    }

    public shellRunAll() {
      Array.from(_Scheduler.residentList).forEach(([pid, pcb]) => {
        if (pcb.state === "Resident") {
          pcb.state = "Ready";
          _Scheduler.readyQueue.enqueue(pid);
        }
      });

      _Scheduler.readyProcess();
    }

    public shellKill(args: string[]) {
      const pid = parseInt(args[0]);

      // validate input
      if (args.length > 0 && !isNaN(pid)) {
        const pcb = _Scheduler.residentList.get(pid);
        if (!pcb) {
          _StdOut.putText("Process ID does not exist");
          return;
        }

        if (pcb.state === "Terminated") {
          _StdOut.putText("Process has already been terminated");
          return;
        }

        _Scheduler.killProcess(pid);

        _StdOut.putText("Process " + pid + " has been terminated");
      } else {
        _StdOut.putText("A process ID number must be provided");
      }
    }

    public shellKillAll() {
      Array.from(_Scheduler.residentList).forEach(([pid, pcb]) => {
        if (pcb.state !== "Terminated") {
          _Scheduler.killProcess(pid);
        }
      });

      _StdOut.putText("All processes have been terminated");

      _Scheduler.readyProcess();
    }

    public shellQuantum(args: string[]) {
      const quantum = parseInt(args[0]);

      // validate input
      if (args.length > 0 && !isNaN(quantum) && quantum > 1) {
        _Scheduler.quantum = quantum;
        Array.from(_Scheduler.residentList).forEach(([pid, pcb]) => {
          if (pcb.state === "Resident" || pcb.state === "Ready") {
            pcb.quantumRemaining = quantum;
            Control.updatePCBs();
          }
        });

        _StdOut.putText("Quantum has been set to " + quantum);
      } else {
        _StdOut.putText("A quantum number must be provided");
      }
    }

    public shellClearMem() {
      // only allow if nothing is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot clear memory while a process is running");
        return;
      }

      Array.from(_Scheduler.residentList).forEach(([pid, pcb]) => {
        if (pcb.state === "Resident" || pcb.state === "Ready") {
          _Scheduler.killProcess(pid);
        }
      });

      _MemoryAccessor.clearMemory();
      _StdOut.putText("Memory cleared");

      Control.updatePCBs();
    }

    public shellFormat(): void {
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot format disk while a process is running");
        return;
      }

      _krnDiskDriver.format();
      _StdOut.putText("Disk formatted");
    }

    public shellCreate(args: string[]): void {
      // check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a process is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot create file while a process is running");
        return;
      }

      // check if a filename was provided
      if (args.length === 0) {
        _StdOut.putText("Usage: create <filename> Please supply a filename.");
        return;
      }

      const filename = args[0];

      // check if filename is valid
      if (filename.length > 60) {
        _StdOut.putText("Filename must be less than 60 characters");
        return;
      }

      // make sure no dupes
      if (_krnDiskDriver.ls().includes(filename)) {
        _StdOut.putText("Filename already in use");
        return;
      }

      _krnDiskDriver.create(filename);

      _StdOut.putText("File created successfully");
    }

    public shellWrite(args: string[]): void {
      // check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a process is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot write to file while a process is running");
        return;
      }

      // check if a filename and data was provided in quotes
      if (
        args.length !== 2 ||
        args[1][0] !== '"' ||
        args[1][args[1].length - 1] !== '"'
      ) {
        _StdOut.putText('Usage: write <filename> "data"');
        return;
      }

      // try to write to file
      const filename = args[0];
      const data = args[1].substring(1, args[1].length - 1);

      const isSuccess = _krnDiskDriver.write(filename, data);

      if (isSuccess) {
        _StdOut.putText("Data written successfully");
      } else {
        _StdOut.putText("Error writing to file");
      }
    }

    public shellRead(args: string[]): void {
      // check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a filename was provided
      if (args.length === 0) {
        _StdOut.putText("Usage: read <filename> Please supply a filename.");
        return;
      }

      const filename = args[0];

      const data = _krnDiskDriver.read(filename);

      if (data !== null) {
        _StdOut.putText(data);
      } else {
        _StdOut.putText("File not found");
      }
    }

    public shellLs(args: string[]): void {
      // check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      const filenames = _krnDiskDriver.ls(args[0] === "-a");
      if (filenames.length > 0) {
        _StdOut.putText(filenames.join("   "));
      } else {
        _StdOut.putText("No files found");
      }
    }

    public shellDelete(args: string[]): void {
      //check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a process is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot delete file while a process is running");
        return;
      }

      // check if a filename was provided
      if (args.length === 0) {
        _StdOut.putText("Usage: delete <filename> Please supply a filename.");
        return;
      }

      const filename = args[0];
      _krnDiskDriver.delete(filename);
    }

    public shellRename(args: string[]): void {
      //check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a process is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot rename file while a process is running");
        return;
      }

      // check if a filename was provided
      if (args.length !== 2) {
        _StdOut.putText("Usage: rename <filename> <new filename>");
        return;
      }

      const filename = args[0];
      const newFilename = args[1];

      if (newFilename.length > 60 || filename.length > 60) {
        _StdOut.putText("Filename must be less than 60 characters");
        return;
      }

      const isSuccess = _krnDiskDriver.rename(filename, newFilename);

      if (isSuccess) {
        _StdOut.putText("File renamed successfully");
      } else {
        _StdOut.putText("Error renaming file");
      }
    }

    public shellCopy(args: string[]): void {
      //check if disk is formatted
      if (!_krnDiskDriver.isFormatted) {
        _StdOut.putText("Disk is not formatted");
        return;
      }

      // check if a process is running
      if (_CPU.isExecuting) {
        _StdOut.putText("Cannot copy file while a process is running");
        return;
      }

      // check if filenames were provided
      if (args.length !== 2) {
        _StdOut.putText("Usage: copy <filename> <new filename>");
        return;
      }

      const filename = args[0];
      const newFilename = args[1];

      if (newFilename.length > 60 || filename.length > 60) {
        _StdOut.putText("Filename must be less than 60 characters");
        return;
      }

      const isSuccess = _krnDiskDriver.copy(filename, newFilename);

      if (isSuccess) {
        _StdOut.putText("File copied successfully");
      } else {
        _StdOut.putText("Error copying file");
      }
    }
  }
}
