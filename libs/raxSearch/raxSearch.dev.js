(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["raxSearch"] = factory();
	else
		root["raxSearch"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var fuzzyMatcher = __webpack_require__(/*! ./src/fuzzyMatch/fuzzyMatcher */ "./src/fuzzyMatch/fuzzyMatcher.ts");
var exactMatcher = __webpack_require__(/*! ./src/exactMatch/patternFinder */ "./src/exactMatch/patternFinder.ts");
// import * as minHashLsh from './src/shingMinLos/minHashLsh'; // dont expose min hash lsh currently
// console.log(fuzzyMatcher);
// console.log(exactMatcher);
// // console.log(minHashLsh);
module.exports = {
    fuzzyMatcher: fuzzyMatcher,
    exactMatcher: exactMatcher
};


/***/ }),

/***/ "./src/common/common.ts":
/*!******************************!*\
  !*** ./src/common/common.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVectorLength = exports.getDotProduct = exports.randomPermutationGenerator = exports.normalizeToVectors = exports.getShinglesDisregardRepeated = exports.getShinglesPreserveRepeated = void 0;
/**
 * Shingling the string (preserve repeated)
 * for example : str "abcbc" is shingled to [ab, bc, cb, bc] if the shingle size is 2
 * @param {String} string
 * @param {Number} shingleSize
 * @return {Array}
 */
function getShinglesPreserveRepeated(string, shingleSize) {
    if (shingleSize >= string.length)
        return [string];
    var arr = [];
    var noSpacesString = "";
    for (var i = 0; i < string.length; i++) {
        if (string.charAt(i) !== " ") {
            noSpacesString += string.charAt(i);
        }
    }
    for (var i = 0; i + shingleSize - 1 < noSpacesString.length; i++) {
        arr.push(noSpacesString.substring(i, i + shingleSize));
    }
    return arr;
}
exports.getShinglesPreserveRepeated = getShinglesPreserveRepeated;
/**
 * Shingling the string (disregard repeated)
 * for example : str "abcbc" is shingled to [ab, bc, cb] if the shingle size is 2
 * @param {String} string
 * @param {Number} shingleSize
 * @return {Array}
 */
function getShinglesDisregardRepeated(string, shingleSize) {
    if (shingleSize >= string.length)
        return [string];
    var arr = [];
    var lookupTable = {};
    var noSpacesString = "";
    for (var i = 0; i < string.length; i++) {
        if (string.charAt(i) !== " ") {
            noSpacesString += string.charAt(i);
        }
    }
    for (var i = 0; i + shingleSize - 1 < noSpacesString.length; i++) {
        var subString = noSpacesString.substring(i, i + shingleSize);
        if (!lookupTable[subString]) {
            arr.push(subString);
            lookupTable[subString] = 1; //mark as existed
        }
    }
    return arr;
}
exports.getShinglesDisregardRepeated = getShinglesDisregardRepeated;
/**
 *
 * @param {Array<Array<string>>}
 * @return {Array<Array<number>>} number : 0 | 1;
 * Normalize the tokens/shingles to binary vectors that are 0s or 1s.
 */
function normalizeToVectors(matrix) {
    var result = [];
    var union = {};
    var lineLookUp = []; //strings in each line will be a lookUp table
    var matrixLength = matrix.length;
    // 1 get union
    for (var i = 0; i < matrixLength; i++) {
        lineLookUp[i] = {};
        for (var j = 0; j < matrix[i].length; j++) {
            var key = matrix[i][j];
            // save to union if key does not exist
            if (!union[key]) {
                union[key] = 1;
            }
            // save this key to line look up table itself.
            lineLookUp[i][key] = 1;
        }
    }
    // 2 normalize strings to vectors
    var unionKeys = Object.keys(union);
    for (var i = 0; i < matrixLength; i++) {
        var row = new Array(unionKeys.length); // this will be the normalized vector from the original shingles/strings
        for (var j = 0; j < unionKeys.length; j++) {
            var key = unionKeys[j];
            if (lineLookUp[i][key]) {
                row[j] = 1;
            }
            else {
                row[j] = 0;
            }
        }
        result.push(row);
    }
    return result;
}
exports.normalizeToVectors = normalizeToVectors;
/**
 *
 * @param arrayLength : number
 * @returns : Array<number>
 *
 * Function works similar to permutating an array
 */
function randomPermutationGenerator(size /** the size of the permutation you want to create */, isBinary) {
    // 1 Initialization
    var baseArray = new Array(size);
    if (!isBinary) {
        for (var i = 0; i < size; i++) {
            baseArray[i] = i;
        }
    }
    else {
        var numOfOnes = Math.floor(Math.random() * size + 1);
        for (var i = 0; i < size; i++) {
            if (numOfOnes > 0) {
                baseArray[i] = 1;
                numOfOnes--;
            }
            else {
                baseArray[i] = 0;
            }
        }
    }
    return {
        /**
         *
         * @returns the original array when it is initialized
         */
        shuffle: function () {
            for (var i = 0; i < size - 1; i++) {
                var swapIndex = Math.floor(Math.random() * (size - i));
                //swap
                var temp = baseArray[i];
                baseArray[i] = baseArray[swapIndex + i];
                baseArray[swapIndex + i] = temp;
            }
            return baseArray;
        },
        /**
         *
         * @returns a new array which used extra memory
         */
        shuffleNew: function () {
            var copiedArray = __spreadArray([], __read(baseArray));
            for (var i = 0; i < size - 1; i++) {
                var swapIndex = Math.floor(Math.random() * (size - i));
                //swap
                var temp = copiedArray[i];
                copiedArray[i] = copiedArray[swapIndex + i];
                copiedArray[swapIndex + i] = temp;
            }
            return copiedArray;
        }
    };
}
exports.randomPermutationGenerator = randomPermutationGenerator;
function getDotProduct(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new TypeError("Two vectors' length are not equal");
    }
    var res = 0;
    for (var i = 0; i < vector1.length; i++) {
        res += vector1[i] * vector2[i];
    }
    return res;
}
exports.getDotProduct = getDotProduct;
function getVectorLength(vector) {
    var res = 0;
    for (var i = 0; i < vector.length; i++) {
        res += vector[i] * vector[i];
    }
    return Math.sqrt(res);
}
exports.getVectorLength = getVectorLength;


/***/ }),

/***/ "./src/common/distanceCalculator.ts":
/*!******************************************!*\
  !*** ./src/common/distanceCalculator.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJaccardSim = exports.getCosDistance = exports.getLvstnDistance = void 0;
var common_1 = __webpack_require__(/*! ./common */ "./src/common/common.ts");
function getLvstnDistance(string1, string2) {
    //dp init
    var dp = new Array(string1.length + 1);
    for (var i = 0; i < dp.length; i++) {
        dp[i] = new Array(string2.length + 1);
    }
    //assign values
    dp[0][0] = 0;
    for (var i = 1; i < dp.length; i++) {
        dp[i][0] = i;
    }
    for (var i = 1; i < dp[0].length; i++) {
        dp[0][i] = i;
    }
    for (var i = 1; i < dp.length; i++) {
        for (var j = 1; j < dp[i].length; j++) {
            if (string1.charAt(i - 1) === string2.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1];
            else
                dp[i][j] = Math.min(dp[i - 1][j], dp[i - 1][j - 1], dp[i][j - 1]) + 1;
        }
    }
    return dp[string1.length][string2.length];
}
exports.getLvstnDistance = getLvstnDistance;
function getCosDistance(shingles1, shingles2) {
    var _a = __read(common_1.normalizeToVectors([shingles1, shingles2]), 2), vec1 = _a[0], vec2 = _a[1];
    var dotProduct = common_1.getDotProduct(vec1, vec2);
    var vecLen1 = 0;
    var vecLen2 = 0;
    for (var i = 0; i < vec1.length; i++) {
        vecLen1 += Math.pow(vec1[i], 2);
        vecLen2 += Math.pow(vec2[i], 2);
    }
    return vecLen1 === vecLen2 ? dotProduct / vecLen1 : dotProduct / (Math.sqrt(vecLen1) * Math.sqrt(vecLen2));
}
exports.getCosDistance = getCosDistance;
function getJaccardSim(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error("Unmatched vector length");
    }
    var intersections = 0;
    var unions = 0;
    for (var i = 0; i < vector1.length; i++) {
        if (vector1[i] !== vector2[i]) {
            unions++;
        }
        else if (vector1[i] !== 0) {
            unions++;
            intersections++;
        }
    }
    return intersections / unions;
}
exports.getJaccardSim = getJaccardSim;
// export function getJaccardDis(params:type) {
// }


/***/ }),

/***/ "./src/exactMatch/patternFinder.ts":
/*!*****************************************!*\
  !*** ./src/exactMatch/patternFinder.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findExactItems = void 0;
function computeNext(pattern) {
    if (pattern.length <= 0)
        return [];
    var next = new Array(pattern.length);
    var prefix = 0;
    next[0] = 0;
    for (var suffix = 1; suffix < next.length; suffix++) {
        while (prefix > 0 && pattern.charAt(prefix) !== pattern.charAt(suffix))
            prefix = next[prefix - 1];
        if (pattern.charAt(prefix) === pattern.charAt(suffix))
            prefix++;
        next[suffix] = prefix;
    }
    return next;
}
function findExactItems(pattern) {
    //concrete "next" array for this pattern;
    var next = computeNext(pattern);
    //right move the next
    for (var i = next.length - 1; i >= 1; i--) {
        next[i] = next[i - 1];
    }
    next[0] = -1;
    return {
        findAll: function (haystack) {
            var result = [];
            var haystackPointer = 0;
            var patternPointer = 0;
            while (haystackPointer < haystack.length) {
                // no char is matched, it will next index to be matching according to "next" array
                if (haystack.charAt(haystackPointer) !== pattern.charAt(patternPointer)) {
                    if (next[patternPointer] === -1) { // no sub-pattern is found, needs to move the haystack pointer forward
                        haystackPointer++;
                    }
                    else {
                        patternPointer = next[patternPointer];
                    }
                }
                else {
                    // found matched char
                    haystackPointer++;
                    patternPointer++;
                    if (patternPointer >= pattern.length) {
                        result.push(haystackPointer - pattern.length);
                        haystackPointer = haystackPointer - pattern.length + 1; // only move the index, from matched string, 1 forward
                        patternPointer = 0;
                    }
                }
            }
            return result;
        },
        findFirst: function (haystack) {
            var result = -1;
            var haystackPointer = 0;
            var patternPointer = 0;
            while (haystackPointer < haystack.length) {
                // no char is matched, it will next index to be matching according to "next" array
                if (haystack.charAt(haystackPointer) !== pattern.charAt(patternPointer)) {
                    if (next[patternPointer] === -1) { // no sub-pattern is found, needs to move the haystack pointer forward
                        haystackPointer++;
                    }
                    else {
                        patternPointer = next[patternPointer];
                    }
                }
                else {
                    // found matched char
                    haystackPointer++;
                    patternPointer++;
                    if (patternPointer >= pattern.length) {
                        result = haystackPointer - pattern.length;
                        break;
                    }
                }
            }
            return result;
        }
    };
}
exports.findExactItems = findExactItems;


/***/ }),

/***/ "./src/fuzzyMatch/fuzzyMatcher.ts":
/*!****************************************!*\
  !*** ./src/fuzzyMatch/fuzzyMatcher.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSimilarity = exports.findSimilarItems = void 0;
var distanceCalculator_1 = __webpack_require__(/*! ../common/distanceCalculator */ "./src/common/distanceCalculator.ts");
var common_1 = __webpack_require__(/*! ../common/common */ "./src/common/common.ts");
var defaultSettings = {
    isCaseSensitive: true,
    lineToLeft: false,
};
function findSimilarItems(haystacks, pattern, settings) {
    //pre-configure settings 
    Object.setPrototypeOf(settings, defaultSettings);
    var isCaseSensitive = settings.isCaseSensitive, lineToLeft = settings.lineToLeft;
    var similarItems = [];
    if (!isCaseSensitive)
        pattern = pattern.toLowerCase();
    for (var i = 0; i < haystacks.length; i++) {
        var haystack = "";
        if (lineToLeft) {
            haystack = haystacks[i].substring(0, pattern.length);
        }
        else {
            haystack = haystacks[i];
        }
        if (!isCaseSensitive) {
            haystack = haystack.toLowerCase();
        }
        var sim = getSimilarity(haystack, pattern);
        similarItems.push({
            string: haystacks[i],
            similarity: sim
        });
    }
    similarItems.sort(function (obj1, obj2) { return obj2.similarity - obj1.similarity; }); // decreasing order
    return similarItems;
}
exports.findSimilarItems = findSimilarItems;
function getSimilarity(string1, string2) {
    var shingleLenth = 2;
    var cosSimWeight = 50;
    var cosSim = distanceCalculator_1.getCosDistance(common_1.getShinglesDisregardRepeated(string1, shingleLenth), common_1.getShinglesDisregardRepeated(string2, shingleLenth));
    var lvstnSim = 1 - distanceCalculator_1.getLvstnDistance(string1, string2) / (Math.max(string1.length, string2.length));
    return cosSim * cosSimWeight + lvstnSim * (100 - cosSimWeight);
}
exports.getSimilarity = getSimilarity;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=raxSearch.dev.js.map