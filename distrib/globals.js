/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME = "KeeDOS"; // 'cause Bob and I were at a loss for a better name.
const APP_VERSION = "1.0"; // What did you expect?
const CPU_CLOCK_INTERVAL = 50; // This is in ms (milliseconds) so 1000 = 1 second.
const TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ = 1;
const CONTEXT_SWITCH_IRQ = 2;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU;
var _Memory;
var _MemoryAccessor;
//	Software	(OS)
var _MemoryManager;
var _OSclock = 0; // Page 23.
let _Scheduler;
let _Dispatcher;
// TODO: remove this after project 2
let _singleStepEnabled = false;
let _shouldStep = false;
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue;
var _KernelInputQueue;
var _KernelBuffers = null;
// Standard input and output
var _StdIn;
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver;
let _krnDiskDriver;
var _hardwareClockID;
var _taskbarTimeID;
const SLEEP_TIMEOUT = 120 * 1000; // millis to sleep after
let _sleepTimerID;
let _sleepImageCanvas;
let _sleeping = false;
let _screensaverState = { x: 30, y: 210, vx: 2, vy: 3, hue: 0 };
let _screensaverIntervalID;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
//# sourceMappingURL=globals.js.map