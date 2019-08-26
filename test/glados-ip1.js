//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
   this.version = 2112;

   this.init = function() {
      var msg = "Hello [subject name here]. Let's test project ONE.\n";
      // msg += "Before we start, however, keep in mind that although fun and learning are our primary goals, serious injuries may occur.";
      // msg += "Cake, and grief counseling, will be available at the conclusion of the test.";
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
      _KernelInputQueue.enqueue('T');
      _KernelInputQueue.enqueue('h');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('C');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('k');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('i');
      _KernelInputQueue.enqueue('s');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue(' ');
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('i');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('!');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);              

      // Try and load some invalid user program code.
      document.getElementById("taProgramInput").value = "This is NOT hex.";
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

      // Try and load NO user program code. That should still casue an error.
      document.getElementById("taProgramInput").value = "";
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
      
      // Try and load some valid user program code.
      var code = "A9 00 8D 00 00 A9 00 8D 4B 00 A9 00 8D 4B 00 A2 03 EC 4B 00 D0 07 A2 01 EC 00 00 D0 05 A2 00 EC 00 00 D0 26 A0 4C A2 02 FF AC 4B 00 A2 01 FF A9 01 6D 4B 00 8D 4B 00 A2 02 EC 4B 00 D0 05 A0 55 A2 02 FF A2 01 EC 00 00 D0 C5 00 00 63 6F 75 6E 74 69 6E 67 00 68 65 6C 6C 6F 20 77 6F 72 6C 64 00";
      document.getElementById("taProgramInput").value = code;
      _KernelInputQueue.enqueue('l');
      _KernelInputQueue.enqueue('o');
      _KernelInputQueue.enqueue('a');
      _KernelInputQueue.enqueue('d');
      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
   };
}