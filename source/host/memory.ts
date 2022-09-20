module TSOS {
    export class Memory extends Array<number>{

        constructor() {
            super(768)
        }

        public init() {
            this.fill(0)
        }

    }
}
    