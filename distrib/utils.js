/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    class Utils {
        static trim(str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }
        static rot13(str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        static validateHexString(input) {
            var _a;
            const validChars = "0123456789ABCDEF";
            // begin validation pipeline
            const parsed = input
                .toUpperCase() // make all upper
                .trim() // remove trailing whitespace
                .replace(/\s+/g, '') //remove all whitespace
                .split('');
            if (!parsed.every(chr => validChars.includes(chr)))
                return false;
            const pairs = [];
            for (let i = 0; i < parsed.length; i += 2) {
                pairs.push(parsed[i] + ((_a = parsed[i + 1]) !== null && _a !== void 0 ? _a : ""));
            }
            return pairs.join(" ");
        }
        static greatestCommonSubstring(strings) {
            let result = "";
            const minLengthString = strings.reduce((min, string) => Math.min(min, string.length), 1000); // get the smallest string length
            for (let i = 0; i < minLengthString; i++) {
                const ltr = strings[0][i];
                for (let j = 1; j < strings.length; j++) {
                    if (strings[j][i] !== ltr) {
                        return result;
                    }
                }
                result += ltr;
            }
            return result;
        }
        static getCompliment(num) {
            return num < 128 ? num : -(256 - num);
        }
        ;
        static compAddition(num1, num2) {
            const result = this.getCompliment(num1) + this.getCompliment(num2);
            if (result >= 256)
                throw new Error("Integer Overflow");
            if (result < 0)
                throw new Error("Integer Underflow");
            return result;
        }
        static toHexString(value, length) {
            let str = value.toString(16).toUpperCase();
            if (!length) {
                return str;
            }
            return str.padStart(length, "0");
        }
    }
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map