/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d", { willReadFrequently: true });

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement>document.getElementById("taHostLog")).value = "";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement>document.getElementById("btnStartOS")).focus();

            _CPU = new CPU();
            _CPU.init();
            _Memory = new Memory();
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();

            this.updateCPU()

            // --------------------- MEMORY UI -------------------------
            const memoryTable = document.getElementById('memoryDisplay')!

            for (let i = 0x000; i <= 0x2F8; i += 8) {
                const row = document.createElement('tr')
                const address = document.createElement('th')
                address.innerText = "0x" + Utils.toHexString(i, 3)
                row.appendChild(address)

                for (let j = 0; j < 8; j++) {
                    const cell = document.createElement('td')
                    cell.innerText = "00"
                    row.appendChild(cell)
                }

                memoryTable.appendChild(row)
            }
            // --------------------- MEMORY UI -------------------------

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }

            // set up a mouse listener for the tooltip functionality in the disk
            document.addEventListener('mousemove', (e) => {
                const tooltips = <HTMLDivElement[]>Array.from(document.querySelectorAll('.data-card'))
                for(let tooltip of tooltips) {
                    tooltip.style.left = e.pageX + 10 + 'px'
                    tooltip.style.top = e.pageY + 10 + 'px'
                }
            })

        }

        public static updateMemory(address: number, value: number) {
            const col = address % 8 + 2;
            const row = Math.floor(address / 8) + 1;
            (<HTMLDataElement>document.querySelector(`#memoryDisplay > tr:nth-child(${row}) > td:nth-child(${col})`)).innerText = Utils.toHexString(value, 2);
        }

        public static updatePCBs() {
            const pcbTableBody = (<HTMLTableSectionElement>document.querySelector("#taskManager > tbody"))
            const removeTerminated = (<HTMLInputElement>document.querySelector("#terminatedToggle > input"))!.checked

            const colors: { [key in TSOS.PCBState]: { fg: string, bg: string } } = {
                "Resident": { fg: "black", bg: "#689ded" },
                "Ready": { fg: "white", bg: "#0d5419" },
                "Running": { fg: "black", bg: "#f07d30" },
                "Terminated": { fg: "black", bg: "#b6c0cf" }
            }

            let pcbRows: HTMLTableRowElement[] = []
            for (let pcb of _Scheduler.residentList.values()) {

                // dont show the terminated processes if the toggle is off
                if (removeTerminated && pcb.state === "Terminated") continue

                const row = document.createElement('tr')
                row.innerHTML = `
                    <td>${pcb.PID}</td>
                    <td>${pcb.state}</td>
                    <td>${pcb.segment}</td>
                    <td>${pcb.quantumRemaining}</td>
                    <td>${pcb.bounds[0]}</td>
                    <td>${pcb.bounds[1]}</td>
                    <td>${Utils.toHexString(pcb.PC, 2)}</td>
                    <td>${Utils.toHexString(pcb.IR, 2)}</td>
                    <td>${Utils.toHexString(pcb.Acc, 2)}</td>
                    <td>${Utils.toHexString(pcb.Xreg, 2)}</td>
                    <td>${Utils.toHexString(pcb.Yreg, 2)}</td>
                    <td>${pcb.Zflag ? "1" : "0"}</td>
                `

                row.style.color = colors[pcb.state].fg
                row.style.backgroundColor = colors[pcb.state].bg

                pcbRows.push(row)
            }
            pcbTableBody.replaceChildren(...pcbRows)
        }

        public static updateCPU() {
            const cpuTableBody = (<HTMLTableSectionElement>document.querySelector("#cpuDisplay > tbody"))
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${Utils.toHexString(_CPU.PC, 2)}</td>
                <td>${Utils.toHexString(_CPU.IR, 2)}</td>
                <td>${Utils.toHexString(_CPU.Acc, 2)}</td>
                <td>${Utils.toHexString(_CPU.Xreg, 2)}</td>
                <td>${Utils.toHexString(_CPU.Yreg, 2)}</td>
                <td>${_CPU.Zflag ? "1" : "0"}</td>
            `

            cpuTableBody.replaceChildren(row)
        }

        public static updateDisk() {

            if(!_krnDiskDriver.isFormatted) return

            const diskTableBody = (<HTMLDivElement>document.querySelector("#diskDisplay"))

            let diskRows: HTMLDivElement[] = []
            for (let j = 0; j < _krnDiskDriver.sectors; j++) {
                for (let k = 0; k < _krnDiskDriver.blocks; k++) {
                    const row = document.createElement('div')

                    for(let i = 0; i < _krnDiskDriver.tracks; i++) {
                        const loc = _krnDiskDriver.tsb(i, j, k)
                        
                        const data = sessionStorage.getItem(loc).split(" ")

                        const cell = document.createElement('span')
                        cell.innerText = loc
                        
                        // apply a class if the cell is in use
                        if(data[0] === "1") {
                            cell.classList.add("allocated")
                        }

                        const dataCard = document.createElement('div')
                        dataCard.className = "data-card"

                        dataCard.innerHTML = `
                            <div class="data-card-header">
                                <span class="data-card-title">${loc}</span>
                            </div>
                            <div class="data-card-body">
                                <div class="data-card-row">
                                    <span class="data-card-label">Next:</span>
                                    <span class="data-card-value">${data[1]}:${data[2]}:${data[3]}</span>
                                </div>
                                <div class="data-card-row">
                                    <span class="data-card-label">Data:</span>
                                    <span class="data-card-value">${data.slice(4).join(" ")}</span>
                                </div>
                            </div>
                        `

                        cell.appendChild(dataCard)

                        row.appendChild(cell)
                    }
                    diskRows.push(row)
                }
            }
            
            diskTableBody.replaceChildren(...diskRows)
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement>document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        public static async loadingAnimation(millis: number): Promise<void> {
            const loading = <HTMLDivElement>document.getElementById("loading");
            const frog = <HTMLImageElement>document.getElementById("loading_frog");
            const progressBar = <HTMLProgressElement>document.getElementById("loading_bar");
            const text = <HTMLParagraphElement>document.getElementById("loading_text");

            loading.style.display = "block";

            const timePerFrame = millis / 100;

            const frames = [];

            for (let i = 0; i < 100; i++) {
                frames.push(new Promise<void>(resolve => {
                    setTimeout(() => {
                        progressBar.value = i;

                        // change the amount of dots after loading
                        switch (Math.floor(i / 20) % 3) {
                            case 0:
                                text.innerText = "Loading.";
                                break;
                            case 1:
                                text.innerText = "Loading..";
                                break;
                            case 2:
                                text.innerText = "Loading...";
                                break;
                        }

                        frog.style.paddingTop = `${3 * (100 - i) - 18}px`;
                        frog.style.height = `${3 * i + 6}px`;

                        text.innerText = `Loading ${i}%`;

                        resolve();
                    }, timePerFrame * i);
                }));
            }

            return Promise.all(frames).then(() => {
                loading.style.display = "none";
            });
        }


        //
        // Host Events
        //
        public static async hostBtnStartOS_click(btn: HTMLButtonElement): Promise<void> {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt, Reset, and SingleStep buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStepToggle")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display")!.focus();

            // Display the loading screen
            await this.loadingAnimation(3000);

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new CPU();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);

            // Add a automatically updating time
            _taskbarTimeID = setInterval(() => {
                const now = new Date()
                document.getElementById('time')!.innerText = `Time: ${now.toLocaleTimeString()}`
            }, 1000)

            document.getElementById('date')!.innerText = "Date: " + new Date().toLocaleDateString()

            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn: HTMLButtonElement): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
            clearInterval(_taskbarTimeID)
        }

        public static hostBtnReset_click(btn: HTMLButtonElement): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSingleStepEnable_click(btn: HTMLButtonElement): void {
            const singleStepOnceBtn = <HTMLButtonElement>document.getElementById('btnSingleStepOnce')

            _singleStepEnabled = !_singleStepEnabled;
            if (_singleStepEnabled) {
                btn.className = "normal_button on"
                singleStepOnceBtn.disabled = false;
            } else {
                btn.className = "normal_button off"
                singleStepOnceBtn.disabled = true;
            }
        }

        public static hostBtnSingleStepOnce_click(btn: HTMLButtonElement): void {
            _shouldStep = true;
        }

        public static hostBtnToggleDisk_click(btn: HTMLButtonElement): void {
            const diskContainer = <HTMLDivElement>document.getElementById("diskContainer");
            diskContainer.classList.toggle("open")
        }
    }
}
