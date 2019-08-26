//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
   this.version = 2112;

   this.init = function() {
      var msg = "Hello [subject name here]. Let's test our FINAL PROJECT (woot woot woot woot).\n";
      alert(msg);
   };

   this.afterStartup = function() {

      // Force scrolling with a few 'help' commands.
      _KernelInputQueue.enqueue('h');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('p');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
      _KernelInputQueue.enqueue('h');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('p');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Test the 'ver' command.
      _KernelInputQueue.enqueue('v');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('r');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Test the 'date' command.
      _KernelInputQueue.enqueue('d');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('t');
      _KernelInputQueue.enqueue('e');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Test the 'whereami' command.
      _KernelInputQueue.enqueue('w');
      _KernelInputQueue.enqueue('h');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('m');
      _KernelInputQueue.enqueue('i');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
     
      // Test the 'status' command.
      _KernelInputQueue.enqueue('S');
      _KernelInputQueue.enqueue('t');
      _KernelInputQueue.enqueue('A');
      _KernelInputQueue.enqueue('t');
      _KernelInputQueue.enqueue('U');
      _KernelInputQueue.enqueue('s');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('F');
      _KernelInputQueue.enqueue('i');
      _KernelInputQueue.enqueue('N');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('L');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
      
      // Load some invalid user program code
      document.getElementById("taProgramInput").value="This is NOT hex.";
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Format the hard drive so we can load FOUR or more programs.
      _KernelInputQueue.enqueue('f');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('m');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('t');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // getschedule
      _KernelInputQueue.enqueue('g');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('t');
      _KernelInputQueue.enqueue('s');
      _KernelInputQueue.enqueue('c');
      _KernelInputQueue.enqueue('h');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('d');
      _KernelInputQueue.enqueue('u');
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('e');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Load FOUR different valid user programs code and run them.                                                                                                           . . . and here.
      var code1 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 03 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 61 00 61 64 6F 6E 65 00";
      var code2 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 06 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 62 00 62 64 6F 6E 65 00";
      var code3 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 09 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 63 00 63 64 6F 6E 65 00";
      var code4 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 0C AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 64 00 64 64 6F 6E 65 00";

		setTimeout(function(){ document.getElementById("taProgramInput").value = code1;
								     _KernelInputQueue.enqueue('l');
								     _KernelInputQueue.enqueue('o');
								     _KernelInputQueue.enqueue('a');
								     _KernelInputQueue.enqueue('d');
								     TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
									}, 1000);

		setTimeout(function(){ document.getElementById("taProgramInput").value = code2;
								     _KernelInputQueue.enqueue('l');
								     _KernelInputQueue.enqueue('o');
								     _KernelInputQueue.enqueue('a');
								     _KernelInputQueue.enqueue('d');
								     TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
									}, 2000);

		setTimeout(function(){ document.getElementById("taProgramInput").value = code3;
								     _KernelInputQueue.enqueue('l');
								     _KernelInputQueue.enqueue('o');
								     _KernelInputQueue.enqueue('a');
								     _KernelInputQueue.enqueue('d');
								     TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
									}, 3000);

		setTimeout(function(){ document.getElementById("taProgramInput").value = code4;
								     _KernelInputQueue.enqueue('l');
								     _KernelInputQueue.enqueue('o');
								     _KernelInputQueue.enqueue('a');
								     _KernelInputQueue.enqueue('d');
								     TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
									}, 3000);

		setTimeout(function(){ _KernelInputQueue.enqueue('r');
								     _KernelInputQueue.enqueue('u');
								     _KernelInputQueue.enqueue('n');
								     _KernelInputQueue.enqueue('a');
								     _KernelInputQueue.enqueue('l');      
								     _KernelInputQueue.enqueue('l');            
								     TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);		
									}, 4000);

	   // Remind myself to test the file system.
	   _KernelInputQueue.enqueue('S');
	   _KernelInputQueue.enqueue('t');
	   _KernelInputQueue.enqueue('A');
	   _KernelInputQueue.enqueue('t');
	   _KernelInputQueue.enqueue('U');
	   _KernelInputQueue.enqueue('s');
	   _KernelInputQueue.enqueue(' ');
	   _KernelInputQueue.enqueue('T');
	   _KernelInputQueue.enqueue('e');
	   _KernelInputQueue.enqueue('s');
	   _KernelInputQueue.enqueue('t');
	   _KernelInputQueue.enqueue(' ');
	   _KernelInputQueue.enqueue('t');
	   _KernelInputQueue.enqueue('h');
	   _KernelInputQueue.enqueue('e');
	   _KernelInputQueue.enqueue(' ');
	   _KernelInputQueue.enqueue('f');
	   _KernelInputQueue.enqueue('i');
	   _KernelInputQueue.enqueue('l');
	   _KernelInputQueue.enqueue('e');
	   _KernelInputQueue.enqueue(' ');
	   _KernelInputQueue.enqueue('s');
	   _KernelInputQueue.enqueue('y');
	   _KernelInputQueue.enqueue('s');
	   _KernelInputQueue.enqueue('t');
	   _KernelInputQueue.enqueue('e');
	   _KernelInputQueue.enqueue('m');
	   TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
   };
		
}
