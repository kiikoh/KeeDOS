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
            const validChars = "0123456789ABCDEF";
            // begin validation pipeline
            return input
                .toUpperCase() // make all upper
                .trim() // remove trailing whitespace
                .split(/\s+/) //all remaing whitespace denotes a split
                .every(hexPair => {
                return hexPair.length === 2 && // the pair contains two characters
                    validChars.includes(hexPair[0]) && //the first character is valid
                    validChars.includes(hexPair[1]); // the second character is valid
            });
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
    }
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map