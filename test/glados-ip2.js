//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
   this.version = 2112;

   this.init = function() {
      var msg = "Hello [subject name here]. Let's test project TWO.\n";
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
     
      // Load some invalid user program code
      document.getElementById("taProgramInput").value = "This is NOT hex.";
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);


      // Use the 'status' command to give the expected output of the program below.
		var str = "status output should be similar to 'counting0counting1hello worldcounting 2'.";
		for (var i = 0; i < str.length; i++) {
			_KernelInputQueue.enqueue(str[i]);
		}
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);              		
		
      // Load a valid user program code and run it.
      var code = "A9 00 8D 00 00 EA A9 00 8D 4C 00 A9 00 8D 4C 00 A2 03 EC 4C 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4D A2 02 FF AC 4C 00 A2 01 FF A9 01 6D 4C 00 8D 4C 00 A2 02 EC 4C 00 D0 05 A0 56 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00";	   
      document.getElementById("taProgramInput").value = code;
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      _KernelInputQueue.enqueue('r');
      _KernelInputQueue.enqueue('u');
      _KernelInputQueue.enqueue('n');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('0');      
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);      


      // Load another valid user program.
      var code = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
      document.getElementById("taProgramInput").value = code;
   };
}
