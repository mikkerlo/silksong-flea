/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/aes-js/index.js":
/*!**************************************!*\
  !*** ./node_modules/aes-js/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (true) {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else {}


})(this);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, "\n* {\n  box-sizing: border-box;\n}\n\na {\n  color: royalblue;\n  text-decoration-line: none;\n}\n\na:visited {\n  color: royalblue;\n}\n\nbutton {\n  font-family: inherit; \n  font-size: inherit; \n  padding: 5px 10px;\n  user-select: none;\n}\n\nbutton:focus {\n  outline: solid 1px royalblue;\n}\n\nlabel {\n  user-select: none;\n}\n\ntextarea {\n  border: 1px solid #888;\n  border-radius: 5px;\n}\n\ntextarea:focus {\n  border: 1px solid royalblue;\n  outline: none;\n}\n\nbody, html {\n  margin: 0; \n  padding: 0;\n  font-family: \"Open Sans\";\n  font-size: 16px; \n}\n\nbody {\n  display: grid; \n  justify-content: center; \n}\n\n#wrapper {\n  max-width: 700px; \n  padding: 20px;\n  margin-top: 50px;\n  display: grid; \n  justify-items: left;\n}\n\n#description {\n  margin: 0;\n}\n\n#instructions {\n  color: #444;\n  margin-top: 5px;\n  margin-bottom: 25px;\n  font-size: 0.95em;\n  list-style-type: square; \n}\n\n#source {\n  font-size: smaller;\n  color: #666;\n}\n\n#file-button {\n  margin-right: 20px;\n}\n\n#file-input {\n  opacity: 0; \n  width: 0; \n  height: 0; \n  position: fixed;\n  left: 0; \n  top: 0;\n}\n\n#editor-wrapper {\n  width: 100%; \n  margin-top: 15px;\n}\n\n#editor {\n  font-size: inherit;\n  font-family: inherit;\n  padding: 10px;\n  margin-top: 5px;\n  width: 100%; \n  height: 500px;\n}\n\n#editor-buttons {\n  margin-top: 5px;\n  display: grid; \n  justify-items: left; \n  grid-template-columns: auto 1fr auto auto;\n  grid-template-areas: \"a b c d\"; \n  grid-column-gap: 10px;\n  font-size: 0.95em;\n}\n\n#editor-buttons > button:nth-child(0n+2){\n  justify-self: right;\n  grid-area: c;\n}\n\n#editor-buttons > button:nth-child(0n+3){\n  justify-self: right;\n  grid-area: d;\n}\n\n#history {\n  margin: 50px 0;\n}\n\n#history > div:first-child {\n  font-size: 1.2em;\n}\n\n#history > div:nth-child(0n+2) {\n  font-size: 0.9em;\n  color: #777;\n}\n\n#history > ul {\n  list-style: none; \n  padding: 0;\n  margin: 0;\n  margin-top: 10px;\n  display: grid; \n}\n\n.history-name {\n  color: royalblue;\n}\n\n.history-date {\n  font-size: 0.8em;\n}\n\n.history-item {\n  background-color: white; \n  padding: 5px;\n  user-select: none;\n}\n\n.history-item:hover {\n  background-color: #eee;\n}\n\n.history-item:active {\n  background-color: #ddd;\n}\n\n#cover {\n  background-color: rgba(0, 0, 0, 0.219); \n  position: fixed;\n  left: 0; \n  top: 0;\n  width: 100vw; \n  height: 100vh;\n}", ""]);



/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-dom/cjs/react-dom.development.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-dom/cjs/react-dom.development.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function noop() {}
    function testStringCoercion(value) {
      return "" + value;
    }
    function createPortal$1(children, containerInfo, implementation) {
      var key =
        3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      try {
        testStringCoercion(key);
        var JSCompiler_inline_result = !1;
      } catch (e) {
        JSCompiler_inline_result = !0;
      }
      JSCompiler_inline_result &&
        (console.error(
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          ("function" === typeof Symbol &&
            Symbol.toStringTag &&
            key[Symbol.toStringTag]) ||
            key.constructor.name ||
            "Object"
        ),
        testStringCoercion(key));
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children: children,
        containerInfo: containerInfo,
        implementation: implementation
      };
    }
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    function getValueDescriptorExpectingObjectForWarning(thing) {
      return null === thing
        ? "`null`"
        : void 0 === thing
          ? "`undefined`"
          : "" === thing
            ? "an empty string"
            : 'something with type "' + typeof thing + '"';
    }
    function getValueDescriptorExpectingEnumForWarning(thing) {
      return null === thing
        ? "`null`"
        : void 0 === thing
          ? "`undefined`"
          : "" === thing
            ? "an empty string"
            : "string" === typeof thing
              ? JSON.stringify(thing)
              : "number" === typeof thing
                ? "`" + thing + "`"
                : 'something with type "' + typeof thing + '"';
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      null === dispatcher &&
        console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
      return dispatcher;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "./node_modules/react/index.js"),
      Internals = {
        d: {
          f: noop,
          r: function () {
            throw Error(
              "Invalid form element. requestFormReset must be passed a form that was rendered by React."
            );
          },
          D: noop,
          C: noop,
          L: noop,
          m: noop,
          X: noop,
          S: noop,
          M: noop
        },
        p: 0,
        findDOMNode: null
      },
      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
      ReactSharedInternals =
        React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    ("function" === typeof Map &&
      null != Map.prototype &&
      "function" === typeof Map.prototype.forEach &&
      "function" === typeof Set &&
      null != Set.prototype &&
      "function" === typeof Set.prototype.clear &&
      "function" === typeof Set.prototype.forEach) ||
      console.error(
        "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
      );
    exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
      Internals;
    exports.createPortal = function (children, container) {
      var key =
        2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (
        !container ||
        (1 !== container.nodeType &&
          9 !== container.nodeType &&
          11 !== container.nodeType)
      )
        throw Error("Target container is not a DOM element.");
      return createPortal$1(children, container, null, key);
    };
    exports.flushSync = function (fn) {
      var previousTransition = ReactSharedInternals.T,
        previousUpdatePriority = Internals.p;
      try {
        if (((ReactSharedInternals.T = null), (Internals.p = 2), fn))
          return fn();
      } finally {
        (ReactSharedInternals.T = previousTransition),
          (Internals.p = previousUpdatePriority),
          Internals.d.f() &&
            console.error(
              "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
            );
      }
    };
    exports.preconnect = function (href, options) {
      "string" === typeof href && href
        ? null != options && "object" !== typeof options
          ? console.error(
              "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : null != options &&
            "string" !== typeof options.crossOrigin &&
            console.error(
              "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
              getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
            )
        : console.error(
            "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
      "string" === typeof href &&
        (options
          ? ((options = options.crossOrigin),
            (options =
              "string" === typeof options
                ? "use-credentials" === options
                  ? options
                  : ""
                : void 0))
          : (options = null),
        Internals.d.C(href, options));
    };
    exports.prefetchDNS = function (href) {
      if ("string" !== typeof href || !href)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
      else if (1 < arguments.length) {
        var options = arguments[1];
        "object" === typeof options && options.hasOwnProperty("crossOrigin")
          ? console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : console.error(
              "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
              getValueDescriptorExpectingEnumForWarning(options)
            );
      }
      "string" === typeof href && Internals.d.D(href);
    };
    exports.preinit = function (href, options) {
      "string" === typeof href && href
        ? null == options || "object" !== typeof options
          ? console.error(
              "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
              getValueDescriptorExpectingEnumForWarning(options)
            )
          : "style" !== options.as &&
            "script" !== options.as &&
            console.error(
              'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
              getValueDescriptorExpectingEnumForWarning(options.as)
            )
        : console.error(
            "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
      if (
        "string" === typeof href &&
        options &&
        "string" === typeof options.as
      ) {
        var as = options.as,
          crossOrigin = getCrossOriginStringAs(as, options.crossOrigin),
          integrity =
            "string" === typeof options.integrity ? options.integrity : void 0,
          fetchPriority =
            "string" === typeof options.fetchPriority
              ? options.fetchPriority
              : void 0;
        "style" === as
          ? Internals.d.S(
              href,
              "string" === typeof options.precedence
                ? options.precedence
                : void 0,
              {
                crossOrigin: crossOrigin,
                integrity: integrity,
                fetchPriority: fetchPriority
              }
            )
          : "script" === as &&
            Internals.d.X(href, {
              crossOrigin: crossOrigin,
              integrity: integrity,
              fetchPriority: fetchPriority,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
      }
    };
    exports.preinitModule = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      void 0 !== options && "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : options &&
          "as" in options &&
          "script" !== options.as &&
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingEnumForWarning(options.as) +
            ".");
      if (encountered)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          encountered
        );
      else
        switch (
          ((encountered =
            options && "string" === typeof options.as ? options.as : "script"),
          encountered)
        ) {
          case "script":
            break;
          default:
            (encountered =
              getValueDescriptorExpectingEnumForWarning(encountered)),
              console.error(
                'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
                encountered,
                href
              );
        }
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as)
            (encountered = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            )),
              Internals.d.M(href, {
                crossOrigin: encountered,
                integrity:
                  "string" === typeof options.integrity
                    ? options.integrity
                    : void 0,
                nonce:
                  "string" === typeof options.nonce ? options.nonce : void 0
              });
        } else null == options && Internals.d.M(href);
    };
    exports.preload = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      null == options || "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : ("string" === typeof options.as && options.as) ||
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingObjectForWarning(options.as) +
            ".");
      encountered &&
        console.error(
          'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
          encountered
        );
      if (
        "string" === typeof href &&
        "object" === typeof options &&
        null !== options &&
        "string" === typeof options.as
      ) {
        encountered = options.as;
        var crossOrigin = getCrossOriginStringAs(
          encountered,
          options.crossOrigin
        );
        Internals.d.L(href, encountered, {
          crossOrigin: crossOrigin,
          integrity:
            "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority:
            "string" === typeof options.fetchPriority
              ? options.fetchPriority
              : void 0,
          referrerPolicy:
            "string" === typeof options.referrerPolicy
              ? options.referrerPolicy
              : void 0,
          imageSrcSet:
            "string" === typeof options.imageSrcSet
              ? options.imageSrcSet
              : void 0,
          imageSizes:
            "string" === typeof options.imageSizes
              ? options.imageSizes
              : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports.preloadModule = function (href, options) {
      var encountered = "";
      ("string" === typeof href && href) ||
        (encountered +=
          " The `href` argument encountered was " +
          getValueDescriptorExpectingObjectForWarning(href) +
          ".");
      void 0 !== options && "object" !== typeof options
        ? (encountered +=
            " The `options` argument encountered was " +
            getValueDescriptorExpectingObjectForWarning(options) +
            ".")
        : options &&
          "as" in options &&
          "string" !== typeof options.as &&
          (encountered +=
            " The `as` option encountered was " +
            getValueDescriptorExpectingObjectForWarning(options.as) +
            ".");
      encountered &&
        console.error(
          'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
          encountered
        );
      "string" === typeof href &&
        (options
          ? ((encountered = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            )),
            Internals.d.m(href, {
              as:
                "string" === typeof options.as && "script" !== options.as
                  ? options.as
                  : void 0,
              crossOrigin: encountered,
              integrity:
                "string" === typeof options.integrity
                  ? options.integrity
                  : void 0
            }))
          : Internals.d.m(href));
    };
    exports.requestFormReset = function (form) {
      Internals.d.r(form);
    };
    exports.unstable_batchedUpdates = function (fn, a) {
      return fn(a);
    };
    exports.useFormState = function (action, initialState, permalink) {
      return resolveDispatcher().useFormState(action, initialState, permalink);
    };
    exports.useFormStatus = function () {
      return resolveDispatcher().useHostTransitionStatus();
    };
    exports.version = "19.1.1";
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ }),

/***/ "./node_modules/react-dom/index.js":
/*!*****************************************!*\
  !*** ./node_modules/react-dom/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (true) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-dom.development.js */ "./node_modules/react-dom/cjs/react-dom.development.js");
}


/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.14.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var ReactVersion = '16.14.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  suspense: null
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
function describeComponentFrame (name, source, ownerName) {
  var sourceInfo = '';

  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');

    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);

        if (match) {
          var pathBeforeSlash = match[1];

          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }

    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }

  return '\n    in ' + (name || 'Unknown') + sourceInfo;
}

var Resolved = 1;
function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return "Profiler";

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';

      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_BLOCK_TYPE:
        return getComponentName(type.render);

      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);

          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }

          break;
        }
    }
  }

  return null;
}

var ReactDebugCurrentFrame = {};
var currentlyValidatingElement = null;
function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

/**
 * Used by act() to track whether you're inside an act() scope.
 */
var IsSomeRendererActing = {
  current: false
};

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
  IsSomeRendererActing: IsSomeRendererActing,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    printWarning('warn', format, args);
  }
}
function error(format) {
  {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    printWarning('error', format, args);
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var hasExistingStack = args.length > 0 && typeof args[args.length - 1] === 'string' && args[args.length - 1].indexOf('\n    in') === 0;

    if (!hasExistingStack) {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      }
    }

    var argsWithFormat = args.map(function (item) {
      return '' + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

_assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentName(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://fb.me/react-strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (!!(element === null || element === undefined)) {
    {
      throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
    }
  }

  var propName; // Original props are copied

  var props = _assign({}, element.props); // Reserved names are extracted


  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];

function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;

  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {

      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is deprecated and will be removed in ' + 'a future major release. Consider converting children to ' + 'an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';

      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }

      var childrenString = '' + children;

      {
        {
          throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum );
        }
      }
    }
  }

  return subtreeCount;
}
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;
  func.call(context, child, bookKeeping.count++);
}
/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */


function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;
  var mappedChild = func.call(context, child, bookKeeping.count++);

  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }

    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';

  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }

  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */


function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    {
      throw Error( "React.Children.only expected to receive a single React element child." );
    }
  }

  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
        error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
      }
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  if (!(dispatcher !== null)) {
    {
      throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem." );
    }
  }

  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();

  {
    if (unstable_observedBits !== undefined) {
      error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '');
    } // TODO: add a more generic warning for invalid values.


    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context, unstable_observedBits);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
  }

  setCurrentlyValidatingElement(element);

  {
    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }

  setCurrentlyValidatingElement(null);
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var name = getComponentName(type);
    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        break;
      }
    }

    if (fragment.ref !== null) {
      error('Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

{

  try {
    var frozenObject = Object.freeze({});
    var testMap = new Map([[frozenObject, null]]);
    var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
    // https://github.com/rollup/rollup/issues/1771
    // TODO: we can remove these if Rollup fixes the bug.

    testMap.set(0, 0);
    testSet.add(0);
  } catch (e) {
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useImperativeHandle = useImperativeHandle;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.version = ReactVersion;
  })();
}


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/base64.js":
/*!***********************!*\
  !*** ./src/base64.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encode = encode;
exports.decode = decode;
var BASE64_ARRAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").map(function (c) {
    return c.charCodeAt(0);
});
var BASE64_ENCODE_TABLE = new Map(BASE64_ARRAY.map(function (ord, i) {
    return [i, ord];
}));
var BASE64_DECODE_TABLE = new Map(BASE64_ARRAY.map(function (ord, i) {
    return [ord, i];
}));

function encode(buffer) {
    buffer = new Uint8Array(buffer).slice();
    var output = new Uint8Array(Math.ceil(Math.ceil(buffer.length * 4 / 3) / 4) * 4);
    var continuous = Math.floor(buffer.length / 3) * 3;

    for (var i = 0; i < continuous; i += 3) {
        var k = 4 * i / 3;
        output[k] = BASE64_ENCODE_TABLE.get(buffer[i] >> 2);
        output[k + 1] = BASE64_ENCODE_TABLE.get((buffer[i] & 0x03) << 4 | buffer[i + 1] >> 4);
        output[k + 2] = BASE64_ENCODE_TABLE.get((buffer[i + 1] & 0x0F) << 2 | buffer[i + 2] >> 6);
        output[k + 3] = BASE64_ENCODE_TABLE.get(buffer[i + 2] & 0x3F);
    }

    if (buffer[continuous] != undefined) {
        var _k = 4 * continuous / 3;
        output[_k] = BASE64_ENCODE_TABLE.get(buffer[continuous] >> 2);
        if (buffer[continuous + 1] == undefined) {
            output[_k + 1] = BASE64_ENCODE_TABLE.get((buffer[continuous] & 0x03) << 4);
            output[_k + 2] = BASE64_ENCODE_TABLE.get(64);
        } else {
            output[_k + 1] = BASE64_ENCODE_TABLE.get((buffer[continuous] & 0x03) << 4 | buffer[continuous + 1] >> 4);
            output[_k + 2] = BASE64_ENCODE_TABLE.get((buffer[continuous + 1] & 0x0F) << 2);
        }
        output[_k + 3] = BASE64_ENCODE_TABLE.get(64);
    }

    return output;
}

function decode(buffer) {
    buffer = new Uint8Array(buffer).slice();
    buffer = buffer.map(function (v) {
        return BASE64_DECODE_TABLE.get(v);
    });
    {
        var p = buffer.indexOf(64);buffer = buffer.subarray(0, p != -1 ? p : buffer.length);
    }
    var output = new Uint8Array(3 * buffer.length / 4);
    var continuous = Math.floor(buffer.length / 4) * 4;
    for (var i = 0; i < continuous; i += 4) {
        var k = 3 * i / 4;
        output[k] = buffer[i] << 2 | buffer[i + 1] >> 4;
        output[k + 1] = (buffer[i + 1] & 0x0F) << 4 | buffer[i + 2] >> 2;
        output[k + 2] = (buffer[i + 2] & 0x03) << 6 | buffer[i + 3];
    }
    if (buffer[continuous] != undefined) {
        var _k2 = 3 * continuous / 4;
        output[_k2] = buffer[continuous] << 2 | buffer[continuous + 1] >> 4;
        if (buffer[continuous + 2] != undefined) {
            output[_k2 + 1] = (buffer[continuous + 1] & 0x0F) << 4 | buffer[continuous + 2] >> 2;
        }
    }
    return output;
}

/***/ }),

/***/ "./src/functions.js":
/*!**************************!*\
  !*** ./src/functions.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringToBytes = StringToBytes;
exports.BytesToString = BytesToString;
exports.AESDecrypt = AESDecrypt;
exports.AESEncrypt = AESEncrypt;
exports.GenerateLengthPrefixedString = GenerateLengthPrefixedString;
exports.AddHeader = AddHeader;
exports.RemoveHeader = RemoveHeader;
exports.Decode = Decode;
exports.Encode = Encode;
exports.Hash = Hash;
exports.HumanTime = HumanTime;
exports.DownloadData = DownloadData;

var _aesJs = __webpack_require__(/*! aes-js */ "./node_modules/aes-js/index.js");

var _base = __webpack_require__(/*! ./base64.js */ "./src/base64.js");

var base64 = _interopRequireWildcard(_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var cSharpHeader = [0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0];
var aesKey = StringToBytes('UKu52ePUBwetZ9wNX88o54dnfKRu0T1l');
var ecb = new _aesJs.ModeOfOperation.ecb(aesKey);

String.prototype.reverse = function () {
    return this.split("").reverse().join("");
};

function StringToBytes(string) {
    return new TextEncoder().encode(string);
}

function BytesToString(bytes) {
    return new TextDecoder().decode(bytes);
}

// aes decrypts and removes pkcs7 padding 
function AESDecrypt(bytes) {
    var data = ecb.decrypt(bytes);
    data = data.subarray(0, -data[data.length - 1]);
    return data;
}

// pkcs7 pads and encrypts 
function AESEncrypt(bytes) {
    var padValue = 16 - bytes.length % 16;
    var padded = new Uint8Array(bytes.length + padValue);
    padded.fill(padValue);
    padded.set(bytes);
    return ecb.encrypt(padded);
}

// LengthPrefixedString https://msdn.microsoft.com/en-us/library/cc236844.aspx
function GenerateLengthPrefixedString(length) {
    var length = Math.min(0x7FFFFFFF, length); // maximum value
    var bytes = [];
    for (var i = 0; i < 4; i++) {
        if (length >> 7 != 0) {
            bytes.push(length & 0x7F | 0x80);
            length >>= 7;
        } else {
            bytes.push(length & 0x7F);
            length >>= 7;
            break;
        }
    }
    if (length != 0) {
        bytes.push(length);
    }

    return bytes;
}

function AddHeader(bytes) {
    var lengthData = GenerateLengthPrefixedString(bytes.length);
    var newBytes = new Uint8Array(bytes.length + cSharpHeader.length + lengthData.length + 1);
    newBytes.set(cSharpHeader); // fixed header 
    newBytes.subarray(cSharpHeader.length).set(lengthData); // variable LengthPrefixedString header 
    newBytes.subarray(cSharpHeader.length + lengthData.length).set(bytes); // our data 
    newBytes.subarray(cSharpHeader.length + lengthData.length + bytes.length).set([11]); // fixed header (11) 
    return newBytes;
}

function RemoveHeader(bytes) {
    // remove fixed csharp header, plus the ending byte 11. 
    bytes = bytes.subarray(cSharpHeader.length, bytes.length - 1);

    // remove LengthPrefixedString header 
    var lengthCount = 0;
    for (var i = 0; i < 5; i++) {
        lengthCount++;
        if ((bytes[i] & 0x80) == 0) {
            break;
        }
    }
    bytes = bytes.subarray(lengthCount);

    return bytes;
}

function Decode(bytes) {
    bytes = bytes.slice();
    bytes = RemoveHeader(bytes);
    bytes = base64.decode(bytes);
    bytes = AESDecrypt(bytes);
    return BytesToString(bytes);
}

function Encode(jsonString) {
    var bytes = StringToBytes(jsonString);
    bytes = AESEncrypt(bytes);
    bytes = base64.encode(bytes);
    // bytes = bytes.filter(v => v != 10 && v != 13)
    return AddHeader(bytes);
}

function Hash(string) {
    return string.split("").reduce(function (a, b) {
        return (a << 5) - a + b.charCodeAt(0);
    }, 0);
}

function round(value, precision) {
    var multi = Math.pow(10, precision);
    return Math.round(value * multi) / multi;
}

function HumanTime(date) {
    var minutes = (new Date() - date) / 1000 / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var months = weeks / 4;
    var years = months / 12;

    if (minutes < 1) {
        return "now";
    } else if (minutes < 120) {
        return 'about ' + round(minutes, 0) + ' minutes ago';
    } else if (hours < 48) {
        return 'about ' + round(hours, 0) + ' hours ago';
    } else if (days < 14) {
        return 'about ' + round(days, 0) + ' days ago';
    } else if (weeks < 8) {
        return 'about ' + round(weeks, 0) + ' weeks ago';
    } else if (months < 24) {
        return 'about ' + round(months, 1) + ' months ago';
    }

    return 'about ' + round(years, 1) + ' years ago';
}

function DownloadData(data, fileName) {
    var a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(new Blob([data], { type: "octet/stream" })));
    a.setAttribute('download', fileName);
    a.setAttribute('style', 'position: fixed; opacity: 0; left: 0; top: 0;');
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
}

/***/ }),

/***/ "./src/history.js":
/*!************************!*\
  !*** ./src/history.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOCAL_STORAGE_NAME = "bloodorca@hollow";

var History = function () {
  function History() {
    _classCallCheck(this, History);

    this.syncFromLocalStorage();
  }

  _createClass(History, [{
    key: "count",
    value: function count() {
      return this.history.length;
    }
  }, {
    key: "syncFromLocalStorage",
    value: function syncFromLocalStorage() {
      var res = localStorage.getItem(LOCAL_STORAGE_NAME);
      this.history = res ? JSON.parse(res).history : [];
      this.history.forEach(function (item) {
        item.date = new Date(item.date);
      });
      if (this.onChange) this.onChange();
    }
  }, {
    key: "syncToLocalStorage",
    value: function syncToLocalStorage() {
      try {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify({ history: this.history }));
      } catch (err) {
        var departed = this.history[this.history.length - 1];
        console.error("localStorage quota reached! Removing \"" + departed.hash + "\", the least recent file.");
        this.removeLeastRecent();
        this.syncToLocalStorage();
      }
    }
  }, {
    key: "addToHistory",
    value: function addToHistory(jsonString, fileName, hash) {
      this.history.unshift({
        date: new Date(),
        fileName: fileName,
        jsonString: jsonString,
        hash: hash
      });
      if (this.onChange) this.onChange();
    }
  }, {
    key: "removeFromHistory",
    value: function removeFromHistory(hash) {
      this.history = this.history.filter(function (item) {
        return item.hash != hash;
      });
      if (this.onChange) this.onChange();
    }
  }, {
    key: "removeLeastRecent",
    value: function removeLeastRecent() {
      if (this.history.length != 0) {
        this.history.pop();
      }
      if (this.onChange) this.onChange();
    }
  }]);

  return History;
}();

exports.default = History;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _functions = __webpack_require__(/*! ./functions.js */ "./src/functions.js");

var _history = __webpack_require__(/*! ./history.js */ "./src/history.js");

var _history2 = _interopRequireDefault(_history);

var _windowDrag = __webpack_require__(/*! ./windowDrag.js */ "./src/windowDrag.js");

var _windowDrag2 = _interopRequireDefault(_windowDrag);

__webpack_require__(/*! ./style.css */ "./src/style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var history = new _history2.default();
var windowDrag = new _windowDrag2.default();

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.state = {
            gameFile: "",
            gameFileOriginal: "",
            editing: false,
            dragging: false,
            switchMode: false
        };

        _this.handleFileClick = function () {
            _this.fileInputRef.current.click();
        };

        _this.handleFileChange = function (files) {
            if (files.length == 0) {
                return;
            }

            var file = files[0];
            var reader = new FileReader();

            if (_this.state.switchMode) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }

            reader.addEventListener("load", function () {
                var result = reader.result;
                try {
                    var decrypted = "";
                    if (_this.state.switchMode) {
                        decrypted = result;
                    } else {
                        decrypted = (0, _functions.Decode)(new Uint8Array(result));
                    }
                    var jsonString = JSON.stringify(JSON.parse(decrypted), undefined, 2);
                    var hash = (0, _functions.Hash)(jsonString);
                    history.removeFromHistory(hash);
                    history.addToHistory(jsonString, file.name, hash);
                    history.syncToLocalStorage();
                    _this.setGameFile(jsonString, file.name);
                } catch (err) {
                    window.alert("The file could not decrypted.");
                    console.warn(err);
                }
                _this.fileInputRef.current.value = null;
            });
        };

        _this.handleEditorChange = function (e) {
            _this.setState({ gameFile: e.target.value });
        };

        _this.handleReset = function (e) {
            _this.setState({
                gameFile: _this.state.gameFileOriginal
            });
        };

        _this.handleDownloadAsSwitchSave = function (e) {
            try {
                var data = JSON.stringify(JSON.parse(_this.state.gameFile));
                (0, _functions.DownloadData)(data, "plain.dat");
            } catch (err) {
                window.alert("Could not parse valid JSON. Reset or fix.");
            }
        };

        _this.handleDownload = function (e) {
            try {
                var data = JSON.stringify(JSON.parse(_this.state.gameFile));
                var encrypted = (0, _functions.Encode)(data);
                (0, _functions.DownloadData)(encrypted, "user1.dat");
            } catch (err) {
                window.alert("Could not parse valid JSON. Reset or fix.");
            }
        };

        _this.setGameFile = function (jsonString, name) {
            jsonString = JSON.stringify(JSON.parse(jsonString), undefined, 2);
            _this.setState({
                gameFile: jsonString,
                gameFileOriginal: jsonString,
                gameFileName: name,
                editing: true
            });
        };

        _this.fileInputRef = _react2.default.createRef();
        windowDrag.onDrop = function (e) {
            return _this.handleFileChange(e.dataTransfer.files);
        };
        windowDrag.onDragEnter = function () {
            return _this.setState({ dragging: true });
        };
        windowDrag.onDragLeave = function () {
            return _this.setState({ dragging: false });
        };
        return _this;
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                { id: "wrapper" },
                this.state.dragging && _react2.default.createElement("div", { id: "cover" }),
                _react2.default.createElement(
                    "p",
                    { id: "description" },
                    "This online tool allows you to modify a Hollow Knight save file. You can also use this to convert your PC save to and from a Switch save."
                ),
                _react2.default.createElement(
                    "p",
                    { id: "source" },
                    "You can view the source code in the ",
                    _react2.default.createElement(
                        "a",
                        { href: "https://github.com/bloodorca/hollow" },
                        "github repo"
                    ),
                    "."
                ),
                _react2.default.createElement(
                    "ul",
                    { id: "instructions" },
                    _react2.default.createElement(
                        "li",
                        null,
                        "Make a backup of your original file."
                    ),
                    _react2.default.createElement(
                        "li",
                        null,
                        "Select or drag in the source save file you want to modify."
                    ),
                    _react2.default.createElement(
                        "li",
                        null,
                        "Modify your save file. Ctrl-F / Cmd-F is your best friend."
                    ),
                    _react2.default.createElement(
                        "li",
                        null,
                        "Download your new modifed save file."
                    )
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(
                        "button",
                        { id: "file-button", onClick: this.handleFileClick },
                        "Select File"
                    ),
                    _react2.default.createElement(
                        "span",
                        null,
                        _react2.default.createElement("input", { checked: this.state.switchMode, onClick: function onClick(e) {
                                return _this2.setState({ switchMode: !_this2.state.switchMode });
                            }, type: "checkbox", id: "switch-save" }),
                        _react2.default.createElement(
                            "label",
                            { style: { color: this.state.switchMode ? "inherit" : "#777" }, htmlFor: "switch-save" },
                            "Nintendo Switch Mode"
                        )
                    )
                ),
                _react2.default.createElement("input", { onChange: function onChange(e) {
                        _this2.handleFileChange(_this2.fileInputRef.current.files);
                    }, id: "file-input", ref: this.fileInputRef, type: "file" }),
                this.state.editing && _react2.default.createElement(
                    "div",
                    { id: "editor-wrapper" },
                    _react2.default.createElement(
                        "span",
                        { id: "editor-name" },
                        this.state.gameFileName
                    ),
                    _react2.default.createElement("textarea", { id: "editor", onChange: this.handleEditorChange, value: this.state.gameFile, spellCheck: false }),
                    _react2.default.createElement(
                        "div",
                        { id: "editor-buttons" },
                        _react2.default.createElement(
                            "button",
                            { onClick: this.handleReset },
                            "reset"
                        ),
                        _react2.default.createElement(
                            "button",
                            { onClick: this.handleDownloadAsSwitchSave },
                            "download plain text (Switch)"
                        ),
                        _react2.default.createElement(
                            "button",
                            { onClick: this.handleDownload },
                            "download encrypted (PC)"
                        )
                    )
                ),
                _react2.default.createElement(HistoryComponent, {
                    handleClick: function handleClick(jsonString, fileName) {
                        return _this2.setGameFile(jsonString, fileName);
                    }
                })
            );
        }
    }]);

    return App;
}(_react2.default.Component);

var HistoryComponent = function (_React$Component2) {
    _inherits(HistoryComponent, _React$Component2);

    function HistoryComponent() {
        _classCallCheck(this, HistoryComponent);

        var _this3 = _possibleConstructorReturn(this, (HistoryComponent.__proto__ || Object.getPrototypeOf(HistoryComponent)).call(this));

        history.onChange = function () {
            _this3.forceUpdate();
        };
        return _this3;
    }

    _createClass(HistoryComponent, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            if (history.count() == 0) return null;
            return _react2.default.createElement(
                "div",
                { id: "history" },
                _react2.default.createElement(
                    "div",
                    null,
                    "History"
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    "Stores a limited amount of recent files. Do not use this as an alternative to making backups."
                ),
                _react2.default.createElement(
                    "ul",
                    null,
                    history.history.map(function (item) {
                        return _react2.default.createElement(
                            "li",
                            {
                                key: item.hash,
                                onClick: function onClick() {
                                    _this4.props.handleClick(item.jsonString, item.fileName);
                                    window.scrollTo(0, 0);
                                },
                                onContextMenu: function onContextMenu(e) {
                                    history.removeFromHistory(item.hash);
                                    e.preventDefault();
                                    history.syncToLocalStorage();
                                },
                                className: "history-item"
                            },
                            _react2.default.createElement(
                                "div",
                                { className: "history-name" },
                                "HASH ",
                                item.hash
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "history-date" },
                                (0, _functions.HumanTime)(item.date)
                            )
                        );
                    })
                )
            );
        }
    }]);

    return HistoryComponent;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.querySelector("#root"));

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/windowDrag.js":
/*!***************************!*\
  !*** ./src/windowDrag.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WindowDrag = function WindowDrag() {
  var _this = this;

  _classCallCheck(this, WindowDrag);

  this.dragIndex = 0;

  window.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  window.addEventListener("dragenter", function (e) {
    _this.dragIndex++;
    e.preventDefault();
    if (_this.onDragEnter) _this.onDragEnter(e);
  });
  window.addEventListener("dragleave", function (e) {
    if (--_this.dragIndex === 0 && _this.onDragLeave) _this.onDragLeave(e);
    e.preventDefault();
  });
  window.addEventListener("drop", function (e) {

    if (_this.dragIndex > 0) {
      if (--_this.dragIndex === 0 && _this.onDragLeave) {
        _this.onDragLeave();
      }
    }

    if (_this.onDrop) _this.onDrop(e);
    e.preventDefault();
  });
};

exports.default = WindowDrag;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Flcy1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9janMvcmVhY3QtZG9tLmRldmVsb3BtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jhc2U2NC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9oaXN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUuY3NzPzhmMzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dpbmRvd0RyYWcuanMiXSwibmFtZXMiOlsiZW5jb2RlIiwiZGVjb2RlIiwiQkFTRTY0X0FSUkFZIiwic3BsaXQiLCJtYXAiLCJjIiwiY2hhckNvZGVBdCIsIkJBU0U2NF9FTkNPREVfVEFCTEUiLCJNYXAiLCJvcmQiLCJpIiwiQkFTRTY0X0RFQ09ERV9UQUJMRSIsImJ1ZmZlciIsIlVpbnQ4QXJyYXkiLCJzbGljZSIsIm91dHB1dCIsIk1hdGgiLCJjZWlsIiwibGVuZ3RoIiwiY29udGludW91cyIsImZsb29yIiwiayIsImdldCIsInVuZGVmaW5lZCIsInYiLCJwIiwiaW5kZXhPZiIsInN1YmFycmF5IiwiU3RyaW5nVG9CeXRlcyIsIkJ5dGVzVG9TdHJpbmciLCJBRVNEZWNyeXB0IiwiQUVTRW5jcnlwdCIsIkdlbmVyYXRlTGVuZ3RoUHJlZml4ZWRTdHJpbmciLCJBZGRIZWFkZXIiLCJSZW1vdmVIZWFkZXIiLCJEZWNvZGUiLCJFbmNvZGUiLCJIYXNoIiwiSHVtYW5UaW1lIiwiRG93bmxvYWREYXRhIiwiYmFzZTY0IiwiY1NoYXJwSGVhZGVyIiwiYWVzS2V5IiwiZWNiIiwiYWVzIiwiU3RyaW5nIiwicHJvdG90eXBlIiwicmV2ZXJzZSIsImpvaW4iLCJzdHJpbmciLCJUZXh0RW5jb2RlciIsImJ5dGVzIiwiVGV4dERlY29kZXIiLCJkYXRhIiwiZGVjcnlwdCIsInBhZFZhbHVlIiwicGFkZGVkIiwiZmlsbCIsInNldCIsImVuY3J5cHQiLCJtaW4iLCJwdXNoIiwibGVuZ3RoRGF0YSIsIm5ld0J5dGVzIiwibGVuZ3RoQ291bnQiLCJqc29uU3RyaW5nIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsInZhbHVlIiwicHJlY2lzaW9uIiwibXVsdGkiLCJwb3ciLCJkYXRlIiwibWludXRlcyIsIkRhdGUiLCJob3VycyIsImRheXMiLCJ3ZWVrcyIsIm1vbnRocyIsInllYXJzIiwiZmlsZU5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJ3aW5kb3ciLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJCbG9iIiwidHlwZSIsImJvZHkiLCJhcHBlbmQiLCJjbGljayIsInJlbW92ZUNoaWxkIiwiTE9DQUxfU1RPUkFHRV9OQU1FIiwiSGlzdG9yeSIsInN5bmNGcm9tTG9jYWxTdG9yYWdlIiwiaGlzdG9yeSIsInJlcyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJmb3JFYWNoIiwiaXRlbSIsIm9uQ2hhbmdlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImVyciIsImRlcGFydGVkIiwiY29uc29sZSIsImVycm9yIiwiaGFzaCIsInJlbW92ZUxlYXN0UmVjZW50Iiwic3luY1RvTG9jYWxTdG9yYWdlIiwidW5zaGlmdCIsImZpbHRlciIsInBvcCIsIndpbmRvd0RyYWciLCJXaW5kb3dEcmFnIiwiQXBwIiwic3RhdGUiLCJnYW1lRmlsZSIsImdhbWVGaWxlT3JpZ2luYWwiLCJlZGl0aW5nIiwiZHJhZ2dpbmciLCJzd2l0Y2hNb2RlIiwiaGFuZGxlRmlsZUNsaWNrIiwiZmlsZUlucHV0UmVmIiwiY3VycmVudCIsImhhbmRsZUZpbGVDaGFuZ2UiLCJmaWxlcyIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzVGV4dCIsInJlYWRBc0FycmF5QnVmZmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc3VsdCIsImRlY3J5cHRlZCIsInJlbW92ZUZyb21IaXN0b3J5IiwiYWRkVG9IaXN0b3J5IiwibmFtZSIsInNldEdhbWVGaWxlIiwiYWxlcnQiLCJ3YXJuIiwiaGFuZGxlRWRpdG9yQ2hhbmdlIiwic2V0U3RhdGUiLCJlIiwidGFyZ2V0IiwiaGFuZGxlUmVzZXQiLCJoYW5kbGVEb3dubG9hZEFzU3dpdGNoU2F2ZSIsImhhbmRsZURvd25sb2FkIiwiZW5jcnlwdGVkIiwiZ2FtZUZpbGVOYW1lIiwiUmVhY3QiLCJjcmVhdGVSZWYiLCJvbkRyb3AiLCJkYXRhVHJhbnNmZXIiLCJvbkRyYWdFbnRlciIsIm9uRHJhZ0xlYXZlIiwiY29sb3IiLCJDb21wb25lbnQiLCJIaXN0b3J5Q29tcG9uZW50IiwiZm9yY2VVcGRhdGUiLCJjb3VudCIsInByb3BzIiwiaGFuZGxlQ2xpY2siLCJzY3JvbGxUbyIsInByZXZlbnREZWZhdWx0IiwiUmVhY3RET00iLCJyZW5kZXIiLCJxdWVyeVNlbGVjdG9yIiwiZHJhZ0luZGV4Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlDQUF5QyxjQUFjOztBQUV2RCx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUE7Ozs7Ozs7Ozs7OztBQ1hBOzs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhO0FBQ2IsS0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsNENBQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7Ozs7Ozs7Ozs7OztBQ3ZhVTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFxQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLEtBQXFDLEVBQUUsRUFLMUM7QUFDRCxtQkFBbUIsbUJBQU8sQ0FBQyw2RkFBZ0M7QUFDM0Q7Ozs7Ozs7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7OztBQUliLElBQUksSUFBcUM7QUFDekM7QUFDQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsNERBQWU7QUFDckMscUJBQXFCLG1CQUFPLENBQUMsOEVBQTJCOztBQUV4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEU7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7O0FBRUE7QUFDQTtB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QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEVBQUU7O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEseUNBQXlDOztBQUV6QztBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQSx5Q0FBeUM7QUFDekM7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBYTtBQUN4QixXQUFXLEVBQUU7QUFDYjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMERBQTBEO0FBQzFEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFD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QTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDMVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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LENBQVlULENBQVo7QUFDakJBLE1BQUVxQixjQUFGO0FBQ0QsR0FWRDtBQVdELEM7O2tCQTFCa0JsRCxVIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLyohIE1JVCBMaWNlbnNlLiBDb3B5cmlnaHQgMjAxNS0yMDE4IFJpY2hhcmQgTW9vcmUgPG1lQHJpY21vby5jb20+LiBTZWUgTElDRU5TRS50eHQuICovXG4oZnVuY3Rpb24ocm9vdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tJbnQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIChwYXJzZUludCh2YWx1ZSkgPT09IHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ludHMoYXJyYXlpc2gpIHtcbiAgICAgICAgaWYgKCFjaGVja0ludChhcnJheWlzaC5sZW5ndGgpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlpc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghY2hlY2tJbnQoYXJyYXlpc2hbaV0pIHx8IGFycmF5aXNoW2ldIDwgMCB8fCBhcnJheWlzaFtpXSA+IDI1NSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvZXJjZUFycmF5KGFyZywgY29weSkge1xuXG4gICAgICAgIC8vIEFycmF5QnVmZmVyIHZpZXdcbiAgICAgICAgaWYgKGFyZy5idWZmZXIgJiYgYXJnLm5hbWUgPT09ICdVaW50OEFycmF5Jykge1xuXG4gICAgICAgICAgICBpZiAoY29weSkge1xuICAgICAgICAgICAgICAgIGlmIChhcmcuc2xpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJdCdzIGFuIGFycmF5OyBjaGVjayBpdCBpcyBhIHZhbGlkIHJlcHJlc2VudGF0aW9uIG9mIGEgYnl0ZVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgICAgICBpZiAoIWNoZWNrSW50cyhhcmcpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcnJheSBjb250YWlucyBpbnZhbGlkIHZhbHVlOiAnICsgYXJnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb21ldGhpbmcgZWxzZSwgYnV0IGJlaGF2ZXMgbGlrZSBhbiBhcnJheSAobWF5YmUgYSBCdWZmZXI/IEFyZ3VtZW50cz8pXG4gICAgICAgIGlmIChjaGVja0ludChhcmcubGVuZ3RoKSAmJiBjaGVja0ludHMoYXJnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQXJyYXkobGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShsZW5ndGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2VBcnJheSwgdGFyZ2V0QXJyYXksIHRhcmdldFN0YXJ0LCBzb3VyY2VTdGFydCwgc291cmNlRW5kKSB7XG4gICAgICAgIGlmIChzb3VyY2VTdGFydCAhPSBudWxsIHx8IHNvdXJjZUVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlQXJyYXkuc2xpY2UpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VBcnJheSA9IHNvdXJjZUFycmF5LnNsaWNlKHNvdXJjZVN0YXJ0LCBzb3VyY2VFbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VBcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNvdXJjZUFycmF5LCBzb3VyY2VTdGFydCwgc291cmNlRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRBcnJheS5zZXQoc291cmNlQXJyYXksIHRhcmdldFN0YXJ0KTtcbiAgICB9XG5cblxuXG4gICAgdmFyIGNvbnZlcnRVdGY4ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiB0b0J5dGVzKHRleHQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXSwgaSA9IDA7XG4gICAgICAgICAgICB0ZXh0ID0gZW5jb2RlVVJJKHRleHQpO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gdGV4dC5jaGFyQ29kZUF0KGkrKyk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBpcyBhICUgc2lnbiwgZW5jb2RlIHRoZSBmb2xsb3dpbmcgMiBieXRlcyBhcyBhIGhleCB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIChjID09PSAzNykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludCh0ZXh0LnN1YnN0cihpLCAyKSwgMTYpKVxuICAgICAgICAgICAgICAgICAgICBpICs9IDI7XG5cbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UsIGp1c3QgdGhlIGFjdHVhbCBieXRlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb2VyY2VBcnJheShyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW10sIGkgPSAwO1xuXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGJ5dGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gYnl0ZXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoYyA8IDEyOCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGMpKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA+IDE5MSAmJiBjIDwgMjI0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgxZikgPDwgNikgfCAoYnl0ZXNbaSArIDFdICYgMHgzZikpKTtcbiAgICAgICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgwZikgPDwgMTIpIHwgKChieXRlc1tpICsgMV0gJiAweDNmKSA8PCA2KSB8IChieXRlc1tpICsgMl0gJiAweDNmKSkpO1xuICAgICAgICAgICAgICAgICAgICBpICs9IDM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvQnl0ZXM6IHRvQnl0ZXMsXG4gICAgICAgICAgICBmcm9tQnl0ZXM6IGZyb21CeXRlcyxcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB2YXIgY29udmVydEhleCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gdG9CeXRlcyh0ZXh0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludCh0ZXh0LnN1YnN0cihpLCAyKSwgMTYpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHA6Ly9peHRpLm5ldC9kZXZlbG9wbWVudC9qYXZhc2NyaXB0LzIwMTEvMTEvMTEvYmFzZTY0LWVuY29kZWRlY29kZS1vZi11dGY4LWluLWJyb3dzZXItd2l0aC1qcy5odG1sXG4gICAgICAgIHZhciBIZXggPSAnMDEyMzQ1Njc4OWFiY2RlZic7XG5cbiAgICAgICAgZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBieXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goSGV4Wyh2ICYgMHhmMCkgPj4gNF0gKyBIZXhbdiAmIDB4MGZdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b0J5dGVzOiB0b0J5dGVzLFxuICAgICAgICAgICAgZnJvbUJ5dGVzOiBmcm9tQnl0ZXMsXG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG5cbiAgICAvLyBOdW1iZXIgb2Ygcm91bmRzIGJ5IGtleXNpemVcbiAgICB2YXIgbnVtYmVyT2ZSb3VuZHMgPSB7MTY6IDEwLCAyNDogMTIsIDMyOiAxNH1cblxuICAgIC8vIFJvdW5kIGNvbnN0YW50IHdvcmRzXG4gICAgdmFyIHJjb24gPSBbMHgwMSwgMHgwMiwgMHgwNCwgMHgwOCwgMHgxMCwgMHgyMCwgMHg0MCwgMHg4MCwgMHgxYiwgMHgzNiwgMHg2YywgMHhkOCwgMHhhYiwgMHg0ZCwgMHg5YSwgMHgyZiwgMHg1ZSwgMHhiYywgMHg2MywgMHhjNiwgMHg5NywgMHgzNSwgMHg2YSwgMHhkNCwgMHhiMywgMHg3ZCwgMHhmYSwgMHhlZiwgMHhjNSwgMHg5MV07XG5cbiAgICAvLyBTLWJveCBhbmQgSW52ZXJzZSBTLWJveCAoUyBpcyBmb3IgU3Vic3RpdHV0aW9uKVxuICAgIHZhciBTID0gWzB4NjMsIDB4N2MsIDB4NzcsIDB4N2IsIDB4ZjIsIDB4NmIsIDB4NmYsIDB4YzUsIDB4MzAsIDB4MDEsIDB4NjcsIDB4MmIsIDB4ZmUsIDB4ZDcsIDB4YWIsIDB4NzYsIDB4Y2EsIDB4ODIsIDB4YzksIDB4N2QsIDB4ZmEsIDB4NTksIDB4NDcsIDB4ZjAsIDB4YWQsIDB4ZDQsIDB4YTIsIDB4YWYsIDB4OWMsIDB4YTQsIDB4NzIsIDB4YzAsIDB4YjcsIDB4ZmQsIDB4OTMsIDB4MjYsIDB4MzYsIDB4M2YsIDB4ZjcsIDB4Y2MsIDB4MzQsIDB4YTUsIDB4ZTUsIDB4ZjEsIDB4NzEsIDB4ZDgsIDB4MzEsIDB4MTUsIDB4MDQsIDB4YzcsIDB4MjMsIDB4YzMsIDB4MTgsIDB4OTYsIDB4MDUsIDB4OWEsIDB4MDcsIDB4MTIsIDB4ODAsIDB4ZTIsIDB4ZWIsIDB4MjcsIDB4YjIsIDB4NzUsIDB4MDksIDB4ODMsIDB4MmMsIDB4MWEsIDB4MWIsIDB4NmUsIDB4NWEsIDB4YTAsIDB4NTIsIDB4M2IsIDB4ZDYsIDB4YjMsIDB4MjksIDB4ZTMsIDB4MmYsIDB4ODQsIDB4NTMsIDB4ZDEsIDB4MDAsIDB4ZWQsIDB4MjAsIDB4ZmMsIDB4YjEsIDB4NWIsIDB4NmEsIDB4Y2IsIDB4YmUsIDB4MzksIDB4NGEsIDB4NGMsIDB4NTgsIDB4Y2YsIDB4ZDAsIDB4ZWYsIDB4YWEsIDB4ZmIsIDB4NDMsIDB4NGQsIDB4MzMsIDB4ODUsIDB4NDUsIDB4ZjksIDB4MDIsIDB4N2YsIDB4NTAsIDB4M2MsIDB4OWYsIDB4YTgsIDB4NTEsIDB4YTMsIDB4NDAsIDB4OGYsIDB4OTIsIDB4OWQsIDB4MzgsIDB4ZjUsIDB4YmMsIDB4YjYsIDB4ZGEsIDB4MjEsIDB4MTAsIDB4ZmYsIDB4ZjMsIDB4ZDIsIDB4Y2QsIDB4MGMsIDB4MTMsIDB4ZWMsIDB4NWYsIDB4OTcsIDB4NDQsIDB4MTcsIDB4YzQsIDB4YTcsIDB4N2UsIDB4M2QsIDB4NjQsIDB4NWQsIDB4MTksIDB4NzMsIDB4NjAsIDB4ODEsIDB4NGYsIDB4ZGMsIDB4MjIsIDB4MmEsIDB4OTAsIDB4ODgsIDB4NDYsIDB4ZWUsIDB4YjgsIDB4MTQsIDB4ZGUsIDB4NWUsIDB4MGIsIDB4ZGIsIDB4ZTAsIDB4MzIsIDB4M2EsIDB4MGEsIDB4NDksIDB4MDYsIDB4MjQsIDB4NWMsIDB4YzIsIDB4ZDMsIDB4YWMsIDB4NjIsIDB4OTEsIDB4OTUsIDB4ZTQsIDB4NzksIDB4ZTcsIDB4YzgsIDB4MzcsIDB4NmQsIDB4OGQsIDB4ZDUsIDB4NGUsIDB4YTksIDB4NmMsIDB4NTYsIDB4ZjQsIDB4ZWEsIDB4NjUsIDB4N2EsIDB4YWUsIDB4MDgsIDB4YmEsIDB4NzgsIDB4MjUsIDB4MmUsIDB4MWMsIDB4YTYsIDB4YjQsIDB4YzYsIDB4ZTgsIDB4ZGQsIDB4NzQsIDB4MWYsIDB4NGIsIDB4YmQsIDB4OGIsIDB4OGEsIDB4NzAsIDB4M2UsIDB4YjUsIDB4NjYsIDB4NDgsIDB4MDMsIDB4ZjYsIDB4MGUsIDB4NjEsIDB4MzUsIDB4NTcsIDB4YjksIDB4ODYsIDB4YzEsIDB4MWQsIDB4OWUsIDB4ZTEsIDB4ZjgsIDB4OTgsIDB4MTEsIDB4NjksIDB4ZDksIDB4OGUsIDB4OTQsIDB4OWIsIDB4MWUsIDB4ODcsIDB4ZTksIDB4Y2UsIDB4NTUsIDB4MjgsIDB4ZGYsIDB4OGMsIDB4YTEsIDB4ODksIDB4MGQsIDB4YmYsIDB4ZTYsIDB4NDIsIDB4NjgsIDB4NDEsIDB4OTksIDB4MmQsIDB4MGYsIDB4YjAsIDB4NTQsIDB4YmIsIDB4MTZdO1xuICAgIHZhciBTaSA9WzB4NTIsIDB4MDksIDB4NmEsIDB4ZDUsIDB4MzAsIDB4MzYsIDB4YTUsIDB4MzgsIDB4YmYsIDB4NDAsIDB4YTMsIDB4OWUsIDB4ODEsIDB4ZjMsIDB4ZDcsIDB4ZmIsIDB4N2MsIDB4ZTMsIDB4MzksIDB4ODIsIDB4OWIsIDB4MmYsIDB4ZmYsIDB4ODcsIDB4MzQsIDB4OGUsIDB4NDMsIDB4NDQsIDB4YzQsIDB4ZGUsIDB4ZTksIDB4Y2IsIDB4NTQsIDB4N2IsIDB4OTQsIDB4MzIsIDB4YTYsIDB4YzIsIDB4MjMsIDB4M2QsIDB4ZWUsIDB4NGMsIDB4OTUsIDB4MGIsIDB4NDIsIDB4ZmEsIDB4YzMsIDB4NGUsIDB4MDgsIDB4MmUsIDB4YTEsIDB4NjYsIDB4MjgsIDB4ZDksIDB4MjQsIDB4YjIsIDB4NzYsIDB4NWIsIDB4YTIsIDB4NDksIDB4NmQsIDB4OGIsIDB4ZDEsIDB4MjUsIDB4NzIsIDB4ZjgsIDB4ZjYsIDB4NjQsIDB4ODYsIDB4NjgsIDB4OTgsIDB4MTYsIDB4ZDQsIDB4YTQsIDB4NWMsIDB4Y2MsIDB4NWQsIDB4NjUsIDB4YjYsIDB4OTIsIDB4NmMsIDB4NzAsIDB4NDgsIDB4NTAsIDB4ZmQsIDB4ZWQsIDB4YjksIDB4ZGEsIDB4NWUsIDB4MTUsIDB4NDYsIDB4NTcsIDB4YTcsIDB4OGQsIDB4OWQsIDB4ODQsIDB4OTAsIDB4ZDgsIDB4YWIsIDB4MDAsIDB4OGMsIDB4YmMsIDB4ZDMsIDB4MGEsIDB4ZjcsIDB4ZTQsIDB4NTgsIDB4MDUsIDB4YjgsIDB4YjMsIDB4NDUsIDB4MDYsIDB4ZDAsIDB4MmMsIDB4MWUsIDB4OGYsIDB4Y2EsIDB4M2YsIDB4MGYsIDB4MDIsIDB4YzEsIDB4YWYsIDB4YmQsIDB4MDMsIDB4MDEsIDB4MTMsIDB4OGEsIDB4NmIsIDB4M2EsIDB4OTEsIDB4MTEsIDB4NDEsIDB4NGYsIDB4NjcsIDB4ZGMsIDB4ZWEsIDB4OTcsIDB4ZjIsIDB4Y2YsIDB4Y2UsIDB4ZjAsIDB4YjQsIDB4ZTYsIDB4NzMsIDB4OTYsIDB4YWMsIDB4NzQsIDB4MjIsIDB4ZTcsIDB4YWQsIDB4MzUsIDB4ODUsIDB4ZTIsIDB4ZjksIDB4MzcsIDB4ZTgsIDB4MWMsIDB4NzUsIDB4ZGYsIDB4NmUsIDB4NDcsIDB4ZjEsIDB4MWEsIDB4NzEsIDB4MWQsIDB4MjksIDB4YzUsIDB4ODksIDB4NmYsIDB4YjcsIDB4NjIsIDB4MGUsIDB4YWEsIDB4MTgsIDB4YmUsIDB4MWIsIDB4ZmMsIDB4NTYsIDB4M2UsIDB4NGIsIDB4YzYsIDB4ZDIsIDB4NzksIDB4MjAsIDB4OWEsIDB4ZGIsIDB4YzAsIDB4ZmUsIDB4NzgsIDB4Y2QsIDB4NWEsIDB4ZjQsIDB4MWYsIDB4ZGQsIDB4YTgsIDB4MzMsIDB4ODgsIDB4MDcsIDB4YzcsIDB4MzEsIDB4YjEsIDB4MTIsIDB4MTAsIDB4NTksIDB4MjcsIDB4ODAsIDB4ZWMsIDB4NWYsIDB4NjAsIDB4NTEsIDB4N2YsIDB4YTksIDB4MTksIDB4YjUsIDB4NGEsIDB4MGQsIDB4MmQsIDB4ZTUsIDB4N2EsIDB4OWYsIDB4OTMsIDB4YzksIDB4OWMsIDB4ZWYsIDB4YTAsIDB4ZTAsIDB4M2IsIDB4NGQsIDB4YWUsIDB4MmEsIDB4ZjUsIDB4YjAsIDB4YzgsIDB4ZWIsIDB4YmIsIDB4M2MsIDB4ODMsIDB4NTMsIDB4OTksIDB4NjEsIDB4MTcsIDB4MmIsIDB4MDQsIDB4N2UsIDB4YmEsIDB4NzcsIDB4ZDYsIDB4MjYsIDB4ZTEsIDB4NjksIDB4MTQsIDB4NjMsIDB4NTUsIDB4MjEsIDB4MGMsIDB4N2RdO1xuXG4gICAgLy8gVHJhbnNmb3JtYXRpb25zIGZvciBlbmNyeXB0aW9uXG4gICAgdmFyIFQxID0gWzB4YzY2MzYzYTUsIDB4Zjg3YzdjODQsIDB4ZWU3Nzc3OTksIDB4ZjY3YjdiOGQsIDB4ZmZmMmYyMGQsIDB4ZDY2YjZiYmQsIDB4ZGU2ZjZmYjEsIDB4OTFjNWM1NTQsIDB4NjAzMDMwNTAsIDB4MDIwMTAxMDMsIDB4Y2U2NzY3YTksIDB4NTYyYjJiN2QsIDB4ZTdmZWZlMTksIDB4YjVkN2Q3NjIsIDB4NGRhYmFiZTYsIDB4ZWM3Njc2OWEsIDB4OGZjYWNhNDUsIDB4MWY4MjgyOWQsIDB4ODljOWM5NDAsIDB4ZmE3ZDdkODcsIDB4ZWZmYWZhMTUsIDB4YjI1OTU5ZWIsIDB4OGU0NzQ3YzksIDB4ZmJmMGYwMGIsIDB4NDFhZGFkZWMsIDB4YjNkNGQ0NjcsIDB4NWZhMmEyZmQsIDB4NDVhZmFmZWEsIDB4MjM5YzljYmYsIDB4NTNhNGE0ZjcsIDB4ZTQ3MjcyOTYsIDB4OWJjMGMwNWIsIDB4NzViN2I3YzIsIDB4ZTFmZGZkMWMsIDB4M2Q5MzkzYWUsIDB4NGMyNjI2NmEsIDB4NmMzNjM2NWEsIDB4N2UzZjNmNDEsIDB4ZjVmN2Y3MDIsIDB4ODNjY2NjNGYsIDB4NjgzNDM0NWMsIDB4NTFhNWE1ZjQsIDB4ZDFlNWU1MzQsIDB4ZjlmMWYxMDgsIDB4ZTI3MTcxOTMsIDB4YWJkOGQ4NzMsIDB4NjIzMTMxNTMsIDB4MmExNTE1M2YsIDB4MDgwNDA0MGMsIDB4OTVjN2M3NTIsIDB4NDYyMzIzNjUsIDB4OWRjM2MzNWUsIDB4MzAxODE4MjgsIDB4Mzc5Njk2YTEsIDB4MGEwNTA1MGYsIDB4MmY5YTlhYjUsIDB4MGUwNzA3MDksIDB4MjQxMjEyMzYsIDB4MWI4MDgwOWIsIDB4ZGZlMmUyM2QsIDB4Y2RlYmViMjYsIDB4NGUyNzI3NjksIDB4N2ZiMmIyY2QsIDB4ZWE3NTc1OWYsIDB4MTIwOTA5MWIsIDB4MWQ4MzgzOWUsIDB4NTgyYzJjNzQsIDB4MzQxYTFhMmUsIDB4MzYxYjFiMmQsIDB4ZGM2ZTZlYjIsIDB4YjQ1YTVhZWUsIDB4NWJhMGEwZmIsIDB4YTQ1MjUyZjYsIDB4NzYzYjNiNGQsIDB4YjdkNmQ2NjEsIDB4N2RiM2IzY2UsIDB4NTIyOTI5N2IsIDB4ZGRlM2UzM2UsIDB4NWUyZjJmNzEsIDB4MTM4NDg0OTcsIDB4YTY1MzUzZjUsIDB4YjlkMWQxNjgsIDB4MDAwMDAwMDAsIDB4YzFlZGVkMmMsIDB4NDAyMDIwNjAsIDB4ZTNmY2ZjMWYsIDB4NzliMWIxYzgsIDB4YjY1YjViZWQsIDB4ZDQ2YTZhYmUsIDB4OGRjYmNiNDYsIDB4NjdiZWJlZDksIDB4NzIzOTM5NGIsIDB4OTQ0YTRhZGUsIDB4OTg0YzRjZDQsIDB4YjA1ODU4ZTgsIDB4ODVjZmNmNGEsIDB4YmJkMGQwNmIsIDB4YzVlZmVmMmEsIDB4NGZhYWFhZTUsIDB4ZWRmYmZiMTYsIDB4ODY0MzQzYzUsIDB4OWE0ZDRkZDcsIDB4NjYzMzMzNTUsIDB4MTE4NTg1OTQsIDB4OGE0NTQ1Y2YsIDB4ZTlmOWY5MTAsIDB4MDQwMjAyMDYsIDB4ZmU3ZjdmODEsIDB4YTA1MDUwZjAsIDB4NzgzYzNjNDQsIDB4MjU5ZjlmYmEsIDB4NGJhOGE4ZTMsIDB4YTI1MTUxZjMsIDB4NWRhM2EzZmUsIDB4ODA0MDQwYzAsIDB4MDU4ZjhmOGEsIDB4M2Y5MjkyYWQsIDB4MjE5ZDlkYmMsIDB4NzAzODM4NDgsIDB4ZjFmNWY1MDQsIDB4NjNiY2JjZGYsIDB4NzdiNmI2YzEsIDB4YWZkYWRhNzUsIDB4NDIyMTIxNjMsIDB4MjAxMDEwMzAsIDB4ZTVmZmZmMWEsIDB4ZmRmM2YzMGUsIDB4YmZkMmQyNmQsIDB4ODFjZGNkNGMsIDB4MTgwYzBjMTQsIDB4MjYxMzEzMzUsIDB4YzNlY2VjMmYsIDB4YmU1ZjVmZTEsIDB4MzU5Nzk3YTIsIDB4ODg0NDQ0Y2MsIDB4MmUxNzE3MzksIDB4OTNjNGM0NTcsIDB4NTVhN2E3ZjIsIDB4ZmM3ZTdlODIsIDB4N2EzZDNkNDcsIDB4Yzg2NDY0YWMsIDB4YmE1ZDVkZTcsIDB4MzIxOTE5MmIsIDB4ZTY3MzczOTUsIDB4YzA2MDYwYTAsIDB4MTk4MTgxOTgsIDB4OWU0ZjRmZDEsIDB4YTNkY2RjN2YsIDB4NDQyMjIyNjYsIDB4NTQyYTJhN2UsIDB4M2I5MDkwYWIsIDB4MGI4ODg4ODMsIDB4OGM0NjQ2Y2EsIDB4YzdlZWVlMjksIDB4NmJiOGI4ZDMsIDB4MjgxNDE0M2MsIDB4YTdkZWRlNzksIDB4YmM1ZTVlZTIsIDB4MTYwYjBiMWQsIDB4YWRkYmRiNzYsIDB4ZGJlMGUwM2IsIDB4NjQzMjMyNTYsIDB4NzQzYTNhNGUsIDB4MTQwYTBhMWUsIDB4OTI0OTQ5ZGIsIDB4MGMwNjA2MGEsIDB4NDgyNDI0NmMsIDB4Yjg1YzVjZTQsIDB4OWZjMmMyNWQsIDB4YmRkM2QzNmUsIDB4NDNhY2FjZWYsIDB4YzQ2MjYyYTYsIDB4Mzk5MTkxYTgsIDB4MzE5NTk1YTQsIDB4ZDNlNGU0MzcsIDB4ZjI3OTc5OGIsIDB4ZDVlN2U3MzIsIDB4OGJjOGM4NDMsIDB4NmUzNzM3NTksIDB4ZGE2ZDZkYjcsIDB4MDE4ZDhkOGMsIDB4YjFkNWQ1NjQsIDB4OWM0ZTRlZDIsIDB4NDlhOWE5ZTAsIDB4ZDg2YzZjYjQsIDB4YWM1NjU2ZmEsIDB4ZjNmNGY0MDcsIDB4Y2ZlYWVhMjUsIDB4Y2E2NTY1YWYsIDB4ZjQ3YTdhOGUsIDB4NDdhZWFlZTksIDB4MTAwODA4MTgsIDB4NmZiYWJhZDUsIDB4ZjA3ODc4ODgsIDB4NGEyNTI1NmYsIDB4NWMyZTJlNzIsIDB4MzgxYzFjMjQsIDB4NTdhNmE2ZjEsIDB4NzNiNGI0YzcsIDB4OTdjNmM2NTEsIDB4Y2JlOGU4MjMsIDB4YTFkZGRkN2MsIDB4ZTg3NDc0OWMsIDB4M2UxZjFmMjEsIDB4OTY0YjRiZGQsIDB4NjFiZGJkZGMsIDB4MGQ4YjhiODYsIDB4MGY4YThhODUsIDB4ZTA3MDcwOTAsIDB4N2MzZTNlNDIsIDB4NzFiNWI1YzQsIDB4Y2M2NjY2YWEsIDB4OTA0ODQ4ZDgsIDB4MDYwMzAzMDUsIDB4ZjdmNmY2MDEsIDB4MWMwZTBlMTIsIDB4YzI2MTYxYTMsIDB4NmEzNTM1NWYsIDB4YWU1NzU3ZjksIDB4NjliOWI5ZDAsIDB4MTc4Njg2OTEsIDB4OTljMWMxNTgsIDB4M2ExZDFkMjcsIDB4Mjc5ZTllYjksIDB4ZDllMWUxMzgsIDB4ZWJmOGY4MTMsIDB4MmI5ODk4YjMsIDB4MjIxMTExMzMsIDB4ZDI2OTY5YmIsIDB4YTlkOWQ5NzAsIDB4MDc4ZThlODksIDB4MzM5NDk0YTcsIDB4MmQ5YjliYjYsIDB4M2MxZTFlMjIsIDB4MTU4Nzg3OTIsIDB4YzllOWU5MjAsIDB4ODdjZWNlNDksIDB4YWE1NTU1ZmYsIDB4NTAyODI4NzgsIDB4YTVkZmRmN2EsIDB4MDM4YzhjOGYsIDB4NTlhMWExZjgsIDB4MDk4OTg5ODAsIDB4MWEwZDBkMTcsIDB4NjViZmJmZGEsIDB4ZDdlNmU2MzEsIDB4ODQ0MjQyYzYsIDB4ZDA2ODY4YjgsIDB4ODI0MTQxYzMsIDB4Mjk5OTk5YjAsIDB4NWEyZDJkNzcsIDB4MWUwZjBmMTEsIDB4N2JiMGIwY2IsIDB4YTg1NDU0ZmMsIDB4NmRiYmJiZDYsIDB4MmMxNjE2M2FdO1xuICAgIHZhciBUMiA9IFsweGE1YzY2MzYzLCAweDg0Zjg3YzdjLCAweDk5ZWU3Nzc3LCAweDhkZjY3YjdiLCAweDBkZmZmMmYyLCAweGJkZDY2YjZiLCAweGIxZGU2ZjZmLCAweDU0OTFjNWM1LCAweDUwNjAzMDMwLCAweDAzMDIwMTAxLCAweGE5Y2U2NzY3LCAweDdkNTYyYjJiLCAweDE5ZTdmZWZlLCAweDYyYjVkN2Q3LCAweGU2NGRhYmFiLCAweDlhZWM3Njc2LCAweDQ1OGZjYWNhLCAweDlkMWY4MjgyLCAweDQwODljOWM5LCAweDg3ZmE3ZDdkLCAweDE1ZWZmYWZhLCAweGViYjI1OTU5LCAweGM5OGU0NzQ3LCAweDBiZmJmMGYwLCAweGVjNDFhZGFkLCAweDY3YjNkNGQ0LCAweGZkNWZhMmEyLCAweGVhNDVhZmFmLCAweGJmMjM5YzljLCAweGY3NTNhNGE0LCAweDk2ZTQ3MjcyLCAweDViOWJjMGMwLCAweGMyNzViN2I3LCAweDFjZTFmZGZkLCAweGFlM2Q5MzkzLCAweDZhNGMyNjI2LCAweDVhNmMzNjM2LCAweDQxN2UzZjNmLCAweDAyZjVmN2Y3LCAweDRmODNjY2NjLCAweDVjNjgzNDM0LCAweGY0NTFhNWE1LCAweDM0ZDFlNWU1LCAweDA4ZjlmMWYxLCAweDkzZTI3MTcxLCAweDczYWJkOGQ4LCAweDUzNjIzMTMxLCAweDNmMmExNTE1LCAweDBjMDgwNDA0LCAweDUyOTVjN2M3LCAweDY1NDYyMzIzLCAweDVlOWRjM2MzLCAweDI4MzAxODE4LCAweGExMzc5Njk2LCAweDBmMGEwNTA1LCAweGI1MmY5YTlhLCAweDA5MGUwNzA3LCAweDM2MjQxMjEyLCAweDliMWI4MDgwLCAweDNkZGZlMmUyLCAweDI2Y2RlYmViLCAweDY5NGUyNzI3LCAweGNkN2ZiMmIyLCAweDlmZWE3NTc1LCAweDFiMTIwOTA5LCAweDllMWQ4MzgzLCAweDc0NTgyYzJjLCAweDJlMzQxYTFhLCAweDJkMzYxYjFiLCAweGIyZGM2ZTZlLCAweGVlYjQ1YTVhLCAweGZiNWJhMGEwLCAweGY2YTQ1MjUyLCAweDRkNzYzYjNiLCAweDYxYjdkNmQ2LCAweGNlN2RiM2IzLCAweDdiNTIyOTI5LCAweDNlZGRlM2UzLCAweDcxNWUyZjJmLCAweDk3MTM4NDg0LCAweGY1YTY1MzUzLCAweDY4YjlkMWQxLCAweDAwMDAwMDAwLCAweDJjYzFlZGVkLCAweDYwNDAyMDIwLCAweDFmZTNmY2ZjLCAweGM4NzliMWIxLCAweGVkYjY1YjViLCAweGJlZDQ2YTZhLCAweDQ2OGRjYmNiLCAweGQ5NjdiZWJlLCAweDRiNzIzOTM5LCAweGRlOTQ0YTRhLCAweGQ0OTg0YzRjLCAweGU4YjA1ODU4LCAweDRhODVjZmNmLCAweDZiYmJkMGQwLCAweDJhYzVlZmVmLCAweGU1NGZhYWFhLCAweDE2ZWRmYmZiLCAweGM1ODY0MzQzLCAweGQ3OWE0ZDRkLCAweDU1NjYzMzMzLCAweDk0MTE4NTg1LCAweGNmOGE0NTQ1LCAweDEwZTlmOWY5LCAweDA2MDQwMjAyLCAweDgxZmU3ZjdmLCAweGYwYTA1MDUwLCAweDQ0NzgzYzNjLCAweGJhMjU5ZjlmLCAweGUzNGJhOGE4LCAweGYzYTI1MTUxLCAweGZlNWRhM2EzLCAweGMwODA0MDQwLCAweDhhMDU4ZjhmLCAweGFkM2Y5MjkyLCAweGJjMjE5ZDlkLCAweDQ4NzAzODM4LCAweDA0ZjFmNWY1LCAweGRmNjNiY2JjLCAweGMxNzdiNmI2LCAweDc1YWZkYWRhLCAweDYzNDIyMTIxLCAweDMwMjAxMDEwLCAweDFhZTVmZmZmLCAweDBlZmRmM2YzLCAweDZkYmZkMmQyLCAweDRjODFjZGNkLCAweDE0MTgwYzBjLCAweDM1MjYxMzEzLCAweDJmYzNlY2VjLCAweGUxYmU1ZjVmLCAweGEyMzU5Nzk3LCAweGNjODg0NDQ0LCAweDM5MmUxNzE3LCAweDU3OTNjNGM0LCAweGYyNTVhN2E3LCAweDgyZmM3ZTdlLCAweDQ3N2EzZDNkLCAweGFjYzg2NDY0LCAweGU3YmE1ZDVkLCAweDJiMzIxOTE5LCAweDk1ZTY3MzczLCAweGEwYzA2MDYwLCAweDk4MTk4MTgxLCAweGQxOWU0ZjRmLCAweDdmYTNkY2RjLCAweDY2NDQyMjIyLCAweDdlNTQyYTJhLCAweGFiM2I5MDkwLCAweDgzMGI4ODg4LCAweGNhOGM0NjQ2LCAweDI5YzdlZWVlLCAweGQzNmJiOGI4LCAweDNjMjgxNDE0LCAweDc5YTdkZWRlLCAweGUyYmM1ZTVlLCAweDFkMTYwYjBiLCAweDc2YWRkYmRiLCAweDNiZGJlMGUwLCAweDU2NjQzMjMyLCAweDRlNzQzYTNhLCAweDFlMTQwYTBhLCAweGRiOTI0OTQ5LCAweDBhMGMwNjA2LCAweDZjNDgyNDI0LCAweGU0Yjg1YzVjLCAweDVkOWZjMmMyLCAweDZlYmRkM2QzLCAweGVmNDNhY2FjLCAweGE2YzQ2MjYyLCAweGE4Mzk5MTkxLCAweGE0MzE5NTk1LCAweDM3ZDNlNGU0LCAweDhiZjI3OTc5LCAweDMyZDVlN2U3LCAweDQzOGJjOGM4LCAweDU5NmUzNzM3LCAweGI3ZGE2ZDZkLCAweDhjMDE4ZDhkLCAweDY0YjFkNWQ1LCAweGQyOWM0ZTRlLCAweGUwNDlhOWE5LCAweGI0ZDg2YzZjLCAweGZhYWM1NjU2LCAweDA3ZjNmNGY0LCAweDI1Y2ZlYWVhLCAweGFmY2E2NTY1LCAweDhlZjQ3YTdhLCAweGU5NDdhZWFlLCAweDE4MTAwODA4LCAweGQ1NmZiYWJhLCAweDg4ZjA3ODc4LCAweDZmNGEyNTI1LCAweDcyNWMyZTJlLCAweDI0MzgxYzFjLCAweGYxNTdhNmE2LCAweGM3NzNiNGI0LCAweDUxOTdjNmM2LCAweDIzY2JlOGU4LCAweDdjYTFkZGRkLCAweDljZTg3NDc0LCAweDIxM2UxZjFmLCAweGRkOTY0YjRiLCAweGRjNjFiZGJkLCAweDg2MGQ4YjhiLCAweDg1MGY4YThhLCAweDkwZTA3MDcwLCAweDQyN2MzZTNlLCAweGM0NzFiNWI1LCAweGFhY2M2NjY2LCAweGQ4OTA0ODQ4LCAweDA1MDYwMzAzLCAweDAxZjdmNmY2LCAweDEyMWMwZTBlLCAweGEzYzI2MTYxLCAweDVmNmEzNTM1LCAweGY5YWU1NzU3LCAweGQwNjliOWI5LCAweDkxMTc4Njg2LCAweDU4OTljMWMxLCAweDI3M2ExZDFkLCAweGI5Mjc5ZTllLCAweDM4ZDllMWUxLCAweDEzZWJmOGY4LCAweGIzMmI5ODk4LCAweDMzMjIxMTExLCAweGJiZDI2OTY5LCAweDcwYTlkOWQ5LCAweDg5MDc4ZThlLCAweGE3MzM5NDk0LCAweGI2MmQ5YjliLCAweDIyM2MxZTFlLCAweDkyMTU4Nzg3LCAweDIwYzllOWU5LCAweDQ5ODdjZWNlLCAweGZmYWE1NTU1LCAweDc4NTAyODI4LCAweDdhYTVkZmRmLCAweDhmMDM4YzhjLCAweGY4NTlhMWExLCAweDgwMDk4OTg5LCAweDE3MWEwZDBkLCAweGRhNjViZmJmLCAweDMxZDdlNmU2LCAweGM2ODQ0MjQyLCAweGI4ZDA2ODY4LCAweGMzODI0MTQxLCAweGIwMjk5OTk5LCAweDc3NWEyZDJkLCAweDExMWUwZjBmLCAweGNiN2JiMGIwLCAweGZjYTg1NDU0LCAweGQ2NmRiYmJiLCAweDNhMmMxNjE2XTtcbiAgICB2YXIgVDMgPSBbMHg2M2E1YzY2MywgMHg3Yzg0Zjg3YywgMHg3Nzk5ZWU3NywgMHg3YjhkZjY3YiwgMHhmMjBkZmZmMiwgMHg2YmJkZDY2YiwgMHg2ZmIxZGU2ZiwgMHhjNTU0OTFjNSwgMHgzMDUwNjAzMCwgMHgwMTAzMDIwMSwgMHg2N2E5Y2U2NywgMHgyYjdkNTYyYiwgMHhmZTE5ZTdmZSwgMHhkNzYyYjVkNywgMHhhYmU2NGRhYiwgMHg3NjlhZWM3NiwgMHhjYTQ1OGZjYSwgMHg4MjlkMWY4MiwgMHhjOTQwODljOSwgMHg3ZDg3ZmE3ZCwgMHhmYTE1ZWZmYSwgMHg1OWViYjI1OSwgMHg0N2M5OGU0NywgMHhmMDBiZmJmMCwgMHhhZGVjNDFhZCwgMHhkNDY3YjNkNCwgMHhhMmZkNWZhMiwgMHhhZmVhNDVhZiwgMHg5Y2JmMjM5YywgMHhhNGY3NTNhNCwgMHg3Mjk2ZTQ3MiwgMHhjMDViOWJjMCwgMHhiN2MyNzViNywgMHhmZDFjZTFmZCwgMHg5M2FlM2Q5MywgMHgyNjZhNGMyNiwgMHgzNjVhNmMzNiwgMHgzZjQxN2UzZiwgMHhmNzAyZjVmNywgMHhjYzRmODNjYywgMHgzNDVjNjgzNCwgMHhhNWY0NTFhNSwgMHhlNTM0ZDFlNSwgMHhmMTA4ZjlmMSwgMHg3MTkzZTI3MSwgMHhkODczYWJkOCwgMHgzMTUzNjIzMSwgMHgxNTNmMmExNSwgMHgwNDBjMDgwNCwgMHhjNzUyOTVjNywgMHgyMzY1NDYyMywgMHhjMzVlOWRjMywgMHgxODI4MzAxOCwgMHg5NmExMzc5NiwgMHgwNTBmMGEwNSwgMHg5YWI1MmY5YSwgMHgwNzA5MGUwNywgMHgxMjM2MjQxMiwgMHg4MDliMWI4MCwgMHhlMjNkZGZlMiwgMHhlYjI2Y2RlYiwgMHgyNzY5NGUyNywgMHhiMmNkN2ZiMiwgMHg3NTlmZWE3NSwgMHgwOTFiMTIwOSwgMHg4MzllMWQ4MywgMHgyYzc0NTgyYywgMHgxYTJlMzQxYSwgMHgxYjJkMzYxYiwgMHg2ZWIyZGM2ZSwgMHg1YWVlYjQ1YSwgMHhhMGZiNWJhMCwgMHg1MmY2YTQ1MiwgMHgzYjRkNzYzYiwgMHhkNjYxYjdkNiwgMHhiM2NlN2RiMywgMHgyOTdiNTIyOSwgMHhlMzNlZGRlMywgMHgyZjcxNWUyZiwgMHg4NDk3MTM4NCwgMHg1M2Y1YTY1MywgMHhkMTY4YjlkMSwgMHgwMDAwMDAwMCwgMHhlZDJjYzFlZCwgMHgyMDYwNDAyMCwgMHhmYzFmZTNmYywgMHhiMWM4NzliMSwgMHg1YmVkYjY1YiwgMHg2YWJlZDQ2YSwgMHhjYjQ2OGRjYiwgMHhiZWQ5NjdiZSwgMHgzOTRiNzIzOSwgMHg0YWRlOTQ0YSwgMHg0Y2Q0OTg0YywgMHg1OGU4YjA1OCwgMHhjZjRhODVjZiwgMHhkMDZiYmJkMCwgMHhlZjJhYzVlZiwgMHhhYWU1NGZhYSwgMHhmYjE2ZWRmYiwgMHg0M2M1ODY0MywgMHg0ZGQ3OWE0ZCwgMHgzMzU1NjYzMywgMHg4NTk0MTE4NSwgMHg0NWNmOGE0NSwgMHhmOTEwZTlmOSwgMHgwMjA2MDQwMiwgMHg3ZjgxZmU3ZiwgMHg1MGYwYTA1MCwgMHgzYzQ0NzgzYywgMHg5ZmJhMjU5ZiwgMHhhOGUzNGJhOCwgMHg1MWYzYTI1MSwgMHhhM2ZlNWRhMywgMHg0MGMwODA0MCwgMHg4ZjhhMDU4ZiwgMHg5MmFkM2Y5MiwgMHg5ZGJjMjE5ZCwgMHgzODQ4NzAzOCwgMHhmNTA0ZjFmNSwgMHhiY2RmNjNiYywgMHhiNmMxNzdiNiwgMHhkYTc1YWZkYSwgMHgyMTYzNDIyMSwgMHgxMDMwMjAxMCwgMHhmZjFhZTVmZiwgMHhmMzBlZmRmMywgMHhkMjZkYmZkMiwgMHhjZDRjODFjZCwgMHgwYzE0MTgwYywgMHgxMzM1MjYxMywgMHhlYzJmYzNlYywgMHg1ZmUxYmU1ZiwgMHg5N2EyMzU5NywgMHg0NGNjODg0NCwgMHgxNzM5MmUxNywgMHhjNDU3OTNjNCwgMHhhN2YyNTVhNywgMHg3ZTgyZmM3ZSwgMHgzZDQ3N2EzZCwgMHg2NGFjYzg2NCwgMHg1ZGU3YmE1ZCwgMHgxOTJiMzIxOSwgMHg3Mzk1ZTY3MywgMHg2MGEwYzA2MCwgMHg4MTk4MTk4MSwgMHg0ZmQxOWU0ZiwgMHhkYzdmYTNkYywgMHgyMjY2NDQyMiwgMHgyYTdlNTQyYSwgMHg5MGFiM2I5MCwgMHg4ODgzMGI4OCwgMHg0NmNhOGM0NiwgMHhlZTI5YzdlZSwgMHhiOGQzNmJiOCwgMHgxNDNjMjgxNCwgMHhkZTc5YTdkZSwgMHg1ZWUyYmM1ZSwgMHgwYjFkMTYwYiwgMHhkYjc2YWRkYiwgMHhlMDNiZGJlMCwgMHgzMjU2NjQzMiwgMHgzYTRlNzQzYSwgMHgwYTFlMTQwYSwgMHg0OWRiOTI0OSwgMHgwNjBhMGMwNiwgMHgyNDZjNDgyNCwgMHg1Y2U0Yjg1YywgMHhjMjVkOWZjMiwgMHhkMzZlYmRkMywgMHhhY2VmNDNhYywgMHg2MmE2YzQ2MiwgMHg5MWE4Mzk5MSwgMHg5NWE0MzE5NSwgMHhlNDM3ZDNlNCwgMHg3OThiZjI3OSwgMHhlNzMyZDVlNywgMHhjODQzOGJjOCwgMHgzNzU5NmUzNywgMHg2ZGI3ZGE2ZCwgMHg4ZDhjMDE4ZCwgMHhkNTY0YjFkNSwgMHg0ZWQyOWM0ZSwgMHhhOWUwNDlhOSwgMHg2Y2I0ZDg2YywgMHg1NmZhYWM1NiwgMHhmNDA3ZjNmNCwgMHhlYTI1Y2ZlYSwgMHg2NWFmY2E2NSwgMHg3YThlZjQ3YSwgMHhhZWU5NDdhZSwgMHgwODE4MTAwOCwgMHhiYWQ1NmZiYSwgMHg3ODg4ZjA3OCwgMHgyNTZmNGEyNSwgMHgyZTcyNWMyZSwgMHgxYzI0MzgxYywgMHhhNmYxNTdhNiwgMHhiNGM3NzNiNCwgMHhjNjUxOTdjNiwgMHhlODIzY2JlOCwgMHhkZDdjYTFkZCwgMHg3NDljZTg3NCwgMHgxZjIxM2UxZiwgMHg0YmRkOTY0YiwgMHhiZGRjNjFiZCwgMHg4Yjg2MGQ4YiwgMHg4YTg1MGY4YSwgMHg3MDkwZTA3MCwgMHgzZTQyN2MzZSwgMHhiNWM0NzFiNSwgMHg2NmFhY2M2NiwgMHg0OGQ4OTA0OCwgMHgwMzA1MDYwMywgMHhmNjAxZjdmNiwgMHgwZTEyMWMwZSwgMHg2MWEzYzI2MSwgMHgzNTVmNmEzNSwgMHg1N2Y5YWU1NywgMHhiOWQwNjliOSwgMHg4NjkxMTc4NiwgMHhjMTU4OTljMSwgMHgxZDI3M2ExZCwgMHg5ZWI5Mjc5ZSwgMHhlMTM4ZDllMSwgMHhmODEzZWJmOCwgMHg5OGIzMmI5OCwgMHgxMTMzMjIxMSwgMHg2OWJiZDI2OSwgMHhkOTcwYTlkOSwgMHg4ZTg5MDc4ZSwgMHg5NGE3MzM5NCwgMHg5YmI2MmQ5YiwgMHgxZTIyM2MxZSwgMHg4NzkyMTU4NywgMHhlOTIwYzllOSwgMHhjZTQ5ODdjZSwgMHg1NWZmYWE1NSwgMHgyODc4NTAyOCwgMHhkZjdhYTVkZiwgMHg4YzhmMDM4YywgMHhhMWY4NTlhMSwgMHg4OTgwMDk4OSwgMHgwZDE3MWEwZCwgMHhiZmRhNjViZiwgMHhlNjMxZDdlNiwgMHg0MmM2ODQ0MiwgMHg2OGI4ZDA2OCwgMHg0MWMzODI0MSwgMHg5OWIwMjk5OSwgMHgyZDc3NWEyZCwgMHgwZjExMWUwZiwgMHhiMGNiN2JiMCwgMHg1NGZjYTg1NCwgMHhiYmQ2NmRiYiwgMHgxNjNhMmMxNl07XG4gICAgdmFyIFQ0ID0gWzB4NjM2M2E1YzYsIDB4N2M3Yzg0ZjgsIDB4Nzc3Nzk5ZWUsIDB4N2I3YjhkZjYsIDB4ZjJmMjBkZmYsIDB4NmI2YmJkZDYsIDB4NmY2ZmIxZGUsIDB4YzVjNTU0OTEsIDB4MzAzMDUwNjAsIDB4MDEwMTAzMDIsIDB4Njc2N2E5Y2UsIDB4MmIyYjdkNTYsIDB4ZmVmZTE5ZTcsIDB4ZDdkNzYyYjUsIDB4YWJhYmU2NGQsIDB4NzY3NjlhZWMsIDB4Y2FjYTQ1OGYsIDB4ODI4MjlkMWYsIDB4YzljOTQwODksIDB4N2Q3ZDg3ZmEsIDB4ZmFmYTE1ZWYsIDB4NTk1OWViYjIsIDB4NDc0N2M5OGUsIDB4ZjBmMDBiZmIsIDB4YWRhZGVjNDEsIDB4ZDRkNDY3YjMsIDB4YTJhMmZkNWYsIDB4YWZhZmVhNDUsIDB4OWM5Y2JmMjMsIDB4YTRhNGY3NTMsIDB4NzI3Mjk2ZTQsIDB4YzBjMDViOWIsIDB4YjdiN2MyNzUsIDB4ZmRmZDFjZTEsIDB4OTM5M2FlM2QsIDB4MjYyNjZhNGMsIDB4MzYzNjVhNmMsIDB4M2YzZjQxN2UsIDB4ZjdmNzAyZjUsIDB4Y2NjYzRmODMsIDB4MzQzNDVjNjgsIDB4YTVhNWY0NTEsIDB4ZTVlNTM0ZDEsIDB4ZjFmMTA4ZjksIDB4NzE3MTkzZTIsIDB4ZDhkODczYWIsIDB4MzEzMTUzNjIsIDB4MTUxNTNmMmEsIDB4MDQwNDBjMDgsIDB4YzdjNzUyOTUsIDB4MjMyMzY1NDYsIDB4YzNjMzVlOWQsIDB4MTgxODI4MzAsIDB4OTY5NmExMzcsIDB4MDUwNTBmMGEsIDB4OWE5YWI1MmYsIDB4MDcwNzA5MGUsIDB4MTIxMjM2MjQsIDB4ODA4MDliMWIsIDB4ZTJlMjNkZGYsIDB4ZWJlYjI2Y2QsIDB4MjcyNzY5NGUsIDB4YjJiMmNkN2YsIDB4NzU3NTlmZWEsIDB4MDkwOTFiMTIsIDB4ODM4MzllMWQsIDB4MmMyYzc0NTgsIDB4MWExYTJlMzQsIDB4MWIxYjJkMzYsIDB4NmU2ZWIyZGMsIDB4NWE1YWVlYjQsIDB4YTBhMGZiNWIsIDB4NTI1MmY2YTQsIDB4M2IzYjRkNzYsIDB4ZDZkNjYxYjcsIDB4YjNiM2NlN2QsIDB4MjkyOTdiNTIsIDB4ZTNlMzNlZGQsIDB4MmYyZjcxNWUsIDB4ODQ4NDk3MTMsIDB4NTM1M2Y1YTYsIDB4ZDFkMTY4YjksIDB4MDAwMDAwMDAsIDB4ZWRlZDJjYzEsIDB4MjAyMDYwNDAsIDB4ZmNmYzFmZTMsIDB4YjFiMWM4NzksIDB4NWI1YmVkYjYsIDB4NmE2YWJlZDQsIDB4Y2JjYjQ2OGQsIDB4YmViZWQ5NjcsIDB4MzkzOTRiNzIsIDB4NGE0YWRlOTQsIDB4NGM0Y2Q0OTgsIDB4NTg1OGU4YjAsIDB4Y2ZjZjRhODUsIDB4ZDBkMDZiYmIsIDB4ZWZlZjJhYzUsIDB4YWFhYWU1NGYsIDB4ZmJmYjE2ZWQsIDB4NDM0M2M1ODYsIDB4NGQ0ZGQ3OWEsIDB4MzMzMzU1NjYsIDB4ODU4NTk0MTEsIDB4NDU0NWNmOGEsIDB4ZjlmOTEwZTksIDB4MDIwMjA2MDQsIDB4N2Y3ZjgxZmUsIDB4NTA1MGYwYTAsIDB4M2MzYzQ0NzgsIDB4OWY5ZmJhMjUsIDB4YThhOGUzNGIsIDB4NTE1MWYzYTIsIDB4YTNhM2ZlNWQsIDB4NDA0MGMwODAsIDB4OGY4ZjhhMDUsIDB4OTI5MmFkM2YsIDB4OWQ5ZGJjMjEsIDB4MzgzODQ4NzAsIDB4ZjVmNTA0ZjEsIDB4YmNiY2RmNjMsIDB4YjZiNmMxNzcsIDB4ZGFkYTc1YWYsIDB4MjEyMTYzNDIsIDB4MTAxMDMwMjAsIDB4ZmZmZjFhZTUsIDB4ZjNmMzBlZmQsIDB4ZDJkMjZkYmYsIDB4Y2RjZDRjODEsIDB4MGMwYzE0MTgsIDB4MTMxMzM1MjYsIDB4ZWNlYzJmYzMsIDB4NWY1ZmUxYmUsIDB4OTc5N2EyMzUsIDB4NDQ0NGNjODgsIDB4MTcxNzM5MmUsIDB4YzRjNDU3OTMsIDB4YTdhN2YyNTUsIDB4N2U3ZTgyZmMsIDB4M2QzZDQ3N2EsIDB4NjQ2NGFjYzgsIDB4NWQ1ZGU3YmEsIDB4MTkxOTJiMzIsIDB4NzM3Mzk1ZTYsIDB4NjA2MGEwYzAsIDB4ODE4MTk4MTksIDB4NGY0ZmQxOWUsIDB4ZGNkYzdmYTMsIDB4MjIyMjY2NDQsIDB4MmEyYTdlNTQsIDB4OTA5MGFiM2IsIDB4ODg4ODgzMGIsIDB4NDY0NmNhOGMsIDB4ZWVlZTI5YzcsIDB4YjhiOGQzNmIsIDB4MTQxNDNjMjgsIDB4ZGVkZTc5YTcsIDB4NWU1ZWUyYmMsIDB4MGIwYjFkMTYsIDB4ZGJkYjc2YWQsIDB4ZTBlMDNiZGIsIDB4MzIzMjU2NjQsIDB4M2EzYTRlNzQsIDB4MGEwYTFlMTQsIDB4NDk0OWRiOTIsIDB4MDYwNjBhMGMsIDB4MjQyNDZjNDgsIDB4NWM1Y2U0YjgsIDB4YzJjMjVkOWYsIDB4ZDNkMzZlYmQsIDB4YWNhY2VmNDMsIDB4NjI2MmE2YzQsIDB4OTE5MWE4MzksIDB4OTU5NWE0MzEsIDB4ZTRlNDM3ZDMsIDB4Nzk3OThiZjIsIDB4ZTdlNzMyZDUsIDB4YzhjODQzOGIsIDB4MzczNzU5NmUsIDB4NmQ2ZGI3ZGEsIDB4OGQ4ZDhjMDEsIDB4ZDVkNTY0YjEsIDB4NGU0ZWQyOWMsIDB4YTlhOWUwNDksIDB4NmM2Y2I0ZDgsIDB4NTY1NmZhYWMsIDB4ZjRmNDA3ZjMsIDB4ZWFlYTI1Y2YsIDB4NjU2NWFmY2EsIDB4N2E3YThlZjQsIDB4YWVhZWU5NDcsIDB4MDgwODE4MTAsIDB4YmFiYWQ1NmYsIDB4Nzg3ODg4ZjAsIDB4MjUyNTZmNGEsIDB4MmUyZTcyNWMsIDB4MWMxYzI0MzgsIDB4YTZhNmYxNTcsIDB4YjRiNGM3NzMsIDB4YzZjNjUxOTcsIDB4ZThlODIzY2IsIDB4ZGRkZDdjYTEsIDB4NzQ3NDljZTgsIDB4MWYxZjIxM2UsIDB4NGI0YmRkOTYsIDB4YmRiZGRjNjEsIDB4OGI4Yjg2MGQsIDB4OGE4YTg1MGYsIDB4NzA3MDkwZTAsIDB4M2UzZTQyN2MsIDB4YjViNWM0NzEsIDB4NjY2NmFhY2MsIDB4NDg0OGQ4OTAsIDB4MDMwMzA1MDYsIDB4ZjZmNjAxZjcsIDB4MGUwZTEyMWMsIDB4NjE2MWEzYzIsIDB4MzUzNTVmNmEsIDB4NTc1N2Y5YWUsIDB4YjliOWQwNjksIDB4ODY4NjkxMTcsIDB4YzFjMTU4OTksIDB4MWQxZDI3M2EsIDB4OWU5ZWI5MjcsIDB4ZTFlMTM4ZDksIDB4ZjhmODEzZWIsIDB4OTg5OGIzMmIsIDB4MTExMTMzMjIsIDB4Njk2OWJiZDIsIDB4ZDlkOTcwYTksIDB4OGU4ZTg5MDcsIDB4OTQ5NGE3MzMsIDB4OWI5YmI2MmQsIDB4MWUxZTIyM2MsIDB4ODc4NzkyMTUsIDB4ZTllOTIwYzksIDB4Y2VjZTQ5ODcsIDB4NTU1NWZmYWEsIDB4MjgyODc4NTAsIDB4ZGZkZjdhYTUsIDB4OGM4YzhmMDMsIDB4YTFhMWY4NTksIDB4ODk4OTgwMDksIDB4MGQwZDE3MWEsIDB4YmZiZmRhNjUsIDB4ZTZlNjMxZDcsIDB4NDI0MmM2ODQsIDB4Njg2OGI4ZDAsIDB4NDE0MWMzODIsIDB4OTk5OWIwMjksIDB4MmQyZDc3NWEsIDB4MGYwZjExMWUsIDB4YjBiMGNiN2IsIDB4NTQ1NGZjYTgsIDB4YmJiYmQ2NmQsIDB4MTYxNjNhMmNdO1xuXG4gICAgLy8gVHJhbnNmb3JtYXRpb25zIGZvciBkZWNyeXB0aW9uXG4gICAgdmFyIFQ1ID0gWzB4NTFmNGE3NTAsIDB4N2U0MTY1NTMsIDB4MWExN2E0YzMsIDB4M2EyNzVlOTYsIDB4M2JhYjZiY2IsIDB4MWY5ZDQ1ZjEsIDB4YWNmYTU4YWIsIDB4NGJlMzAzOTMsIDB4MjAzMGZhNTUsIDB4YWQ3NjZkZjYsIDB4ODhjYzc2OTEsIDB4ZjUwMjRjMjUsIDB4NGZlNWQ3ZmMsIDB4YzUyYWNiZDcsIDB4MjYzNTQ0ODAsIDB4YjU2MmEzOGYsIDB4ZGViMTVhNDksIDB4MjViYTFiNjcsIDB4NDVlYTBlOTgsIDB4NWRmZWMwZTEsIDB4YzMyZjc1MDIsIDB4ODE0Y2YwMTIsIDB4OGQ0Njk3YTMsIDB4NmJkM2Y5YzYsIDB4MDM4ZjVmZTcsIDB4MTU5MjljOTUsIDB4YmY2ZDdhZWIsIDB4OTU1MjU5ZGEsIDB4ZDRiZTgzMmQsIDB4NTg3NDIxZDMsIDB4NDllMDY5MjksIDB4OGVjOWM4NDQsIDB4NzVjMjg5NmEsIDB4ZjQ4ZTc5NzgsIDB4OTk1ODNlNmIsIDB4MjdiOTcxZGQsIDB4YmVlMTRmYjYsIDB4ZjA4OGFkMTcsIDB4YzkyMGFjNjYsIDB4N2RjZTNhYjQsIDB4NjNkZjRhMTgsIDB4ZTUxYTMxODIsIDB4OTc1MTMzNjAsIDB4NjI1MzdmNDUsIDB4YjE2NDc3ZTAsIDB4YmI2YmFlODQsIDB4ZmU4MWEwMWMsIDB4ZjkwODJiOTQsIDB4NzA0ODY4NTgsIDB4OGY0NWZkMTksIDB4OTRkZTZjODcsIDB4NTI3YmY4YjcsIDB4YWI3M2QzMjMsIDB4NzI0YjAyZTIsIDB4ZTMxZjhmNTcsIDB4NjY1NWFiMmEsIDB4YjJlYjI4MDcsIDB4MmZiNWMyMDMsIDB4ODZjNTdiOWEsIDB4ZDMzNzA4YTUsIDB4MzAyODg3ZjIsIDB4MjNiZmE1YjIsIDB4MDIwMzZhYmEsIDB4ZWQxNjgyNWMsIDB4OGFjZjFjMmIsIDB4YTc3OWI0OTIsIDB4ZjMwN2YyZjAsIDB4NGU2OWUyYTEsIDB4NjVkYWY0Y2QsIDB4MDYwNWJlZDUsIDB4ZDEzNDYyMWYsIDB4YzRhNmZlOGEsIDB4MzQyZTUzOWQsIDB4YTJmMzU1YTAsIDB4MDU4YWUxMzIsIDB4YTRmNmViNzUsIDB4MGI4M2VjMzksIDB4NDA2MGVmYWEsIDB4NWU3MTlmMDYsIDB4YmQ2ZTEwNTEsIDB4M2UyMThhZjksIDB4OTZkZDA2M2QsIDB4ZGQzZTA1YWUsIDB4NGRlNmJkNDYsIDB4OTE1NDhkYjUsIDB4NzFjNDVkMDUsIDB4MDQwNmQ0NmYsIDB4NjA1MDE1ZmYsIDB4MTk5OGZiMjQsIDB4ZDZiZGU5OTcsIDB4ODk0MDQzY2MsIDB4NjdkOTllNzcsIDB4YjBlODQyYmQsIDB4MDc4OThiODgsIDB4ZTcxOTViMzgsIDB4NzljOGVlZGIsIDB4YTE3YzBhNDcsIDB4N2M0MjBmZTksIDB4Zjg4NDFlYzksIDB4MDAwMDAwMDAsIDB4MDk4MDg2ODMsIDB4MzIyYmVkNDgsIDB4MWUxMTcwYWMsIDB4NmM1YTcyNGUsIDB4ZmQwZWZmZmIsIDB4MGY4NTM4NTYsIDB4M2RhZWQ1MWUsIDB4MzYyZDM5MjcsIDB4MGEwZmQ5NjQsIDB4Njg1Y2E2MjEsIDB4OWI1YjU0ZDEsIDB4MjQzNjJlM2EsIDB4MGMwYTY3YjEsIDB4OTM1N2U3MGYsIDB4YjRlZTk2ZDIsIDB4MWI5YjkxOWUsIDB4ODBjMGM1NGYsIDB4NjFkYzIwYTIsIDB4NWE3NzRiNjksIDB4MWMxMjFhMTYsIDB4ZTI5M2JhMGEsIDB4YzBhMDJhZTUsIDB4M2MyMmUwNDMsIDB4MTIxYjE3MWQsIDB4MGUwOTBkMGIsIDB4ZjI4YmM3YWQsIDB4MmRiNmE4YjksIDB4MTQxZWE5YzgsIDB4NTdmMTE5ODUsIDB4YWY3NTA3NGMsIDB4ZWU5OWRkYmIsIDB4YTM3ZjYwZmQsIDB4ZjcwMTI2OWYsIDB4NWM3MmY1YmMsIDB4NDQ2NjNiYzUsIDB4NWJmYjdlMzQsIDB4OGI0MzI5NzYsIDB4Y2IyM2M2ZGMsIDB4YjZlZGZjNjgsIDB4YjhlNGYxNjMsIDB4ZDczMWRjY2EsIDB4NDI2Mzg1MTAsIDB4MTM5NzIyNDAsIDB4ODRjNjExMjAsIDB4ODU0YTI0N2QsIDB4ZDJiYjNkZjgsIDB4YWVmOTMyMTEsIDB4YzcyOWExNmQsIDB4MWQ5ZTJmNGIsIDB4ZGNiMjMwZjMsIDB4MGQ4NjUyZWMsIDB4NzdjMWUzZDAsIDB4MmJiMzE2NmMsIDB4YTk3MGI5OTksIDB4MTE5NDQ4ZmEsIDB4NDdlOTY0MjIsIDB4YThmYzhjYzQsIDB4YTBmMDNmMWEsIDB4NTY3ZDJjZDgsIDB4MjIzMzkwZWYsIDB4ODc0OTRlYzcsIDB4ZDkzOGQxYzEsIDB4OGNjYWEyZmUsIDB4OThkNDBiMzYsIDB4YTZmNTgxY2YsIDB4YTU3YWRlMjgsIDB4ZGFiNzhlMjYsIDB4M2ZhZGJmYTQsIDB4MmMzYTlkZTQsIDB4NTA3ODkyMGQsIDB4NmE1ZmNjOWIsIDB4NTQ3ZTQ2NjIsIDB4ZjY4ZDEzYzIsIDB4OTBkOGI4ZTgsIDB4MmUzOWY3NWUsIDB4ODJjM2FmZjUsIDB4OWY1ZDgwYmUsIDB4NjlkMDkzN2MsIDB4NmZkNTJkYTksIDB4Y2YyNTEyYjMsIDB4YzhhYzk5M2IsIDB4MTAxODdkYTcsIDB4ZTg5YzYzNmUsIDB4ZGIzYmJiN2IsIDB4Y2QyNjc4MDksIDB4NmU1OTE4ZjQsIDB4ZWM5YWI3MDEsIDB4ODM0ZjlhYTgsIDB4ZTY5NTZlNjUsIDB4YWFmZmU2N2UsIDB4MjFiY2NmMDgsIDB4ZWYxNWU4ZTYsIDB4YmFlNzliZDksIDB4NGE2ZjM2Y2UsIDB4ZWE5ZjA5ZDQsIDB4MjliMDdjZDYsIDB4MzFhNGIyYWYsIDB4MmEzZjIzMzEsIDB4YzZhNTk0MzAsIDB4MzVhMjY2YzAsIDB4NzQ0ZWJjMzcsIDB4ZmM4MmNhYTYsIDB4ZTA5MGQwYjAsIDB4MzNhN2Q4MTUsIDB4ZjEwNDk4NGEsIDB4NDFlY2RhZjcsIDB4N2ZjZDUwMGUsIDB4MTc5MWY2MmYsIDB4NzY0ZGQ2OGQsIDB4NDNlZmIwNGQsIDB4Y2NhYTRkNTQsIDB4ZTQ5NjA0ZGYsIDB4OWVkMWI1ZTMsIDB4NGM2YTg4MWIsIDB4YzEyYzFmYjgsIDB4NDY2NTUxN2YsIDB4OWQ1ZWVhMDQsIDB4MDE4YzM1NWQsIDB4ZmE4Nzc0NzMsIDB4ZmIwYjQxMmUsIDB4YjM2NzFkNWEsIDB4OTJkYmQyNTIsIDB4ZTkxMDU2MzMsIDB4NmRkNjQ3MTMsIDB4OWFkNzYxOGMsIDB4MzdhMTBjN2EsIDB4NTlmODE0OGUsIDB4ZWIxMzNjODksIDB4Y2VhOTI3ZWUsIDB4Yjc2MWM5MzUsIDB4ZTExY2U1ZWQsIDB4N2E0N2IxM2MsIDB4OWNkMmRmNTksIDB4NTVmMjczM2YsIDB4MTgxNGNlNzksIDB4NzNjNzM3YmYsIDB4NTNmN2NkZWEsIDB4NWZmZGFhNWIsIDB4ZGYzZDZmMTQsIDB4Nzg0NGRiODYsIDB4Y2FhZmYzODEsIDB4Yjk2OGM0M2UsIDB4MzgyNDM0MmMsIDB4YzJhMzQwNWYsIDB4MTYxZGMzNzIsIDB4YmNlMjI1MGMsIDB4MjgzYzQ5OGIsIDB4ZmYwZDk1NDEsIDB4MzlhODAxNzEsIDB4MDgwY2IzZGUsIDB4ZDhiNGU0OWMsIDB4NjQ1NmMxOTAsIDB4N2JjYjg0NjEsIDB4ZDUzMmI2NzAsIDB4NDg2YzVjNzQsIDB4ZDBiODU3NDJdO1xuICAgIHZhciBUNiA9IFsweDUwNTFmNGE3LCAweDUzN2U0MTY1LCAweGMzMWExN2E0LCAweDk2M2EyNzVlLCAweGNiM2JhYjZiLCAweGYxMWY5ZDQ1LCAweGFiYWNmYTU4LCAweDkzNGJlMzAzLCAweDU1MjAzMGZhLCAweGY2YWQ3NjZkLCAweDkxODhjYzc2LCAweDI1ZjUwMjRjLCAweGZjNGZlNWQ3LCAweGQ3YzUyYWNiLCAweDgwMjYzNTQ0LCAweDhmYjU2MmEzLCAweDQ5ZGViMTVhLCAweDY3MjViYTFiLCAweDk4NDVlYTBlLCAweGUxNWRmZWMwLCAweDAyYzMyZjc1LCAweDEyODE0Y2YwLCAweGEzOGQ0Njk3LCAweGM2NmJkM2Y5LCAweGU3MDM4ZjVmLCAweDk1MTU5MjljLCAweGViYmY2ZDdhLCAweGRhOTU1MjU5LCAweDJkZDRiZTgzLCAweGQzNTg3NDIxLCAweDI5NDllMDY5LCAweDQ0OGVjOWM4LCAweDZhNzVjMjg5LCAweDc4ZjQ4ZTc5LCAweDZiOTk1ODNlLCAweGRkMjdiOTcxLCAweGI2YmVlMTRmLCAweDE3ZjA4OGFkLCAweDY2YzkyMGFjLCAweGI0N2RjZTNhLCAweDE4NjNkZjRhLCAweDgyZTUxYTMxLCAweDYwOTc1MTMzLCAweDQ1NjI1MzdmLCAweGUwYjE2NDc3LCAweDg0YmI2YmFlLCAweDFjZmU4MWEwLCAweDk0ZjkwODJiLCAweDU4NzA0ODY4LCAweDE5OGY0NWZkLCAweDg3OTRkZTZjLCAweGI3NTI3YmY4LCAweDIzYWI3M2QzLCAweGUyNzI0YjAyLCAweDU3ZTMxZjhmLCAweDJhNjY1NWFiLCAweDA3YjJlYjI4LCAweDAzMmZiNWMyLCAweDlhODZjNTdiLCAweGE1ZDMzNzA4LCAweGYyMzAyODg3LCAweGIyMjNiZmE1LCAweGJhMDIwMzZhLCAweDVjZWQxNjgyLCAweDJiOGFjZjFjLCAweDkyYTc3OWI0LCAweGYwZjMwN2YyLCAweGExNGU2OWUyLCAweGNkNjVkYWY0LCAweGQ1MDYwNWJlLCAweDFmZDEzNDYyLCAweDhhYzRhNmZlLCAweDlkMzQyZTUzLCAweGEwYTJmMzU1LCAweDMyMDU4YWUxLCAweDc1YTRmNmViLCAweDM5MGI4M2VjLCAweGFhNDA2MGVmLCAweDA2NWU3MTlmLCAweDUxYmQ2ZTEwLCAweGY5M2UyMThhLCAweDNkOTZkZDA2LCAweGFlZGQzZTA1LCAweDQ2NGRlNmJkLCAweGI1OTE1NDhkLCAweDA1NzFjNDVkLCAweDZmMDQwNmQ0LCAweGZmNjA1MDE1LCAweDI0MTk5OGZiLCAweDk3ZDZiZGU5LCAweGNjODk0MDQzLCAweDc3NjdkOTllLCAweGJkYjBlODQyLCAweDg4MDc4OThiLCAweDM4ZTcxOTViLCAweGRiNzljOGVlLCAweDQ3YTE3YzBhLCAweGU5N2M0MjBmLCAweGM5Zjg4NDFlLCAweDAwMDAwMDAwLCAweDgzMDk4MDg2LCAweDQ4MzIyYmVkLCAweGFjMWUxMTcwLCAweDRlNmM1YTcyLCAweGZiZmQwZWZmLCAweDU2MGY4NTM4LCAweDFlM2RhZWQ1LCAweDI3MzYyZDM5LCAweDY0MGEwZmQ5LCAweDIxNjg1Y2E2LCAweGQxOWI1YjU0LCAweDNhMjQzNjJlLCAweGIxMGMwYTY3LCAweDBmOTM1N2U3LCAweGQyYjRlZTk2LCAweDllMWI5YjkxLCAweDRmODBjMGM1LCAweGEyNjFkYzIwLCAweDY5NWE3NzRiLCAweDE2MWMxMjFhLCAweDBhZTI5M2JhLCAweGU1YzBhMDJhLCAweDQzM2MyMmUwLCAweDFkMTIxYjE3LCAweDBiMGUwOTBkLCAweGFkZjI4YmM3LCAweGI5MmRiNmE4LCAweGM4MTQxZWE5LCAweDg1NTdmMTE5LCAweDRjYWY3NTA3LCAweGJiZWU5OWRkLCAweGZkYTM3ZjYwLCAweDlmZjcwMTI2LCAweGJjNWM3MmY1LCAweGM1NDQ2NjNiLCAweDM0NWJmYjdlLCAweDc2OGI0MzI5LCAweGRjY2IyM2M2LCAweDY4YjZlZGZjLCAweDYzYjhlNGYxLCAweGNhZDczMWRjLCAweDEwNDI2Mzg1LCAweDQwMTM5NzIyLCAweDIwODRjNjExLCAweDdkODU0YTI0LCAweGY4ZDJiYjNkLCAweDExYWVmOTMyLCAweDZkYzcyOWExLCAweDRiMWQ5ZTJmLCAweGYzZGNiMjMwLCAweGVjMGQ4NjUyLCAweGQwNzdjMWUzLCAweDZjMmJiMzE2LCAweDk5YTk3MGI5LCAweGZhMTE5NDQ4LCAweDIyNDdlOTY0LCAweGM0YThmYzhjLCAweDFhYTBmMDNmLCAweGQ4NTY3ZDJjLCAweGVmMjIzMzkwLCAweGM3ODc0OTRlLCAweGMxZDkzOGQxLCAweGZlOGNjYWEyLCAweDM2OThkNDBiLCAweGNmYTZmNTgxLCAweDI4YTU3YWRlLCAweDI2ZGFiNzhlLCAweGE0M2ZhZGJmLCAweGU0MmMzYTlkLCAweDBkNTA3ODkyLCAweDliNmE1ZmNjLCAweDYyNTQ3ZTQ2LCAweGMyZjY4ZDEzLCAweGU4OTBkOGI4LCAweDVlMmUzOWY3LCAweGY1ODJjM2FmLCAweGJlOWY1ZDgwLCAweDdjNjlkMDkzLCAweGE5NmZkNTJkLCAweGIzY2YyNTEyLCAweDNiYzhhYzk5LCAweGE3MTAxODdkLCAweDZlZTg5YzYzLCAweDdiZGIzYmJiLCAweDA5Y2QyNjc4LCAweGY0NmU1OTE4LCAweDAxZWM5YWI3LCAweGE4ODM0ZjlhLCAweDY1ZTY5NTZlLCAweDdlYWFmZmU2LCAweDA4MjFiY2NmLCAweGU2ZWYxNWU4LCAweGQ5YmFlNzliLCAweGNlNGE2ZjM2LCAweGQ0ZWE5ZjA5LCAweGQ2MjliMDdjLCAweGFmMzFhNGIyLCAweDMxMmEzZjIzLCAweDMwYzZhNTk0LCAweGMwMzVhMjY2LCAweDM3NzQ0ZWJjLCAweGE2ZmM4MmNhLCAweGIwZTA5MGQwLCAweDE1MzNhN2Q4LCAweDRhZjEwNDk4LCAweGY3NDFlY2RhLCAweDBlN2ZjZDUwLCAweDJmMTc5MWY2LCAweDhkNzY0ZGQ2LCAweDRkNDNlZmIwLCAweDU0Y2NhYTRkLCAweGRmZTQ5NjA0LCAweGUzOWVkMWI1LCAweDFiNGM2YTg4LCAweGI4YzEyYzFmLCAweDdmNDY2NTUxLCAweDA0OWQ1ZWVhLCAweDVkMDE4YzM1LCAweDczZmE4Nzc0LCAweDJlZmIwYjQxLCAweDVhYjM2NzFkLCAweDUyOTJkYmQyLCAweDMzZTkxMDU2LCAweDEzNmRkNjQ3LCAweDhjOWFkNzYxLCAweDdhMzdhMTBjLCAweDhlNTlmODE0LCAweDg5ZWIxMzNjLCAweGVlY2VhOTI3LCAweDM1Yjc2MWM5LCAweGVkZTExY2U1LCAweDNjN2E0N2IxLCAweDU5OWNkMmRmLCAweDNmNTVmMjczLCAweDc5MTgxNGNlLCAweGJmNzNjNzM3LCAweGVhNTNmN2NkLCAweDViNWZmZGFhLCAweDE0ZGYzZDZmLCAweDg2Nzg0NGRiLCAweDgxY2FhZmYzLCAweDNlYjk2OGM0LCAweDJjMzgyNDM0LCAweDVmYzJhMzQwLCAweDcyMTYxZGMzLCAweDBjYmNlMjI1LCAweDhiMjgzYzQ5LCAweDQxZmYwZDk1LCAweDcxMzlhODAxLCAweGRlMDgwY2IzLCAweDljZDhiNGU0LCAweDkwNjQ1NmMxLCAweDYxN2JjYjg0LCAweDcwZDUzMmI2LCAweDc0NDg2YzVjLCAweDQyZDBiODU3XTtcbiAgICB2YXIgVDcgPSBbMHhhNzUwNTFmNCwgMHg2NTUzN2U0MSwgMHhhNGMzMWExNywgMHg1ZTk2M2EyNywgMHg2YmNiM2JhYiwgMHg0NWYxMWY5ZCwgMHg1OGFiYWNmYSwgMHgwMzkzNGJlMywgMHhmYTU1MjAzMCwgMHg2ZGY2YWQ3NiwgMHg3NjkxODhjYywgMHg0YzI1ZjUwMiwgMHhkN2ZjNGZlNSwgMHhjYmQ3YzUyYSwgMHg0NDgwMjYzNSwgMHhhMzhmYjU2MiwgMHg1YTQ5ZGViMSwgMHgxYjY3MjViYSwgMHgwZTk4NDVlYSwgMHhjMGUxNWRmZSwgMHg3NTAyYzMyZiwgMHhmMDEyODE0YywgMHg5N2EzOGQ0NiwgMHhmOWM2NmJkMywgMHg1ZmU3MDM4ZiwgMHg5Yzk1MTU5MiwgMHg3YWViYmY2ZCwgMHg1OWRhOTU1MiwgMHg4MzJkZDRiZSwgMHgyMWQzNTg3NCwgMHg2OTI5NDllMCwgMHhjODQ0OGVjOSwgMHg4OTZhNzVjMiwgMHg3OTc4ZjQ4ZSwgMHgzZTZiOTk1OCwgMHg3MWRkMjdiOSwgMHg0ZmI2YmVlMSwgMHhhZDE3ZjA4OCwgMHhhYzY2YzkyMCwgMHgzYWI0N2RjZSwgMHg0YTE4NjNkZiwgMHgzMTgyZTUxYSwgMHgzMzYwOTc1MSwgMHg3ZjQ1NjI1MywgMHg3N2UwYjE2NCwgMHhhZTg0YmI2YiwgMHhhMDFjZmU4MSwgMHgyYjk0ZjkwOCwgMHg2ODU4NzA0OCwgMHhmZDE5OGY0NSwgMHg2Yzg3OTRkZSwgMHhmOGI3NTI3YiwgMHhkMzIzYWI3MywgMHgwMmUyNzI0YiwgMHg4ZjU3ZTMxZiwgMHhhYjJhNjY1NSwgMHgyODA3YjJlYiwgMHhjMjAzMmZiNSwgMHg3YjlhODZjNSwgMHgwOGE1ZDMzNywgMHg4N2YyMzAyOCwgMHhhNWIyMjNiZiwgMHg2YWJhMDIwMywgMHg4MjVjZWQxNiwgMHgxYzJiOGFjZiwgMHhiNDkyYTc3OSwgMHhmMmYwZjMwNywgMHhlMmExNGU2OSwgMHhmNGNkNjVkYSwgMHhiZWQ1MDYwNSwgMHg2MjFmZDEzNCwgMHhmZThhYzRhNiwgMHg1MzlkMzQyZSwgMHg1NWEwYTJmMywgMHhlMTMyMDU4YSwgMHhlYjc1YTRmNiwgMHhlYzM5MGI4MywgMHhlZmFhNDA2MCwgMHg5ZjA2NWU3MSwgMHgxMDUxYmQ2ZSwgMHg4YWY5M2UyMSwgMHgwNjNkOTZkZCwgMHgwNWFlZGQzZSwgMHhiZDQ2NGRlNiwgMHg4ZGI1OTE1NCwgMHg1ZDA1NzFjNCwgMHhkNDZmMDQwNiwgMHgxNWZmNjA1MCwgMHhmYjI0MTk5OCwgMHhlOTk3ZDZiZCwgMHg0M2NjODk0MCwgMHg5ZTc3NjdkOSwgMHg0MmJkYjBlOCwgMHg4Yjg4MDc4OSwgMHg1YjM4ZTcxOSwgMHhlZWRiNzljOCwgMHgwYTQ3YTE3YywgMHgwZmU5N2M0MiwgMHgxZWM5Zjg4NCwgMHgwMDAwMDAwMCwgMHg4NjgzMDk4MCwgMHhlZDQ4MzIyYiwgMHg3MGFjMWUxMSwgMHg3MjRlNmM1YSwgMHhmZmZiZmQwZSwgMHgzODU2MGY4NSwgMHhkNTFlM2RhZSwgMHgzOTI3MzYyZCwgMHhkOTY0MGEwZiwgMHhhNjIxNjg1YywgMHg1NGQxOWI1YiwgMHgyZTNhMjQzNiwgMHg2N2IxMGMwYSwgMHhlNzBmOTM1NywgMHg5NmQyYjRlZSwgMHg5MTllMWI5YiwgMHhjNTRmODBjMCwgMHgyMGEyNjFkYywgMHg0YjY5NWE3NywgMHgxYTE2MWMxMiwgMHhiYTBhZTI5MywgMHgyYWU1YzBhMCwgMHhlMDQzM2MyMiwgMHgxNzFkMTIxYiwgMHgwZDBiMGUwOSwgMHhjN2FkZjI4YiwgMHhhOGI5MmRiNiwgMHhhOWM4MTQxZSwgMHgxOTg1NTdmMSwgMHgwNzRjYWY3NSwgMHhkZGJiZWU5OSwgMHg2MGZkYTM3ZiwgMHgyNjlmZjcwMSwgMHhmNWJjNWM3MiwgMHgzYmM1NDQ2NiwgMHg3ZTM0NWJmYiwgMHgyOTc2OGI0MywgMHhjNmRjY2IyMywgMHhmYzY4YjZlZCwgMHhmMTYzYjhlNCwgMHhkY2NhZDczMSwgMHg4NTEwNDI2MywgMHgyMjQwMTM5NywgMHgxMTIwODRjNiwgMHgyNDdkODU0YSwgMHgzZGY4ZDJiYiwgMHgzMjExYWVmOSwgMHhhMTZkYzcyOSwgMHgyZjRiMWQ5ZSwgMHgzMGYzZGNiMiwgMHg1MmVjMGQ4NiwgMHhlM2QwNzdjMSwgMHgxNjZjMmJiMywgMHhiOTk5YTk3MCwgMHg0OGZhMTE5NCwgMHg2NDIyNDdlOSwgMHg4Y2M0YThmYywgMHgzZjFhYTBmMCwgMHgyY2Q4NTY3ZCwgMHg5MGVmMjIzMywgMHg0ZWM3ODc0OSwgMHhkMWMxZDkzOCwgMHhhMmZlOGNjYSwgMHgwYjM2OThkNCwgMHg4MWNmYTZmNSwgMHhkZTI4YTU3YSwgMHg4ZTI2ZGFiNywgMHhiZmE0M2ZhZCwgMHg5ZGU0MmMzYSwgMHg5MjBkNTA3OCwgMHhjYzliNmE1ZiwgMHg0NjYyNTQ3ZSwgMHgxM2MyZjY4ZCwgMHhiOGU4OTBkOCwgMHhmNzVlMmUzOSwgMHhhZmY1ODJjMywgMHg4MGJlOWY1ZCwgMHg5MzdjNjlkMCwgMHgyZGE5NmZkNSwgMHgxMmIzY2YyNSwgMHg5OTNiYzhhYywgMHg3ZGE3MTAxOCwgMHg2MzZlZTg5YywgMHhiYjdiZGIzYiwgMHg3ODA5Y2QyNiwgMHgxOGY0NmU1OSwgMHhiNzAxZWM5YSwgMHg5YWE4ODM0ZiwgMHg2ZTY1ZTY5NSwgMHhlNjdlYWFmZiwgMHhjZjA4MjFiYywgMHhlOGU2ZWYxNSwgMHg5YmQ5YmFlNywgMHgzNmNlNGE2ZiwgMHgwOWQ0ZWE5ZiwgMHg3Y2Q2MjliMCwgMHhiMmFmMzFhNCwgMHgyMzMxMmEzZiwgMHg5NDMwYzZhNSwgMHg2NmMwMzVhMiwgMHhiYzM3NzQ0ZSwgMHhjYWE2ZmM4MiwgMHhkMGIwZTA5MCwgMHhkODE1MzNhNywgMHg5ODRhZjEwNCwgMHhkYWY3NDFlYywgMHg1MDBlN2ZjZCwgMHhmNjJmMTc5MSwgMHhkNjhkNzY0ZCwgMHhiMDRkNDNlZiwgMHg0ZDU0Y2NhYSwgMHgwNGRmZTQ5NiwgMHhiNWUzOWVkMSwgMHg4ODFiNGM2YSwgMHgxZmI4YzEyYywgMHg1MTdmNDY2NSwgMHhlYTA0OWQ1ZSwgMHgzNTVkMDE4YywgMHg3NDczZmE4NywgMHg0MTJlZmIwYiwgMHgxZDVhYjM2NywgMHhkMjUyOTJkYiwgMHg1NjMzZTkxMCwgMHg0NzEzNmRkNiwgMHg2MThjOWFkNywgMHgwYzdhMzdhMSwgMHgxNDhlNTlmOCwgMHgzYzg5ZWIxMywgMHgyN2VlY2VhOSwgMHhjOTM1Yjc2MSwgMHhlNWVkZTExYywgMHhiMTNjN2E0NywgMHhkZjU5OWNkMiwgMHg3MzNmNTVmMiwgMHhjZTc5MTgxNCwgMHgzN2JmNzNjNywgMHhjZGVhNTNmNywgMHhhYTViNWZmZCwgMHg2ZjE0ZGYzZCwgMHhkYjg2Nzg0NCwgMHhmMzgxY2FhZiwgMHhjNDNlYjk2OCwgMHgzNDJjMzgyNCwgMHg0MDVmYzJhMywgMHhjMzcyMTYxZCwgMHgyNTBjYmNlMiwgMHg0OThiMjgzYywgMHg5NTQxZmYwZCwgMHgwMTcxMzlhOCwgMHhiM2RlMDgwYywgMHhlNDljZDhiNCwgMHhjMTkwNjQ1NiwgMHg4NDYxN2JjYiwgMHhiNjcwZDUzMiwgMHg1Yzc0NDg2YywgMHg1NzQyZDBiOF07XG4gICAgdmFyIFQ4ID0gWzB4ZjRhNzUwNTEsIDB4NDE2NTUzN2UsIDB4MTdhNGMzMWEsIDB4Mjc1ZTk2M2EsIDB4YWI2YmNiM2IsIDB4OWQ0NWYxMWYsIDB4ZmE1OGFiYWMsIDB4ZTMwMzkzNGIsIDB4MzBmYTU1MjAsIDB4NzY2ZGY2YWQsIDB4Y2M3NjkxODgsIDB4MDI0YzI1ZjUsIDB4ZTVkN2ZjNGYsIDB4MmFjYmQ3YzUsIDB4MzU0NDgwMjYsIDB4NjJhMzhmYjUsIDB4YjE1YTQ5ZGUsIDB4YmExYjY3MjUsIDB4ZWEwZTk4NDUsIDB4ZmVjMGUxNWQsIDB4MmY3NTAyYzMsIDB4NGNmMDEyODEsIDB4NDY5N2EzOGQsIDB4ZDNmOWM2NmIsIDB4OGY1ZmU3MDMsIDB4OTI5Yzk1MTUsIDB4NmQ3YWViYmYsIDB4NTI1OWRhOTUsIDB4YmU4MzJkZDQsIDB4NzQyMWQzNTgsIDB4ZTA2OTI5NDksIDB4YzljODQ0OGUsIDB4YzI4OTZhNzUsIDB4OGU3OTc4ZjQsIDB4NTgzZTZiOTksIDB4Yjk3MWRkMjcsIDB4ZTE0ZmI2YmUsIDB4ODhhZDE3ZjAsIDB4MjBhYzY2YzksIDB4Y2UzYWI0N2QsIDB4ZGY0YTE4NjMsIDB4MWEzMTgyZTUsIDB4NTEzMzYwOTcsIDB4NTM3ZjQ1NjIsIDB4NjQ3N2UwYjEsIDB4NmJhZTg0YmIsIDB4ODFhMDFjZmUsIDB4MDgyYjk0ZjksIDB4NDg2ODU4NzAsIDB4NDVmZDE5OGYsIDB4ZGU2Yzg3OTQsIDB4N2JmOGI3NTIsIDB4NzNkMzIzYWIsIDB4NGIwMmUyNzIsIDB4MWY4ZjU3ZTMsIDB4NTVhYjJhNjYsIDB4ZWIyODA3YjIsIDB4YjVjMjAzMmYsIDB4YzU3YjlhODYsIDB4MzcwOGE1ZDMsIDB4Mjg4N2YyMzAsIDB4YmZhNWIyMjMsIDB4MDM2YWJhMDIsIDB4MTY4MjVjZWQsIDB4Y2YxYzJiOGEsIDB4NzliNDkyYTcsIDB4MDdmMmYwZjMsIDB4NjllMmExNGUsIDB4ZGFmNGNkNjUsIDB4MDViZWQ1MDYsIDB4MzQ2MjFmZDEsIDB4YTZmZThhYzQsIDB4MmU1MzlkMzQsIDB4ZjM1NWEwYTIsIDB4OGFlMTMyMDUsIDB4ZjZlYjc1YTQsIDB4ODNlYzM5MGIsIDB4NjBlZmFhNDAsIDB4NzE5ZjA2NWUsIDB4NmUxMDUxYmQsIDB4MjE4YWY5M2UsIDB4ZGQwNjNkOTYsIDB4M2UwNWFlZGQsIDB4ZTZiZDQ2NGQsIDB4NTQ4ZGI1OTEsIDB4YzQ1ZDA1NzEsIDB4MDZkNDZmMDQsIDB4NTAxNWZmNjAsIDB4OThmYjI0MTksIDB4YmRlOTk3ZDYsIDB4NDA0M2NjODksIDB4ZDk5ZTc3NjcsIDB4ZTg0MmJkYjAsIDB4ODk4Yjg4MDcsIDB4MTk1YjM4ZTcsIDB4YzhlZWRiNzksIDB4N2MwYTQ3YTEsIDB4NDIwZmU5N2MsIDB4ODQxZWM5ZjgsIDB4MDAwMDAwMDAsIDB4ODA4NjgzMDksIDB4MmJlZDQ4MzIsIDB4MTE3MGFjMWUsIDB4NWE3MjRlNmMsIDB4MGVmZmZiZmQsIDB4ODUzODU2MGYsIDB4YWVkNTFlM2QsIDB4MmQzOTI3MzYsIDB4MGZkOTY0MGEsIDB4NWNhNjIxNjgsIDB4NWI1NGQxOWIsIDB4MzYyZTNhMjQsIDB4MGE2N2IxMGMsIDB4NTdlNzBmOTMsIDB4ZWU5NmQyYjQsIDB4OWI5MTllMWIsIDB4YzBjNTRmODAsIDB4ZGMyMGEyNjEsIDB4Nzc0YjY5NWEsIDB4MTIxYTE2MWMsIDB4OTNiYTBhZTIsIDB4YTAyYWU1YzAsIDB4MjJlMDQzM2MsIDB4MWIxNzFkMTIsIDB4MDkwZDBiMGUsIDB4OGJjN2FkZjIsIDB4YjZhOGI5MmQsIDB4MWVhOWM4MTQsIDB4ZjExOTg1NTcsIDB4NzUwNzRjYWYsIDB4OTlkZGJiZWUsIDB4N2Y2MGZkYTMsIDB4MDEyNjlmZjcsIDB4NzJmNWJjNWMsIDB4NjYzYmM1NDQsIDB4ZmI3ZTM0NWIsIDB4NDMyOTc2OGIsIDB4MjNjNmRjY2IsIDB4ZWRmYzY4YjYsIDB4ZTRmMTYzYjgsIDB4MzFkY2NhZDcsIDB4NjM4NTEwNDIsIDB4OTcyMjQwMTMsIDB4YzYxMTIwODQsIDB4NGEyNDdkODUsIDB4YmIzZGY4ZDIsIDB4ZjkzMjExYWUsIDB4MjlhMTZkYzcsIDB4OWUyZjRiMWQsIDB4YjIzMGYzZGMsIDB4ODY1MmVjMGQsIDB4YzFlM2QwNzcsIDB4YjMxNjZjMmIsIDB4NzBiOTk5YTksIDB4OTQ0OGZhMTEsIDB4ZTk2NDIyNDcsIDB4ZmM4Y2M0YTgsIDB4ZjAzZjFhYTAsIDB4N2QyY2Q4NTYsIDB4MzM5MGVmMjIsIDB4NDk0ZWM3ODcsIDB4MzhkMWMxZDksIDB4Y2FhMmZlOGMsIDB4ZDQwYjM2OTgsIDB4ZjU4MWNmYTYsIDB4N2FkZTI4YTUsIDB4Yjc4ZTI2ZGEsIDB4YWRiZmE0M2YsIDB4M2E5ZGU0MmMsIDB4Nzg5MjBkNTAsIDB4NWZjYzliNmEsIDB4N2U0NjYyNTQsIDB4OGQxM2MyZjYsIDB4ZDhiOGU4OTAsIDB4MzlmNzVlMmUsIDB4YzNhZmY1ODIsIDB4NWQ4MGJlOWYsIDB4ZDA5MzdjNjksIDB4ZDUyZGE5NmYsIDB4MjUxMmIzY2YsIDB4YWM5OTNiYzgsIDB4MTg3ZGE3MTAsIDB4OWM2MzZlZTgsIDB4M2JiYjdiZGIsIDB4MjY3ODA5Y2QsIDB4NTkxOGY0NmUsIDB4OWFiNzAxZWMsIDB4NGY5YWE4ODMsIDB4OTU2ZTY1ZTYsIDB4ZmZlNjdlYWEsIDB4YmNjZjA4MjEsIDB4MTVlOGU2ZWYsIDB4ZTc5YmQ5YmEsIDB4NmYzNmNlNGEsIDB4OWYwOWQ0ZWEsIDB4YjA3Y2Q2MjksIDB4YTRiMmFmMzEsIDB4M2YyMzMxMmEsIDB4YTU5NDMwYzYsIDB4YTI2NmMwMzUsIDB4NGViYzM3NzQsIDB4ODJjYWE2ZmMsIDB4OTBkMGIwZTAsIDB4YTdkODE1MzMsIDB4MDQ5ODRhZjEsIDB4ZWNkYWY3NDEsIDB4Y2Q1MDBlN2YsIDB4OTFmNjJmMTcsIDB4NGRkNjhkNzYsIDB4ZWZiMDRkNDMsIDB4YWE0ZDU0Y2MsIDB4OTYwNGRmZTQsIDB4ZDFiNWUzOWUsIDB4NmE4ODFiNGMsIDB4MmMxZmI4YzEsIDB4NjU1MTdmNDYsIDB4NWVlYTA0OWQsIDB4OGMzNTVkMDEsIDB4ODc3NDczZmEsIDB4MGI0MTJlZmIsIDB4NjcxZDVhYjMsIDB4ZGJkMjUyOTIsIDB4MTA1NjMzZTksIDB4ZDY0NzEzNmQsIDB4ZDc2MThjOWEsIDB4YTEwYzdhMzcsIDB4ZjgxNDhlNTksIDB4MTMzYzg5ZWIsIDB4YTkyN2VlY2UsIDB4NjFjOTM1YjcsIDB4MWNlNWVkZTEsIDB4NDdiMTNjN2EsIDB4ZDJkZjU5OWMsIDB4ZjI3MzNmNTUsIDB4MTRjZTc5MTgsIDB4YzczN2JmNzMsIDB4ZjdjZGVhNTMsIDB4ZmRhYTViNWYsIDB4M2Q2ZjE0ZGYsIDB4NDRkYjg2NzgsIDB4YWZmMzgxY2EsIDB4NjhjNDNlYjksIDB4MjQzNDJjMzgsIDB4YTM0MDVmYzIsIDB4MWRjMzcyMTYsIDB4ZTIyNTBjYmMsIDB4M2M0OThiMjgsIDB4MGQ5NTQxZmYsIDB4YTgwMTcxMzksIDB4MGNiM2RlMDgsIDB4YjRlNDljZDgsIDB4NTZjMTkwNjQsIDB4Y2I4NDYxN2IsIDB4MzJiNjcwZDUsIDB4NmM1Yzc0NDgsIDB4Yjg1NzQyZDBdO1xuXG4gICAgLy8gVHJhbnNmb3JtYXRpb25zIGZvciBkZWNyeXB0aW9uIGtleSBleHBhbnNpb25cbiAgICB2YXIgVTEgPSBbMHgwMDAwMDAwMCwgMHgwZTA5MGQwYiwgMHgxYzEyMWExNiwgMHgxMjFiMTcxZCwgMHgzODI0MzQyYywgMHgzNjJkMzkyNywgMHgyNDM2MmUzYSwgMHgyYTNmMjMzMSwgMHg3MDQ4Njg1OCwgMHg3ZTQxNjU1MywgMHg2YzVhNzI0ZSwgMHg2MjUzN2Y0NSwgMHg0ODZjNWM3NCwgMHg0NjY1NTE3ZiwgMHg1NDdlNDY2MiwgMHg1YTc3NGI2OSwgMHhlMDkwZDBiMCwgMHhlZTk5ZGRiYiwgMHhmYzgyY2FhNiwgMHhmMjhiYzdhZCwgMHhkOGI0ZTQ5YywgMHhkNmJkZTk5NywgMHhjNGE2ZmU4YSwgMHhjYWFmZjM4MSwgMHg5MGQ4YjhlOCwgMHg5ZWQxYjVlMywgMHg4Y2NhYTJmZSwgMHg4MmMzYWZmNSwgMHhhOGZjOGNjNCwgMHhhNmY1ODFjZiwgMHhiNGVlOTZkMiwgMHhiYWU3OWJkOSwgMHhkYjNiYmI3YiwgMHhkNTMyYjY3MCwgMHhjNzI5YTE2ZCwgMHhjOTIwYWM2NiwgMHhlMzFmOGY1NywgMHhlZDE2ODI1YywgMHhmZjBkOTU0MSwgMHhmMTA0OTg0YSwgMHhhYjczZDMyMywgMHhhNTdhZGUyOCwgMHhiNzYxYzkzNSwgMHhiOTY4YzQzZSwgMHg5MzU3ZTcwZiwgMHg5ZDVlZWEwNCwgMHg4ZjQ1ZmQxOSwgMHg4MTRjZjAxMiwgMHgzYmFiNmJjYiwgMHgzNWEyNjZjMCwgMHgyN2I5NzFkZCwgMHgyOWIwN2NkNiwgMHgwMzhmNWZlNywgMHgwZDg2NTJlYywgMHgxZjlkNDVmMSwgMHgxMTk0NDhmYSwgMHg0YmUzMDM5MywgMHg0NWVhMGU5OCwgMHg1N2YxMTk4NSwgMHg1OWY4MTQ4ZSwgMHg3M2M3MzdiZiwgMHg3ZGNlM2FiNCwgMHg2ZmQ1MmRhOSwgMHg2MWRjMjBhMiwgMHhhZDc2NmRmNiwgMHhhMzdmNjBmZCwgMHhiMTY0NzdlMCwgMHhiZjZkN2FlYiwgMHg5NTUyNTlkYSwgMHg5YjViNTRkMSwgMHg4OTQwNDNjYywgMHg4NzQ5NGVjNywgMHhkZDNlMDVhZSwgMHhkMzM3MDhhNSwgMHhjMTJjMWZiOCwgMHhjZjI1MTJiMywgMHhlNTFhMzE4MiwgMHhlYjEzM2M4OSwgMHhmOTA4MmI5NCwgMHhmNzAxMjY5ZiwgMHg0ZGU2YmQ0NiwgMHg0M2VmYjA0ZCwgMHg1MWY0YTc1MCwgMHg1ZmZkYWE1YiwgMHg3NWMyODk2YSwgMHg3YmNiODQ2MSwgMHg2OWQwOTM3YywgMHg2N2Q5OWU3NywgMHgzZGFlZDUxZSwgMHgzM2E3ZDgxNSwgMHgyMWJjY2YwOCwgMHgyZmI1YzIwMywgMHgwNThhZTEzMiwgMHgwYjgzZWMzOSwgMHgxOTk4ZmIyNCwgMHgxNzkxZjYyZiwgMHg3NjRkZDY4ZCwgMHg3ODQ0ZGI4NiwgMHg2YTVmY2M5YiwgMHg2NDU2YzE5MCwgMHg0ZTY5ZTJhMSwgMHg0MDYwZWZhYSwgMHg1MjdiZjhiNywgMHg1YzcyZjViYywgMHgwNjA1YmVkNSwgMHgwODBjYjNkZSwgMHgxYTE3YTRjMywgMHgxNDFlYTljOCwgMHgzZTIxOGFmOSwgMHgzMDI4ODdmMiwgMHgyMjMzOTBlZiwgMHgyYzNhOWRlNCwgMHg5NmRkMDYzZCwgMHg5OGQ0MGIzNiwgMHg4YWNmMWMyYiwgMHg4NGM2MTEyMCwgMHhhZWY5MzIxMSwgMHhhMGYwM2YxYSwgMHhiMmViMjgwNywgMHhiY2UyMjUwYywgMHhlNjk1NmU2NSwgMHhlODljNjM2ZSwgMHhmYTg3NzQ3MywgMHhmNDhlNzk3OCwgMHhkZWIxNWE0OSwgMHhkMGI4NTc0MiwgMHhjMmEzNDA1ZiwgMHhjY2FhNGQ1NCwgMHg0MWVjZGFmNywgMHg0ZmU1ZDdmYywgMHg1ZGZlYzBlMSwgMHg1M2Y3Y2RlYSwgMHg3OWM4ZWVkYiwgMHg3N2MxZTNkMCwgMHg2NWRhZjRjZCwgMHg2YmQzZjljNiwgMHgzMWE0YjJhZiwgMHgzZmFkYmZhNCwgMHgyZGI2YThiOSwgMHgyM2JmYTViMiwgMHgwOTgwODY4MywgMHgwNzg5OGI4OCwgMHgxNTkyOWM5NSwgMHgxYjliOTE5ZSwgMHhhMTdjMGE0NywgMHhhZjc1MDc0YywgMHhiZDZlMTA1MSwgMHhiMzY3MWQ1YSwgMHg5OTU4M2U2YiwgMHg5NzUxMzM2MCwgMHg4NTRhMjQ3ZCwgMHg4YjQzMjk3NiwgMHhkMTM0NjIxZiwgMHhkZjNkNmYxNCwgMHhjZDI2NzgwOSwgMHhjMzJmNzUwMiwgMHhlOTEwNTYzMywgMHhlNzE5NWIzOCwgMHhmNTAyNGMyNSwgMHhmYjBiNDEyZSwgMHg5YWQ3NjE4YywgMHg5NGRlNmM4NywgMHg4NmM1N2I5YSwgMHg4OGNjNzY5MSwgMHhhMmYzNTVhMCwgMHhhY2ZhNThhYiwgMHhiZWUxNGZiNiwgMHhiMGU4NDJiZCwgMHhlYTlmMDlkNCwgMHhlNDk2MDRkZiwgMHhmNjhkMTNjMiwgMHhmODg0MWVjOSwgMHhkMmJiM2RmOCwgMHhkY2IyMzBmMywgMHhjZWE5MjdlZSwgMHhjMGEwMmFlNSwgMHg3YTQ3YjEzYywgMHg3NDRlYmMzNywgMHg2NjU1YWIyYSwgMHg2ODVjYTYyMSwgMHg0MjYzODUxMCwgMHg0YzZhODgxYiwgMHg1ZTcxOWYwNiwgMHg1MDc4OTIwZCwgMHgwYTBmZDk2NCwgMHgwNDA2ZDQ2ZiwgMHgxNjFkYzM3MiwgMHgxODE0Y2U3OSwgMHgzMjJiZWQ0OCwgMHgzYzIyZTA0MywgMHgyZTM5Zjc1ZSwgMHgyMDMwZmE1NSwgMHhlYzlhYjcwMSwgMHhlMjkzYmEwYSwgMHhmMDg4YWQxNywgMHhmZTgxYTAxYywgMHhkNGJlODMyZCwgMHhkYWI3OGUyNiwgMHhjOGFjOTkzYiwgMHhjNmE1OTQzMCwgMHg5Y2QyZGY1OSwgMHg5MmRiZDI1MiwgMHg4MGMwYzU0ZiwgMHg4ZWM5Yzg0NCwgMHhhNGY2ZWI3NSwgMHhhYWZmZTY3ZSwgMHhiOGU0ZjE2MywgMHhiNmVkZmM2OCwgMHgwYzBhNjdiMSwgMHgwMjAzNmFiYSwgMHgxMDE4N2RhNywgMHgxZTExNzBhYywgMHgzNDJlNTM5ZCwgMHgzYTI3NWU5NiwgMHgyODNjNDk4YiwgMHgyNjM1NDQ4MCwgMHg3YzQyMGZlOSwgMHg3MjRiMDJlMiwgMHg2MDUwMTVmZiwgMHg2ZTU5MThmNCwgMHg0NDY2M2JjNSwgMHg0YTZmMzZjZSwgMHg1ODc0MjFkMywgMHg1NjdkMmNkOCwgMHgzN2ExMGM3YSwgMHgzOWE4MDE3MSwgMHgyYmIzMTY2YywgMHgyNWJhMWI2NywgMHgwZjg1Mzg1NiwgMHgwMThjMzU1ZCwgMHgxMzk3MjI0MCwgMHgxZDllMmY0YiwgMHg0N2U5NjQyMiwgMHg0OWUwNjkyOSwgMHg1YmZiN2UzNCwgMHg1NWYyNzMzZiwgMHg3ZmNkNTAwZSwgMHg3MWM0NWQwNSwgMHg2M2RmNGExOCwgMHg2ZGQ2NDcxMywgMHhkNzMxZGNjYSwgMHhkOTM4ZDFjMSwgMHhjYjIzYzZkYywgMHhjNTJhY2JkNywgMHhlZjE1ZThlNiwgMHhlMTFjZTVlZCwgMHhmMzA3ZjJmMCwgMHhmZDBlZmZmYiwgMHhhNzc5YjQ5MiwgMHhhOTcwYjk5OSwgMHhiYjZiYWU4NCwgMHhiNTYyYTM4ZiwgMHg5ZjVkODBiZSwgMHg5MTU0OGRiNSwgMHg4MzRmOWFhOCwgMHg4ZDQ2OTdhM107XG4gICAgdmFyIFUyID0gWzB4MDAwMDAwMDAsIDB4MGIwZTA5MGQsIDB4MTYxYzEyMWEsIDB4MWQxMjFiMTcsIDB4MmMzODI0MzQsIDB4MjczNjJkMzksIDB4M2EyNDM2MmUsIDB4MzEyYTNmMjMsIDB4NTg3MDQ4NjgsIDB4NTM3ZTQxNjUsIDB4NGU2YzVhNzIsIDB4NDU2MjUzN2YsIDB4NzQ0ODZjNWMsIDB4N2Y0NjY1NTEsIDB4NjI1NDdlNDYsIDB4Njk1YTc3NGIsIDB4YjBlMDkwZDAsIDB4YmJlZTk5ZGQsIDB4YTZmYzgyY2EsIDB4YWRmMjhiYzcsIDB4OWNkOGI0ZTQsIDB4OTdkNmJkZTksIDB4OGFjNGE2ZmUsIDB4ODFjYWFmZjMsIDB4ZTg5MGQ4YjgsIDB4ZTM5ZWQxYjUsIDB4ZmU4Y2NhYTIsIDB4ZjU4MmMzYWYsIDB4YzRhOGZjOGMsIDB4Y2ZhNmY1ODEsIDB4ZDJiNGVlOTYsIDB4ZDliYWU3OWIsIDB4N2JkYjNiYmIsIDB4NzBkNTMyYjYsIDB4NmRjNzI5YTEsIDB4NjZjOTIwYWMsIDB4NTdlMzFmOGYsIDB4NWNlZDE2ODIsIDB4NDFmZjBkOTUsIDB4NGFmMTA0OTgsIDB4MjNhYjczZDMsIDB4MjhhNTdhZGUsIDB4MzViNzYxYzksIDB4M2ViOTY4YzQsIDB4MGY5MzU3ZTcsIDB4MDQ5ZDVlZWEsIDB4MTk4ZjQ1ZmQsIDB4MTI4MTRjZjAsIDB4Y2IzYmFiNmIsIDB4YzAzNWEyNjYsIDB4ZGQyN2I5NzEsIDB4ZDYyOWIwN2MsIDB4ZTcwMzhmNWYsIDB4ZWMwZDg2NTIsIDB4ZjExZjlkNDUsIDB4ZmExMTk0NDgsIDB4OTM0YmUzMDMsIDB4OTg0NWVhMGUsIDB4ODU1N2YxMTksIDB4OGU1OWY4MTQsIDB4YmY3M2M3MzcsIDB4YjQ3ZGNlM2EsIDB4YTk2ZmQ1MmQsIDB4YTI2MWRjMjAsIDB4ZjZhZDc2NmQsIDB4ZmRhMzdmNjAsIDB4ZTBiMTY0NzcsIDB4ZWJiZjZkN2EsIDB4ZGE5NTUyNTksIDB4ZDE5YjViNTQsIDB4Y2M4OTQwNDMsIDB4Yzc4NzQ5NGUsIDB4YWVkZDNlMDUsIDB4YTVkMzM3MDgsIDB4YjhjMTJjMWYsIDB4YjNjZjI1MTIsIDB4ODJlNTFhMzEsIDB4ODllYjEzM2MsIDB4OTRmOTA4MmIsIDB4OWZmNzAxMjYsIDB4NDY0ZGU2YmQsIDB4NGQ0M2VmYjAsIDB4NTA1MWY0YTcsIDB4NWI1ZmZkYWEsIDB4NmE3NWMyODksIDB4NjE3YmNiODQsIDB4N2M2OWQwOTMsIDB4Nzc2N2Q5OWUsIDB4MWUzZGFlZDUsIDB4MTUzM2E3ZDgsIDB4MDgyMWJjY2YsIDB4MDMyZmI1YzIsIDB4MzIwNThhZTEsIDB4MzkwYjgzZWMsIDB4MjQxOTk4ZmIsIDB4MmYxNzkxZjYsIDB4OGQ3NjRkZDYsIDB4ODY3ODQ0ZGIsIDB4OWI2YTVmY2MsIDB4OTA2NDU2YzEsIDB4YTE0ZTY5ZTIsIDB4YWE0MDYwZWYsIDB4Yjc1MjdiZjgsIDB4YmM1YzcyZjUsIDB4ZDUwNjA1YmUsIDB4ZGUwODBjYjMsIDB4YzMxYTE3YTQsIDB4YzgxNDFlYTksIDB4ZjkzZTIxOGEsIDB4ZjIzMDI4ODcsIDB4ZWYyMjMzOTAsIDB4ZTQyYzNhOWQsIDB4M2Q5NmRkMDYsIDB4MzY5OGQ0MGIsIDB4MmI4YWNmMWMsIDB4MjA4NGM2MTEsIDB4MTFhZWY5MzIsIDB4MWFhMGYwM2YsIDB4MDdiMmViMjgsIDB4MGNiY2UyMjUsIDB4NjVlNjk1NmUsIDB4NmVlODljNjMsIDB4NzNmYTg3NzQsIDB4NzhmNDhlNzksIDB4NDlkZWIxNWEsIDB4NDJkMGI4NTcsIDB4NWZjMmEzNDAsIDB4NTRjY2FhNGQsIDB4Zjc0MWVjZGEsIDB4ZmM0ZmU1ZDcsIDB4ZTE1ZGZlYzAsIDB4ZWE1M2Y3Y2QsIDB4ZGI3OWM4ZWUsIDB4ZDA3N2MxZTMsIDB4Y2Q2NWRhZjQsIDB4YzY2YmQzZjksIDB4YWYzMWE0YjIsIDB4YTQzZmFkYmYsIDB4YjkyZGI2YTgsIDB4YjIyM2JmYTUsIDB4ODMwOTgwODYsIDB4ODgwNzg5OGIsIDB4OTUxNTkyOWMsIDB4OWUxYjliOTEsIDB4NDdhMTdjMGEsIDB4NGNhZjc1MDcsIDB4NTFiZDZlMTAsIDB4NWFiMzY3MWQsIDB4NmI5OTU4M2UsIDB4NjA5NzUxMzMsIDB4N2Q4NTRhMjQsIDB4NzY4YjQzMjksIDB4MWZkMTM0NjIsIDB4MTRkZjNkNmYsIDB4MDljZDI2NzgsIDB4MDJjMzJmNzUsIDB4MzNlOTEwNTYsIDB4MzhlNzE5NWIsIDB4MjVmNTAyNGMsIDB4MmVmYjBiNDEsIDB4OGM5YWQ3NjEsIDB4ODc5NGRlNmMsIDB4OWE4NmM1N2IsIDB4OTE4OGNjNzYsIDB4YTBhMmYzNTUsIDB4YWJhY2ZhNTgsIDB4YjZiZWUxNGYsIDB4YmRiMGU4NDIsIDB4ZDRlYTlmMDksIDB4ZGZlNDk2MDQsIDB4YzJmNjhkMTMsIDB4YzlmODg0MWUsIDB4ZjhkMmJiM2QsIDB4ZjNkY2IyMzAsIDB4ZWVjZWE5MjcsIDB4ZTVjMGEwMmEsIDB4M2M3YTQ3YjEsIDB4Mzc3NDRlYmMsIDB4MmE2NjU1YWIsIDB4MjE2ODVjYTYsIDB4MTA0MjYzODUsIDB4MWI0YzZhODgsIDB4MDY1ZTcxOWYsIDB4MGQ1MDc4OTIsIDB4NjQwYTBmZDksIDB4NmYwNDA2ZDQsIDB4NzIxNjFkYzMsIDB4NzkxODE0Y2UsIDB4NDgzMjJiZWQsIDB4NDMzYzIyZTAsIDB4NWUyZTM5ZjcsIDB4NTUyMDMwZmEsIDB4MDFlYzlhYjcsIDB4MGFlMjkzYmEsIDB4MTdmMDg4YWQsIDB4MWNmZTgxYTAsIDB4MmRkNGJlODMsIDB4MjZkYWI3OGUsIDB4M2JjOGFjOTksIDB4MzBjNmE1OTQsIDB4NTk5Y2QyZGYsIDB4NTI5MmRiZDIsIDB4NGY4MGMwYzUsIDB4NDQ4ZWM5YzgsIDB4NzVhNGY2ZWIsIDB4N2VhYWZmZTYsIDB4NjNiOGU0ZjEsIDB4NjhiNmVkZmMsIDB4YjEwYzBhNjcsIDB4YmEwMjAzNmEsIDB4YTcxMDE4N2QsIDB4YWMxZTExNzAsIDB4OWQzNDJlNTMsIDB4OTYzYTI3NWUsIDB4OGIyODNjNDksIDB4ODAyNjM1NDQsIDB4ZTk3YzQyMGYsIDB4ZTI3MjRiMDIsIDB4ZmY2MDUwMTUsIDB4ZjQ2ZTU5MTgsIDB4YzU0NDY2M2IsIDB4Y2U0YTZmMzYsIDB4ZDM1ODc0MjEsIDB4ZDg1NjdkMmMsIDB4N2EzN2ExMGMsIDB4NzEzOWE4MDEsIDB4NmMyYmIzMTYsIDB4NjcyNWJhMWIsIDB4NTYwZjg1MzgsIDB4NWQwMThjMzUsIDB4NDAxMzk3MjIsIDB4NGIxZDllMmYsIDB4MjI0N2U5NjQsIDB4Mjk0OWUwNjksIDB4MzQ1YmZiN2UsIDB4M2Y1NWYyNzMsIDB4MGU3ZmNkNTAsIDB4MDU3MWM0NWQsIDB4MTg2M2RmNGEsIDB4MTM2ZGQ2NDcsIDB4Y2FkNzMxZGMsIDB4YzFkOTM4ZDEsIDB4ZGNjYjIzYzYsIDB4ZDdjNTJhY2IsIDB4ZTZlZjE1ZTgsIDB4ZWRlMTFjZTUsIDB4ZjBmMzA3ZjIsIDB4ZmJmZDBlZmYsIDB4OTJhNzc5YjQsIDB4OTlhOTcwYjksIDB4ODRiYjZiYWUsIDB4OGZiNTYyYTMsIDB4YmU5ZjVkODAsIDB4YjU5MTU0OGQsIDB4YTg4MzRmOWEsIDB4YTM4ZDQ2OTddO1xuICAgIHZhciBVMyA9IFsweDAwMDAwMDAwLCAweDBkMGIwZTA5LCAweDFhMTYxYzEyLCAweDE3MWQxMjFiLCAweDM0MmMzODI0LCAweDM5MjczNjJkLCAweDJlM2EyNDM2LCAweDIzMzEyYTNmLCAweDY4NTg3MDQ4LCAweDY1NTM3ZTQxLCAweDcyNGU2YzVhLCAweDdmNDU2MjUzLCAweDVjNzQ0ODZjLCAweDUxN2Y0NjY1LCAweDQ2NjI1NDdlLCAweDRiNjk1YTc3LCAweGQwYjBlMDkwLCAweGRkYmJlZTk5LCAweGNhYTZmYzgyLCAweGM3YWRmMjhiLCAweGU0OWNkOGI0LCAweGU5OTdkNmJkLCAweGZlOGFjNGE2LCAweGYzODFjYWFmLCAweGI4ZTg5MGQ4LCAweGI1ZTM5ZWQxLCAweGEyZmU4Y2NhLCAweGFmZjU4MmMzLCAweDhjYzRhOGZjLCAweDgxY2ZhNmY1LCAweDk2ZDJiNGVlLCAweDliZDliYWU3LCAweGJiN2JkYjNiLCAweGI2NzBkNTMyLCAweGExNmRjNzI5LCAweGFjNjZjOTIwLCAweDhmNTdlMzFmLCAweDgyNWNlZDE2LCAweDk1NDFmZjBkLCAweDk4NGFmMTA0LCAweGQzMjNhYjczLCAweGRlMjhhNTdhLCAweGM5MzViNzYxLCAweGM0M2ViOTY4LCAweGU3MGY5MzU3LCAweGVhMDQ5ZDVlLCAweGZkMTk4ZjQ1LCAweGYwMTI4MTRjLCAweDZiY2IzYmFiLCAweDY2YzAzNWEyLCAweDcxZGQyN2I5LCAweDdjZDYyOWIwLCAweDVmZTcwMzhmLCAweDUyZWMwZDg2LCAweDQ1ZjExZjlkLCAweDQ4ZmExMTk0LCAweDAzOTM0YmUzLCAweDBlOTg0NWVhLCAweDE5ODU1N2YxLCAweDE0OGU1OWY4LCAweDM3YmY3M2M3LCAweDNhYjQ3ZGNlLCAweDJkYTk2ZmQ1LCAweDIwYTI2MWRjLCAweDZkZjZhZDc2LCAweDYwZmRhMzdmLCAweDc3ZTBiMTY0LCAweDdhZWJiZjZkLCAweDU5ZGE5NTUyLCAweDU0ZDE5YjViLCAweDQzY2M4OTQwLCAweDRlYzc4NzQ5LCAweDA1YWVkZDNlLCAweDA4YTVkMzM3LCAweDFmYjhjMTJjLCAweDEyYjNjZjI1LCAweDMxODJlNTFhLCAweDNjODllYjEzLCAweDJiOTRmOTA4LCAweDI2OWZmNzAxLCAweGJkNDY0ZGU2LCAweGIwNGQ0M2VmLCAweGE3NTA1MWY0LCAweGFhNWI1ZmZkLCAweDg5NmE3NWMyLCAweDg0NjE3YmNiLCAweDkzN2M2OWQwLCAweDllNzc2N2Q5LCAweGQ1MWUzZGFlLCAweGQ4MTUzM2E3LCAweGNmMDgyMWJjLCAweGMyMDMyZmI1LCAweGUxMzIwNThhLCAweGVjMzkwYjgzLCAweGZiMjQxOTk4LCAweGY2MmYxNzkxLCAweGQ2OGQ3NjRkLCAweGRiODY3ODQ0LCAweGNjOWI2YTVmLCAweGMxOTA2NDU2LCAweGUyYTE0ZTY5LCAweGVmYWE0MDYwLCAweGY4Yjc1MjdiLCAweGY1YmM1YzcyLCAweGJlZDUwNjA1LCAweGIzZGUwODBjLCAweGE0YzMxYTE3LCAweGE5YzgxNDFlLCAweDhhZjkzZTIxLCAweDg3ZjIzMDI4LCAweDkwZWYyMjMzLCAweDlkZTQyYzNhLCAweDA2M2Q5NmRkLCAweDBiMzY5OGQ0LCAweDFjMmI4YWNmLCAweDExMjA4NGM2LCAweDMyMTFhZWY5LCAweDNmMWFhMGYwLCAweDI4MDdiMmViLCAweDI1MGNiY2UyLCAweDZlNjVlNjk1LCAweDYzNmVlODljLCAweDc0NzNmYTg3LCAweDc5NzhmNDhlLCAweDVhNDlkZWIxLCAweDU3NDJkMGI4LCAweDQwNWZjMmEzLCAweDRkNTRjY2FhLCAweGRhZjc0MWVjLCAweGQ3ZmM0ZmU1LCAweGMwZTE1ZGZlLCAweGNkZWE1M2Y3LCAweGVlZGI3OWM4LCAweGUzZDA3N2MxLCAweGY0Y2Q2NWRhLCAweGY5YzY2YmQzLCAweGIyYWYzMWE0LCAweGJmYTQzZmFkLCAweGE4YjkyZGI2LCAweGE1YjIyM2JmLCAweDg2ODMwOTgwLCAweDhiODgwNzg5LCAweDljOTUxNTkyLCAweDkxOWUxYjliLCAweDBhNDdhMTdjLCAweDA3NGNhZjc1LCAweDEwNTFiZDZlLCAweDFkNWFiMzY3LCAweDNlNmI5OTU4LCAweDMzNjA5NzUxLCAweDI0N2Q4NTRhLCAweDI5NzY4YjQzLCAweDYyMWZkMTM0LCAweDZmMTRkZjNkLCAweDc4MDljZDI2LCAweDc1MDJjMzJmLCAweDU2MzNlOTEwLCAweDViMzhlNzE5LCAweDRjMjVmNTAyLCAweDQxMmVmYjBiLCAweDYxOGM5YWQ3LCAweDZjODc5NGRlLCAweDdiOWE4NmM1LCAweDc2OTE4OGNjLCAweDU1YTBhMmYzLCAweDU4YWJhY2ZhLCAweDRmYjZiZWUxLCAweDQyYmRiMGU4LCAweDA5ZDRlYTlmLCAweDA0ZGZlNDk2LCAweDEzYzJmNjhkLCAweDFlYzlmODg0LCAweDNkZjhkMmJiLCAweDMwZjNkY2IyLCAweDI3ZWVjZWE5LCAweDJhZTVjMGEwLCAweGIxM2M3YTQ3LCAweGJjMzc3NDRlLCAweGFiMmE2NjU1LCAweGE2MjE2ODVjLCAweDg1MTA0MjYzLCAweDg4MWI0YzZhLCAweDlmMDY1ZTcxLCAweDkyMGQ1MDc4LCAweGQ5NjQwYTBmLCAweGQ0NmYwNDA2LCAweGMzNzIxNjFkLCAweGNlNzkxODE0LCAweGVkNDgzMjJiLCAweGUwNDMzYzIyLCAweGY3NWUyZTM5LCAweGZhNTUyMDMwLCAweGI3MDFlYzlhLCAweGJhMGFlMjkzLCAweGFkMTdmMDg4LCAweGEwMWNmZTgxLCAweDgzMmRkNGJlLCAweDhlMjZkYWI3LCAweDk5M2JjOGFjLCAweDk0MzBjNmE1LCAweGRmNTk5Y2QyLCAweGQyNTI5MmRiLCAweGM1NGY4MGMwLCAweGM4NDQ4ZWM5LCAweGViNzVhNGY2LCAweGU2N2VhYWZmLCAweGYxNjNiOGU0LCAweGZjNjhiNmVkLCAweDY3YjEwYzBhLCAweDZhYmEwMjAzLCAweDdkYTcxMDE4LCAweDcwYWMxZTExLCAweDUzOWQzNDJlLCAweDVlOTYzYTI3LCAweDQ5OGIyODNjLCAweDQ0ODAyNjM1LCAweDBmZTk3YzQyLCAweDAyZTI3MjRiLCAweDE1ZmY2MDUwLCAweDE4ZjQ2ZTU5LCAweDNiYzU0NDY2LCAweDM2Y2U0YTZmLCAweDIxZDM1ODc0LCAweDJjZDg1NjdkLCAweDBjN2EzN2ExLCAweDAxNzEzOWE4LCAweDE2NmMyYmIzLCAweDFiNjcyNWJhLCAweDM4NTYwZjg1LCAweDM1NWQwMThjLCAweDIyNDAxMzk3LCAweDJmNGIxZDllLCAweDY0MjI0N2U5LCAweDY5Mjk0OWUwLCAweDdlMzQ1YmZiLCAweDczM2Y1NWYyLCAweDUwMGU3ZmNkLCAweDVkMDU3MWM0LCAweDRhMTg2M2RmLCAweDQ3MTM2ZGQ2LCAweGRjY2FkNzMxLCAweGQxYzFkOTM4LCAweGM2ZGNjYjIzLCAweGNiZDdjNTJhLCAweGU4ZTZlZjE1LCAweGU1ZWRlMTFjLCAweGYyZjBmMzA3LCAweGZmZmJmZDBlLCAweGI0OTJhNzc5LCAweGI5OTlhOTcwLCAweGFlODRiYjZiLCAweGEzOGZiNTYyLCAweDgwYmU5ZjVkLCAweDhkYjU5MTU0LCAweDlhYTg4MzRmLCAweDk3YTM4ZDQ2XTtcbiAgICB2YXIgVTQgPSBbMHgwMDAwMDAwMCwgMHgwOTBkMGIwZSwgMHgxMjFhMTYxYywgMHgxYjE3MWQxMiwgMHgyNDM0MmMzOCwgMHgyZDM5MjczNiwgMHgzNjJlM2EyNCwgMHgzZjIzMzEyYSwgMHg0ODY4NTg3MCwgMHg0MTY1NTM3ZSwgMHg1YTcyNGU2YywgMHg1MzdmNDU2MiwgMHg2YzVjNzQ0OCwgMHg2NTUxN2Y0NiwgMHg3ZTQ2NjI1NCwgMHg3NzRiNjk1YSwgMHg5MGQwYjBlMCwgMHg5OWRkYmJlZSwgMHg4MmNhYTZmYywgMHg4YmM3YWRmMiwgMHhiNGU0OWNkOCwgMHhiZGU5OTdkNiwgMHhhNmZlOGFjNCwgMHhhZmYzODFjYSwgMHhkOGI4ZTg5MCwgMHhkMWI1ZTM5ZSwgMHhjYWEyZmU4YywgMHhjM2FmZjU4MiwgMHhmYzhjYzRhOCwgMHhmNTgxY2ZhNiwgMHhlZTk2ZDJiNCwgMHhlNzliZDliYSwgMHgzYmJiN2JkYiwgMHgzMmI2NzBkNSwgMHgyOWExNmRjNywgMHgyMGFjNjZjOSwgMHgxZjhmNTdlMywgMHgxNjgyNWNlZCwgMHgwZDk1NDFmZiwgMHgwNDk4NGFmMSwgMHg3M2QzMjNhYiwgMHg3YWRlMjhhNSwgMHg2MWM5MzViNywgMHg2OGM0M2ViOSwgMHg1N2U3MGY5MywgMHg1ZWVhMDQ5ZCwgMHg0NWZkMTk4ZiwgMHg0Y2YwMTI4MSwgMHhhYjZiY2IzYiwgMHhhMjY2YzAzNSwgMHhiOTcxZGQyNywgMHhiMDdjZDYyOSwgMHg4ZjVmZTcwMywgMHg4NjUyZWMwZCwgMHg5ZDQ1ZjExZiwgMHg5NDQ4ZmExMSwgMHhlMzAzOTM0YiwgMHhlYTBlOTg0NSwgMHhmMTE5ODU1NywgMHhmODE0OGU1OSwgMHhjNzM3YmY3MywgMHhjZTNhYjQ3ZCwgMHhkNTJkYTk2ZiwgMHhkYzIwYTI2MSwgMHg3NjZkZjZhZCwgMHg3ZjYwZmRhMywgMHg2NDc3ZTBiMSwgMHg2ZDdhZWJiZiwgMHg1MjU5ZGE5NSwgMHg1YjU0ZDE5YiwgMHg0MDQzY2M4OSwgMHg0OTRlYzc4NywgMHgzZTA1YWVkZCwgMHgzNzA4YTVkMywgMHgyYzFmYjhjMSwgMHgyNTEyYjNjZiwgMHgxYTMxODJlNSwgMHgxMzNjODllYiwgMHgwODJiOTRmOSwgMHgwMTI2OWZmNywgMHhlNmJkNDY0ZCwgMHhlZmIwNGQ0MywgMHhmNGE3NTA1MSwgMHhmZGFhNWI1ZiwgMHhjMjg5NmE3NSwgMHhjYjg0NjE3YiwgMHhkMDkzN2M2OSwgMHhkOTllNzc2NywgMHhhZWQ1MWUzZCwgMHhhN2Q4MTUzMywgMHhiY2NmMDgyMSwgMHhiNWMyMDMyZiwgMHg4YWUxMzIwNSwgMHg4M2VjMzkwYiwgMHg5OGZiMjQxOSwgMHg5MWY2MmYxNywgMHg0ZGQ2OGQ3NiwgMHg0NGRiODY3OCwgMHg1ZmNjOWI2YSwgMHg1NmMxOTA2NCwgMHg2OWUyYTE0ZSwgMHg2MGVmYWE0MCwgMHg3YmY4Yjc1MiwgMHg3MmY1YmM1YywgMHgwNWJlZDUwNiwgMHgwY2IzZGUwOCwgMHgxN2E0YzMxYSwgMHgxZWE5YzgxNCwgMHgyMThhZjkzZSwgMHgyODg3ZjIzMCwgMHgzMzkwZWYyMiwgMHgzYTlkZTQyYywgMHhkZDA2M2Q5NiwgMHhkNDBiMzY5OCwgMHhjZjFjMmI4YSwgMHhjNjExMjA4NCwgMHhmOTMyMTFhZSwgMHhmMDNmMWFhMCwgMHhlYjI4MDdiMiwgMHhlMjI1MGNiYywgMHg5NTZlNjVlNiwgMHg5YzYzNmVlOCwgMHg4Nzc0NzNmYSwgMHg4ZTc5NzhmNCwgMHhiMTVhNDlkZSwgMHhiODU3NDJkMCwgMHhhMzQwNWZjMiwgMHhhYTRkNTRjYywgMHhlY2RhZjc0MSwgMHhlNWQ3ZmM0ZiwgMHhmZWMwZTE1ZCwgMHhmN2NkZWE1MywgMHhjOGVlZGI3OSwgMHhjMWUzZDA3NywgMHhkYWY0Y2Q2NSwgMHhkM2Y5YzY2YiwgMHhhNGIyYWYzMSwgMHhhZGJmYTQzZiwgMHhiNmE4YjkyZCwgMHhiZmE1YjIyMywgMHg4MDg2ODMwOSwgMHg4OThiODgwNywgMHg5MjljOTUxNSwgMHg5YjkxOWUxYiwgMHg3YzBhNDdhMSwgMHg3NTA3NGNhZiwgMHg2ZTEwNTFiZCwgMHg2NzFkNWFiMywgMHg1ODNlNmI5OSwgMHg1MTMzNjA5NywgMHg0YTI0N2Q4NSwgMHg0MzI5NzY4YiwgMHgzNDYyMWZkMSwgMHgzZDZmMTRkZiwgMHgyNjc4MDljZCwgMHgyZjc1MDJjMywgMHgxMDU2MzNlOSwgMHgxOTViMzhlNywgMHgwMjRjMjVmNSwgMHgwYjQxMmVmYiwgMHhkNzYxOGM5YSwgMHhkZTZjODc5NCwgMHhjNTdiOWE4NiwgMHhjYzc2OTE4OCwgMHhmMzU1YTBhMiwgMHhmYTU4YWJhYywgMHhlMTRmYjZiZSwgMHhlODQyYmRiMCwgMHg5ZjA5ZDRlYSwgMHg5NjA0ZGZlNCwgMHg4ZDEzYzJmNiwgMHg4NDFlYzlmOCwgMHhiYjNkZjhkMiwgMHhiMjMwZjNkYywgMHhhOTI3ZWVjZSwgMHhhMDJhZTVjMCwgMHg0N2IxM2M3YSwgMHg0ZWJjMzc3NCwgMHg1NWFiMmE2NiwgMHg1Y2E2MjE2OCwgMHg2Mzg1MTA0MiwgMHg2YTg4MWI0YywgMHg3MTlmMDY1ZSwgMHg3ODkyMGQ1MCwgMHgwZmQ5NjQwYSwgMHgwNmQ0NmYwNCwgMHgxZGMzNzIxNiwgMHgxNGNlNzkxOCwgMHgyYmVkNDgzMiwgMHgyMmUwNDMzYywgMHgzOWY3NWUyZSwgMHgzMGZhNTUyMCwgMHg5YWI3MDFlYywgMHg5M2JhMGFlMiwgMHg4OGFkMTdmMCwgMHg4MWEwMWNmZSwgMHhiZTgzMmRkNCwgMHhiNzhlMjZkYSwgMHhhYzk5M2JjOCwgMHhhNTk0MzBjNiwgMHhkMmRmNTk5YywgMHhkYmQyNTI5MiwgMHhjMGM1NGY4MCwgMHhjOWM4NDQ4ZSwgMHhmNmViNzVhNCwgMHhmZmU2N2VhYSwgMHhlNGYxNjNiOCwgMHhlZGZjNjhiNiwgMHgwYTY3YjEwYywgMHgwMzZhYmEwMiwgMHgxODdkYTcxMCwgMHgxMTcwYWMxZSwgMHgyZTUzOWQzNCwgMHgyNzVlOTYzYSwgMHgzYzQ5OGIyOCwgMHgzNTQ0ODAyNiwgMHg0MjBmZTk3YywgMHg0YjAyZTI3MiwgMHg1MDE1ZmY2MCwgMHg1OTE4ZjQ2ZSwgMHg2NjNiYzU0NCwgMHg2ZjM2Y2U0YSwgMHg3NDIxZDM1OCwgMHg3ZDJjZDg1NiwgMHhhMTBjN2EzNywgMHhhODAxNzEzOSwgMHhiMzE2NmMyYiwgMHhiYTFiNjcyNSwgMHg4NTM4NTYwZiwgMHg4YzM1NWQwMSwgMHg5NzIyNDAxMywgMHg5ZTJmNGIxZCwgMHhlOTY0MjI0NywgMHhlMDY5Mjk0OSwgMHhmYjdlMzQ1YiwgMHhmMjczM2Y1NSwgMHhjZDUwMGU3ZiwgMHhjNDVkMDU3MSwgMHhkZjRhMTg2MywgMHhkNjQ3MTM2ZCwgMHgzMWRjY2FkNywgMHgzOGQxYzFkOSwgMHgyM2M2ZGNjYiwgMHgyYWNiZDdjNSwgMHgxNWU4ZTZlZiwgMHgxY2U1ZWRlMSwgMHgwN2YyZjBmMywgMHgwZWZmZmJmZCwgMHg3OWI0OTJhNywgMHg3MGI5OTlhOSwgMHg2YmFlODRiYiwgMHg2MmEzOGZiNSwgMHg1ZDgwYmU5ZiwgMHg1NDhkYjU5MSwgMHg0ZjlhYTg4MywgMHg0Njk3YTM4ZF07XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0VG9JbnQzMihieXRlcykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgIChieXRlc1tpICAgIF0gPDwgMjQpIHxcbiAgICAgICAgICAgICAgICAoYnl0ZXNbaSArIDFdIDw8IDE2KSB8XG4gICAgICAgICAgICAgICAgKGJ5dGVzW2kgKyAyXSA8PCAgOCkgfFxuICAgICAgICAgICAgICAgICBieXRlc1tpICsgM11cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB2YXIgQUVTID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBRVMpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAna2V5Jywge1xuICAgICAgICAgICAgdmFsdWU6IGNvZXJjZUFycmF5KGtleSwgdHJ1ZSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fcHJlcGFyZSgpO1xuICAgIH1cblxuXG4gICAgQUVTLnByb3RvdHlwZS5fcHJlcGFyZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciByb3VuZHMgPSBudW1iZXJPZlJvdW5kc1t0aGlzLmtleS5sZW5ndGhdO1xuICAgICAgICBpZiAocm91bmRzID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBrZXkgc2l6ZSAobXVzdCBiZSAxNiwgMjQgb3IgMzIgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbmNyeXB0aW9uIHJvdW5kIGtleXNcbiAgICAgICAgdGhpcy5fS2UgPSBbXTtcblxuICAgICAgICAvLyBkZWNyeXB0aW9uIHJvdW5kIGtleXNcbiAgICAgICAgdGhpcy5fS2QgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSByb3VuZHM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fS2UucHVzaChbMCwgMCwgMCwgMF0pO1xuICAgICAgICAgICAgdGhpcy5fS2QucHVzaChbMCwgMCwgMCwgMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvdW5kS2V5Q291bnQgPSAocm91bmRzICsgMSkgKiA0O1xuICAgICAgICB2YXIgS0MgPSB0aGlzLmtleS5sZW5ndGggLyA0O1xuXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGtleSBpbnRvIGludHNcbiAgICAgICAgdmFyIHRrID0gY29udmVydFRvSW50MzIodGhpcy5rZXkpO1xuXG4gICAgICAgIC8vIGNvcHkgdmFsdWVzIGludG8gcm91bmQga2V5IGFycmF5c1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgS0M7IGkrKykge1xuICAgICAgICAgICAgaW5kZXggPSBpID4+IDI7XG4gICAgICAgICAgICB0aGlzLl9LZVtpbmRleF1baSAlIDRdID0gdGtbaV07XG4gICAgICAgICAgICB0aGlzLl9LZFtyb3VuZHMgLSBpbmRleF1baSAlIDRdID0gdGtbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBrZXkgZXhwYW5zaW9uIChmaXBzLTE5NyBzZWN0aW9uIDUuMilcbiAgICAgICAgdmFyIHJjb25wb2ludGVyID0gMDtcbiAgICAgICAgdmFyIHQgPSBLQywgdHQ7XG4gICAgICAgIHdoaWxlICh0IDwgcm91bmRLZXlDb3VudCkge1xuICAgICAgICAgICAgdHQgPSB0a1tLQyAtIDFdO1xuICAgICAgICAgICAgdGtbMF0gXj0gKChTWyh0dCA+PiAxNikgJiAweEZGXSA8PCAyNCkgXlxuICAgICAgICAgICAgICAgICAgICAgIChTWyh0dCA+PiAgOCkgJiAweEZGXSA8PCAxNikgXlxuICAgICAgICAgICAgICAgICAgICAgIChTWyB0dCAgICAgICAgJiAweEZGXSA8PCAgOCkgXlxuICAgICAgICAgICAgICAgICAgICAgICBTWyh0dCA+PiAyNCkgJiAweEZGXSAgICAgICAgXlxuICAgICAgICAgICAgICAgICAgICAgIChyY29uW3Jjb25wb2ludGVyXSA8PCAyNCkpO1xuICAgICAgICAgICAgcmNvbnBvaW50ZXIgKz0gMTtcblxuICAgICAgICAgICAgLy8ga2V5IGV4cGFuc2lvbiAoZm9yIG5vbi0yNTYgYml0KVxuICAgICAgICAgICAgaWYgKEtDICE9IDgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IEtDOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGtbaV0gXj0gdGtbaSAtIDFdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ga2V5IGV4cGFuc2lvbiBmb3IgMjU2LWJpdCBrZXlzIGlzIFwic2xpZ2h0bHkgZGlmZmVyZW50XCIgKGZpcHMtMTk3KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IChLQyAvIDIpOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGtbaV0gXj0gdGtbaSAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0dCA9IHRrWyhLQyAvIDIpIC0gMV07XG5cbiAgICAgICAgICAgICAgICB0a1tLQyAvIDJdIF49IChTWyB0dCAgICAgICAgJiAweEZGXSAgICAgICAgXlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFNbKHR0ID4+ICA4KSAmIDB4RkZdIDw8ICA4KSBeXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoU1sodHQgPj4gMTYpICYgMHhGRl0gPDwgMTYpIF5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChTWyh0dCA+PiAyNCkgJiAweEZGXSA8PCAyNCkpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IChLQyAvIDIpICsgMTsgaSA8IEtDOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGtbaV0gXj0gdGtbaSAtIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29weSB2YWx1ZXMgaW50byByb3VuZCBrZXkgYXJyYXlzXG4gICAgICAgICAgICB2YXIgaSA9IDAsIHIsIGM7XG4gICAgICAgICAgICB3aGlsZSAoaSA8IEtDICYmIHQgPCByb3VuZEtleUNvdW50KSB7XG4gICAgICAgICAgICAgICAgciA9IHQgPj4gMjtcbiAgICAgICAgICAgICAgICBjID0gdCAlIDQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fS2Vbcl1bY10gPSB0a1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9LZFtyb3VuZHMgLSByXVtjXSA9IHRrW2krK107XG4gICAgICAgICAgICAgICAgdCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW52ZXJzZS1jaXBoZXItaWZ5IHRoZSBkZWNyeXB0aW9uIHJvdW5kIGtleSAoZmlwcy0xOTcgc2VjdGlvbiA1LjMpXG4gICAgICAgIGZvciAodmFyIHIgPSAxOyByIDwgcm91bmRzOyByKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgNDsgYysrKSB7XG4gICAgICAgICAgICAgICAgdHQgPSB0aGlzLl9LZFtyXVtjXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9LZFtyXVtjXSA9IChVMVsodHQgPj4gMjQpICYgMHhGRl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFUyWyh0dCA+PiAxNikgJiAweEZGXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVTNbKHR0ID4+ICA4KSAmIDB4RkZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVNFsgdHQgICAgICAgICYgMHhGRl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgQUVTLnByb3RvdHlwZS5lbmNyeXB0ID0gZnVuY3Rpb24ocGxhaW50ZXh0KSB7XG4gICAgICAgIGlmIChwbGFpbnRleHQubGVuZ3RoICE9IDE2KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcm91bmRzID0gdGhpcy5fS2UubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIGEgPSBbMCwgMCwgMCwgMF07XG5cbiAgICAgICAgLy8gY29udmVydCBwbGFpbnRleHQgdG8gKGludHMgXiBrZXkpXG4gICAgICAgIHZhciB0ID0gY29udmVydFRvSW50MzIocGxhaW50ZXh0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRbaV0gXj0gdGhpcy5fS2VbMF1baV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcHBseSByb3VuZCB0cmFuc2Zvcm1zXG4gICAgICAgIGZvciAodmFyIHIgPSAxOyByIDwgcm91bmRzOyByKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IChUMVsodFsgaSAgICAgICAgIF0gPj4gMjQpICYgMHhmZl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgVDJbKHRbKGkgKyAxKSAlIDRdID4+IDE2KSAmIDB4ZmZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgIFQzWyh0WyhpICsgMikgJSA0XSA+PiAgOCkgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICBUNFsgdFsoaSArIDMpICUgNF0gICAgICAgICYgMHhmZl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS2Vbcl1baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdCA9IGEuc2xpY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSBsYXN0IHJvdW5kIGlzIHNwZWNpYWxcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNyZWF0ZUFycmF5KDE2KSwgdHQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICB0dCA9IHRoaXMuX0tlW3JvdW5kc11baV07XG4gICAgICAgICAgICByZXN1bHRbNCAqIGkgICAgXSA9IChTWyh0WyBpICAgICAgICAgXSA+PiAyNCkgJiAweGZmXSBeICh0dCA+PiAyNCkpICYgMHhmZjtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSArIDFdID0gKFNbKHRbKGkgKyAxKSAlIDRdID4+IDE2KSAmIDB4ZmZdIF4gKHR0ID4+IDE2KSkgJiAweGZmO1xuICAgICAgICAgICAgcmVzdWx0WzQgKiBpICsgMl0gPSAoU1sodFsoaSArIDIpICUgNF0gPj4gIDgpICYgMHhmZl0gXiAodHQgPj4gIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICByZXN1bHRbNCAqIGkgKyAzXSA9IChTWyB0WyhpICsgMykgJSA0XSAgICAgICAgJiAweGZmXSBeICB0dCAgICAgICApICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgQUVTLnByb3RvdHlwZS5kZWNyeXB0ID0gZnVuY3Rpb24oY2lwaGVydGV4dCkge1xuICAgICAgICBpZiAoY2lwaGVydGV4dC5sZW5ndGggIT0gMTYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaXBoZXJ0ZXh0IHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcm91bmRzID0gdGhpcy5fS2QubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIGEgPSBbMCwgMCwgMCwgMF07XG5cbiAgICAgICAgLy8gY29udmVydCBwbGFpbnRleHQgdG8gKGludHMgXiBrZXkpXG4gICAgICAgIHZhciB0ID0gY29udmVydFRvSW50MzIoY2lwaGVydGV4dCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICB0W2ldIF49IHRoaXMuX0tkWzBdW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXBwbHkgcm91bmQgdHJhbnNmb3Jtc1xuICAgICAgICBmb3IgKHZhciByID0gMTsgciA8IHJvdW5kczsgcisrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGFbaV0gPSAoVDVbKHRbIGkgICAgICAgICAgXSA+PiAyNCkgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICBUNlsodFsoaSArIDMpICUgNF0gPj4gMTYpICYgMHhmZl0gXlxuICAgICAgICAgICAgICAgICAgICAgICAgVDdbKHRbKGkgKyAyKSAlIDRdID4+ICA4KSAmIDB4ZmZdIF5cbiAgICAgICAgICAgICAgICAgICAgICAgIFQ4WyB0WyhpICsgMSkgJSA0XSAgICAgICAgJiAweGZmXSBeXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9LZFtyXVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ID0gYS5zbGljZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhlIGxhc3Qgcm91bmQgaXMgc3BlY2lhbFxuICAgICAgICB2YXIgcmVzdWx0ID0gY3JlYXRlQXJyYXkoMTYpLCB0dDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHR0ID0gdGhpcy5fS2Rbcm91bmRzXVtpXTtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSAgICBdID0gKFNpWyh0WyBpICAgICAgICAgXSA+PiAyNCkgJiAweGZmXSBeICh0dCA+PiAyNCkpICYgMHhmZjtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSArIDFdID0gKFNpWyh0WyhpICsgMykgJSA0XSA+PiAxNikgJiAweGZmXSBeICh0dCA+PiAxNikpICYgMHhmZjtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSArIDJdID0gKFNpWyh0WyhpICsgMikgJSA0XSA+PiAgOCkgJiAweGZmXSBeICh0dCA+PiAgOCkpICYgMHhmZjtcbiAgICAgICAgICAgIHJlc3VsdFs0ICogaSArIDNdID0gKFNpWyB0WyhpICsgMSkgJSA0XSAgICAgICAgJiAweGZmXSBeICB0dCAgICAgICApICYgMHhmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAgTW9kZSBPZiBPcGVyYXRpb24gLSBFbGVjdG9uaWMgQ29kZWJvb2sgKEVDQilcbiAgICAgKi9cbiAgICB2YXIgTW9kZU9mT3BlcmF0aW9uRUNCID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25FQ0IpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIkVsZWN0cm9uaWMgQ29kZSBCbG9ja1wiO1xuICAgICAgICB0aGlzLm5hbWUgPSBcImVjYlwiO1xuXG4gICAgICAgIHRoaXMuX2FlcyA9IG5ldyBBRVMoa2V5KTtcbiAgICB9XG5cbiAgICBNb2RlT2ZPcGVyYXRpb25FQ0IucHJvdG90eXBlLmVuY3J5cHQgPSBmdW5jdGlvbihwbGFpbnRleHQpIHtcbiAgICAgICAgcGxhaW50ZXh0ID0gY29lcmNlQXJyYXkocGxhaW50ZXh0KTtcblxuICAgICAgICBpZiAoKHBsYWludGV4dC5sZW5ndGggJSAxNikgIT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwbGFpbnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaXBoZXJ0ZXh0ID0gY3JlYXRlQXJyYXkocGxhaW50ZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZhciBibG9jayA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWludGV4dC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICAgIGNvcHlBcnJheShwbGFpbnRleHQsIGJsb2NrLCAwLCBpLCBpICsgMTYpO1xuICAgICAgICAgICAgYmxvY2sgPSB0aGlzLl9hZXMuZW5jcnlwdChibG9jayk7XG4gICAgICAgICAgICBjb3B5QXJyYXkoYmxvY2ssIGNpcGhlcnRleHQsIGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNpcGhlcnRleHQ7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uRUNCLnByb3RvdHlwZS5kZWNyeXB0ID0gZnVuY3Rpb24oY2lwaGVydGV4dCkge1xuICAgICAgICBjaXBoZXJ0ZXh0ID0gY29lcmNlQXJyYXkoY2lwaGVydGV4dCk7XG5cbiAgICAgICAgaWYgKChjaXBoZXJ0ZXh0Lmxlbmd0aCAlIDE2KSAhPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwbGFpbnRleHQgPSBjcmVhdGVBcnJheShjaXBoZXJ0ZXh0Lmxlbmd0aCk7XG4gICAgICAgIHZhciBibG9jayA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNpcGhlcnRleHQubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgICBjb3B5QXJyYXkoY2lwaGVydGV4dCwgYmxvY2ssIDAsIGksIGkgKyAxNik7XG4gICAgICAgICAgICBibG9jayA9IHRoaXMuX2Flcy5kZWNyeXB0KGJsb2NrKTtcbiAgICAgICAgICAgIGNvcHlBcnJheShibG9jaywgcGxhaW50ZXh0LCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGFpbnRleHQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAgTW9kZSBPZiBPcGVyYXRpb24gLSBDaXBoZXIgQmxvY2sgQ2hhaW5pbmcgKENCQylcbiAgICAgKi9cbiAgICB2YXIgTW9kZU9mT3BlcmF0aW9uQ0JDID0gZnVuY3Rpb24oa2V5LCBpdikge1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ0JDKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0FFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJDaXBoZXIgQmxvY2sgQ2hhaW5pbmdcIjtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJjYmNcIjtcblxuICAgICAgICBpZiAoIWl2KSB7XG4gICAgICAgICAgICBpdiA9IGNyZWF0ZUFycmF5KDE2KTtcblxuICAgICAgICB9IGVsc2UgaWYgKGl2Lmxlbmd0aCAhPSAxNikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBieXRlcyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xhc3RDaXBoZXJibG9jayA9IGNvZXJjZUFycmF5KGl2LCB0cnVlKTtcblxuICAgICAgICB0aGlzLl9hZXMgPSBuZXcgQUVTKGtleSk7XG4gICAgfVxuXG4gICAgTW9kZU9mT3BlcmF0aW9uQ0JDLnByb3RvdHlwZS5lbmNyeXB0ID0gZnVuY3Rpb24ocGxhaW50ZXh0KSB7XG4gICAgICAgIHBsYWludGV4dCA9IGNvZXJjZUFycmF5KHBsYWludGV4dCk7XG5cbiAgICAgICAgaWYgKChwbGFpbnRleHQubGVuZ3RoICUgMTYpICE9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgbXVsdGlwbGUgb2YgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2lwaGVydGV4dCA9IGNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO1xuICAgICAgICB2YXIgYmxvY2sgPSBjcmVhdGVBcnJheSgxNik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFpbnRleHQubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgICBjb3B5QXJyYXkocGxhaW50ZXh0LCBibG9jaywgMCwgaSwgaSArIDE2KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAxNjsgaisrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tbal0gXj0gdGhpcy5fbGFzdENpcGhlcmJsb2NrW2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sYXN0Q2lwaGVyYmxvY2sgPSB0aGlzLl9hZXMuZW5jcnlwdChibG9jayk7XG4gICAgICAgICAgICBjb3B5QXJyYXkodGhpcy5fbGFzdENpcGhlcmJsb2NrLCBjaXBoZXJ0ZXh0LCBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaXBoZXJ0ZXh0O1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbkNCQy5wcm90b3R5cGUuZGVjcnlwdCA9IGZ1bmN0aW9uKGNpcGhlcnRleHQpIHtcbiAgICAgICAgY2lwaGVydGV4dCA9IGNvZXJjZUFycmF5KGNpcGhlcnRleHQpO1xuXG4gICAgICAgIGlmICgoY2lwaGVydGV4dC5sZW5ndGggJSAxNikgIT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjaXBoZXJ0ZXh0IHNpemUgKG11c3QgYmUgbXVsdGlwbGUgb2YgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGxhaW50ZXh0ID0gY3JlYXRlQXJyYXkoY2lwaGVydGV4dC5sZW5ndGgpO1xuICAgICAgICB2YXIgYmxvY2sgPSBjcmVhdGVBcnJheSgxNik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaXBoZXJ0ZXh0Lmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICAgICAgY29weUFycmF5KGNpcGhlcnRleHQsIGJsb2NrLCAwLCBpLCBpICsgMTYpO1xuICAgICAgICAgICAgYmxvY2sgPSB0aGlzLl9hZXMuZGVjcnlwdChibG9jayk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMTY7IGorKykge1xuICAgICAgICAgICAgICAgIHBsYWludGV4dFtpICsgal0gPSBibG9ja1tqXSBeIHRoaXMuX2xhc3RDaXBoZXJibG9ja1tqXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29weUFycmF5KGNpcGhlcnRleHQsIHRoaXMuX2xhc3RDaXBoZXJibG9jaywgMCwgaSwgaSArIDE2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGFpbnRleHQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAgTW9kZSBPZiBPcGVyYXRpb24gLSBDaXBoZXIgRmVlZGJhY2sgKENGQilcbiAgICAgKi9cbiAgICB2YXIgTW9kZU9mT3BlcmF0aW9uQ0ZCID0gZnVuY3Rpb24oa2V5LCBpdiwgc2VnbWVudFNpemUpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkNGQikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ2lwaGVyIEZlZWRiYWNrXCI7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiY2ZiXCI7XG5cbiAgICAgICAgaWYgKCFpdikge1xuICAgICAgICAgICAgaXYgPSBjcmVhdGVBcnJheSgxNik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChpdi5sZW5ndGggIT0gMTYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBpbml0aWFsYXRpb24gdmVjdG9yIHNpemUgKG11c3QgYmUgMTYgc2l6ZSknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VnbWVudFNpemUpIHsgc2VnbWVudFNpemUgPSAxOyB9XG5cbiAgICAgICAgdGhpcy5zZWdtZW50U2l6ZSA9IHNlZ21lbnRTaXplO1xuXG4gICAgICAgIHRoaXMuX3NoaWZ0UmVnaXN0ZXIgPSBjb2VyY2VBcnJheShpdiwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5fYWVzID0gbmV3IEFFUyhrZXkpO1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbkNGQi5wcm90b3R5cGUuZW5jcnlwdCA9IGZ1bmN0aW9uKHBsYWludGV4dCkge1xuICAgICAgICBpZiAoKHBsYWludGV4dC5sZW5ndGggJSB0aGlzLnNlZ21lbnRTaXplKSAhPSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgc2VnbWVudFNpemUgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW5jcnlwdGVkID0gY29lcmNlQXJyYXkocGxhaW50ZXh0LCB0cnVlKTtcblxuICAgICAgICB2YXIgeG9yU2VnbWVudDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmNyeXB0ZWQubGVuZ3RoOyBpICs9IHRoaXMuc2VnbWVudFNpemUpIHtcbiAgICAgICAgICAgIHhvclNlZ21lbnQgPSB0aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9zaGlmdFJlZ2lzdGVyKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5zZWdtZW50U2l6ZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgZW5jcnlwdGVkW2kgKyBqXSBePSB4b3JTZWdtZW50W2pdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaGlmdCB0aGUgcmVnaXN0ZXJcbiAgICAgICAgICAgIGNvcHlBcnJheSh0aGlzLl9zaGlmdFJlZ2lzdGVyLCB0aGlzLl9zaGlmdFJlZ2lzdGVyLCAwLCB0aGlzLnNlZ21lbnRTaXplKTtcbiAgICAgICAgICAgIGNvcHlBcnJheShlbmNyeXB0ZWQsIHRoaXMuX3NoaWZ0UmVnaXN0ZXIsIDE2IC0gdGhpcy5zZWdtZW50U2l6ZSwgaSwgaSArIHRoaXMuc2VnbWVudFNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVuY3J5cHRlZDtcbiAgICB9XG5cbiAgICBNb2RlT2ZPcGVyYXRpb25DRkIucHJvdG90eXBlLmRlY3J5cHQgPSBmdW5jdGlvbihjaXBoZXJ0ZXh0KSB7XG4gICAgICAgIGlmICgoY2lwaGVydGV4dC5sZW5ndGggJSB0aGlzLnNlZ21lbnRTaXplKSAhPSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgY2lwaGVydGV4dCBzaXplIChtdXN0IGJlIHNlZ21lbnRTaXplIGJ5dGVzKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBsYWludGV4dCA9IGNvZXJjZUFycmF5KGNpcGhlcnRleHQsIHRydWUpO1xuXG4gICAgICAgIHZhciB4b3JTZWdtZW50O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWludGV4dC5sZW5ndGg7IGkgKz0gdGhpcy5zZWdtZW50U2l6ZSkge1xuICAgICAgICAgICAgeG9yU2VnbWVudCA9IHRoaXMuX2Flcy5lbmNyeXB0KHRoaXMuX3NoaWZ0UmVnaXN0ZXIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuc2VnbWVudFNpemU7IGorKykge1xuICAgICAgICAgICAgICAgIHBsYWludGV4dFtpICsgal0gXj0geG9yU2VnbWVudFtqXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hpZnQgdGhlIHJlZ2lzdGVyXG4gICAgICAgICAgICBjb3B5QXJyYXkodGhpcy5fc2hpZnRSZWdpc3RlciwgdGhpcy5fc2hpZnRSZWdpc3RlciwgMCwgdGhpcy5zZWdtZW50U2l6ZSk7XG4gICAgICAgICAgICBjb3B5QXJyYXkoY2lwaGVydGV4dCwgdGhpcy5fc2hpZnRSZWdpc3RlciwgMTYgLSB0aGlzLnNlZ21lbnRTaXplLCBpLCBpICsgdGhpcy5zZWdtZW50U2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGxhaW50ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBNb2RlIE9mIE9wZXJhdGlvbiAtIE91dHB1dCBGZWVkYmFjayAoT0ZCKVxuICAgICAqL1xuICAgIHZhciBNb2RlT2ZPcGVyYXRpb25PRkIgPSBmdW5jdGlvbihrZXksIGl2KSB7XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25PRkIpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIk91dHB1dCBGZWVkYmFja1wiO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIm9mYlwiO1xuXG4gICAgICAgIGlmICghaXYpIHtcbiAgICAgICAgICAgIGl2ID0gY3JlYXRlQXJyYXkoMTYpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoaXYubGVuZ3RoICE9IDE2KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgaW5pdGlhbGF0aW9uIHZlY3RvciBzaXplIChtdXN0IGJlIDE2IGJ5dGVzKScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGFzdFByZWNpcGhlciA9IGNvZXJjZUFycmF5KGl2LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fbGFzdFByZWNpcGhlckluZGV4ID0gMTY7XG5cbiAgICAgICAgdGhpcy5fYWVzID0gbmV3IEFFUyhrZXkpO1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZW5jcnlwdCA9IGZ1bmN0aW9uKHBsYWludGV4dCkge1xuICAgICAgICB2YXIgZW5jcnlwdGVkID0gY29lcmNlQXJyYXkocGxhaW50ZXh0LCB0cnVlKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuY3J5cHRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RQcmVjaXBoZXJJbmRleCA9PT0gMTYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UHJlY2lwaGVyID0gdGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fbGFzdFByZWNpcGhlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFByZWNpcGhlckluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVuY3J5cHRlZFtpXSBePSB0aGlzLl9sYXN0UHJlY2lwaGVyW3RoaXMuX2xhc3RQcmVjaXBoZXJJbmRleCsrXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbmNyeXB0ZWQ7XG4gICAgfVxuXG4gICAgLy8gRGVjcnlwdGlvbiBpcyBzeW1ldHJpY1xuICAgIE1vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZGVjcnlwdCA9IE1vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZW5jcnlwdDtcblxuXG4gICAgLyoqXG4gICAgICogIENvdW50ZXIgb2JqZWN0IGZvciBDVFIgY29tbW9uIG1vZGUgb2Ygb3BlcmF0aW9uXG4gICAgICovXG4gICAgdmFyIENvdW50ZXIgPSBmdW5jdGlvbihpbml0aWFsVmFsdWUpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIENvdW50ZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQ291bnRlciBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBhbGxvdyAwLCBidXQgYW55dGhpbmcgZmFsc2UtaXNoIHVzZXMgdGhlIGRlZmF1bHQgMVxuICAgICAgICBpZiAoaW5pdGlhbFZhbHVlICE9PSAwICYmICFpbml0aWFsVmFsdWUpIHsgaW5pdGlhbFZhbHVlID0gMTsgfVxuXG4gICAgICAgIGlmICh0eXBlb2YoaW5pdGlhbFZhbHVlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBjcmVhdGVBcnJheSgxNik7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKGluaXRpYWxWYWx1ZSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Qnl0ZXMoaW5pdGlhbFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIENvdW50ZXIucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZih2YWx1ZSkgIT09ICdudW1iZXInIHx8IHBhcnNlSW50KHZhbHVlKSAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGNvdW50ZXIgdmFsdWUgKG11c3QgYmUgYW4gaW50ZWdlciknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGNhbm5vdCBzYWZlbHkgaGFuZGxlIG51bWJlcnMgYmV5b25kIHRoZSBzYWZlIHJhbmdlIGZvciBpbnRlZ2Vyc1xuICAgICAgICBpZiAodmFsdWUgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlZ2VyIHZhbHVlIG91dCBvZiBzYWZlIHJhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE1OyBpbmRleCA+PSAwOyAtLWluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyW2luZGV4XSA9IHZhbHVlICUgMjU2O1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSAvIDI1Nik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBDb3VudGVyLnByb3RvdHlwZS5zZXRCeXRlcyA9IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICAgIGJ5dGVzID0gY29lcmNlQXJyYXkoYnl0ZXMsIHRydWUpO1xuXG4gICAgICAgIGlmIChieXRlcy5sZW5ndGggIT0gMTYpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBjb3VudGVyIGJ5dGVzIHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb3VudGVyID0gYnl0ZXM7XG4gICAgfTtcblxuICAgIENvdW50ZXIucHJvdG90eXBlLmluY3JlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTU7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY291bnRlcltpXSA9PT0gMjU1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnRlcltpXSA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ZXJbaV0rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogIE1vZGUgT2YgT3BlcmF0aW9uIC0gQ291bnRlciAoQ1RSKVxuICAgICAqL1xuICAgIHZhciBNb2RlT2ZPcGVyYXRpb25DVFIgPSBmdW5jdGlvbihrZXksIGNvdW50ZXIpIHtcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkNUUikpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiQ291bnRlclwiO1xuICAgICAgICB0aGlzLm5hbWUgPSBcImN0clwiO1xuXG4gICAgICAgIGlmICghKGNvdW50ZXIgaW5zdGFuY2VvZiBDb3VudGVyKSkge1xuICAgICAgICAgICAgY291bnRlciA9IG5ldyBDb3VudGVyKGNvdW50ZXIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb3VudGVyID0gY291bnRlcjtcblxuICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudGVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4ID0gMTY7XG5cbiAgICAgICAgdGhpcy5fYWVzID0gbmV3IEFFUyhrZXkpO1xuICAgIH1cblxuICAgIE1vZGVPZk9wZXJhdGlvbkNUUi5wcm90b3R5cGUuZW5jcnlwdCA9IGZ1bmN0aW9uKHBsYWludGV4dCkge1xuICAgICAgICB2YXIgZW5jcnlwdGVkID0gY29lcmNlQXJyYXkocGxhaW50ZXh0LCB0cnVlKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuY3J5cHRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleCA9PT0gMTYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1haW5pbmdDb3VudGVyID0gdGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fY291bnRlci5fY291bnRlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudGVyLmluY3JlbWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5jcnlwdGVkW2ldIF49IHRoaXMuX3JlbWFpbmluZ0NvdW50ZXJbdGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4KytdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVuY3J5cHRlZDtcbiAgICB9XG5cbiAgICAvLyBEZWNyeXB0aW9uIGlzIHN5bWV0cmljXG4gICAgTW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5kZWNyeXB0ID0gTW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5lbmNyeXB0O1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFBhZGRpbmdcblxuICAgIC8vIFNlZTpodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjMxNVxuICAgIGZ1bmN0aW9uIHBrY3M3cGFkKGRhdGEpIHtcbiAgICAgICAgZGF0YSA9IGNvZXJjZUFycmF5KGRhdGEsIHRydWUpO1xuICAgICAgICB2YXIgcGFkZGVyID0gMTYgLSAoZGF0YS5sZW5ndGggJSAxNik7XG4gICAgICAgIHZhciByZXN1bHQgPSBjcmVhdGVBcnJheShkYXRhLmxlbmd0aCArIHBhZGRlcik7XG4gICAgICAgIGNvcHlBcnJheShkYXRhLCByZXN1bHQpO1xuICAgICAgICBmb3IgKHZhciBpID0gZGF0YS5sZW5ndGg7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHBhZGRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBrY3M3c3RyaXAoZGF0YSkge1xuICAgICAgICBkYXRhID0gY29lcmNlQXJyYXkoZGF0YSwgdHJ1ZSk7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA8IDE2KSB7IHRocm93IG5ldyBFcnJvcignUEtDUyM3IGludmFsaWQgbGVuZ3RoJyk7IH1cblxuICAgICAgICB2YXIgcGFkZGVyID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAocGFkZGVyID4gMTYpIHsgdGhyb3cgbmV3IEVycm9yKCdQS0NTIzcgcGFkZGluZyBieXRlIG91dCBvZiByYW5nZScpOyB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IGRhdGEubGVuZ3RoIC0gcGFkZGVyO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZGRlcjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtsZW5ndGggKyBpXSAhPT0gcGFkZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQS0NTIzcgaW52YWxpZCBwYWRkaW5nIGJ5dGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQgPSBjcmVhdGVBcnJheShsZW5ndGgpO1xuICAgICAgICBjb3B5QXJyYXkoZGF0YSwgcmVzdWx0LCAwLCAwLCBsZW5ndGgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gRXhwb3J0aW5nXG5cblxuICAgIC8vIFRoZSBibG9jayBjaXBoZXJcbiAgICB2YXIgYWVzanMgPSB7XG4gICAgICAgIEFFUzogQUVTLFxuICAgICAgICBDb3VudGVyOiBDb3VudGVyLFxuXG4gICAgICAgIE1vZGVPZk9wZXJhdGlvbjoge1xuICAgICAgICAgICAgZWNiOiBNb2RlT2ZPcGVyYXRpb25FQ0IsXG4gICAgICAgICAgICBjYmM6IE1vZGVPZk9wZXJhdGlvbkNCQyxcbiAgICAgICAgICAgIGNmYjogTW9kZU9mT3BlcmF0aW9uQ0ZCLFxuICAgICAgICAgICAgb2ZiOiBNb2RlT2ZPcGVyYXRpb25PRkIsXG4gICAgICAgICAgICBjdHI6IE1vZGVPZk9wZXJhdGlvbkNUUlxuICAgICAgICB9LFxuXG4gICAgICAgIHV0aWxzOiB7XG4gICAgICAgICAgICBoZXg6IGNvbnZlcnRIZXgsXG4gICAgICAgICAgICB1dGY4OiBjb252ZXJ0VXRmOFxuICAgICAgICB9LFxuXG4gICAgICAgIHBhZGRpbmc6IHtcbiAgICAgICAgICAgIHBrY3M3OiB7XG4gICAgICAgICAgICAgICAgcGFkOiBwa2NzN3BhZCxcbiAgICAgICAgICAgICAgICBzdHJpcDogcGtjczdzdHJpcFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9hcnJheVRlc3Q6IHtcbiAgICAgICAgICAgIGNvZXJjZUFycmF5OiBjb2VyY2VBcnJheSxcbiAgICAgICAgICAgIGNyZWF0ZUFycmF5OiBjcmVhdGVBcnJheSxcbiAgICAgICAgICAgIGNvcHlBcnJheTogY29weUFycmF5LFxuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLy8gbm9kZS5qc1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBhZXNqc1xuXG4gICAgLy8gUmVxdWlyZUpTL0FNRFxuICAgIC8vIGh0dHA6Ly93d3cucmVxdWlyZWpzLm9yZy9kb2NzL2FwaS5odG1sXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FtZGpzL2FtZGpzLWFwaS93aWtpL0FNRFxuICAgIH0gZWxzZSBpZiAodHlwZW9mKGRlZmluZSkgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkgeyByZXR1cm4gYWVzanM7IH0pO1xuXG4gICAgLy8gV2ViIEJyb3dzZXJzXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYW4gZXhpc3RpbmcgbGlicmFyeSBhdCBcImFlc2pzXCIgbWFrZSBzdXJlIGl0J3Mgc3RpbGwgYXZhaWxhYmxlXG4gICAgICAgIGlmIChyb290LmFlc2pzKSB7XG4gICAgICAgICAgICBhZXNqcy5fYWVzanMgPSByb290LmFlc2pzO1xuICAgICAgICB9XG5cbiAgICAgICAgcm9vdC5hZXNqcyA9IGFlc2pzO1xuICAgIH1cblxuXG59KSh0aGlzKTtcbiIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpKGZhbHNlKTtcbi8vIE1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuKiB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiByb3lhbGJsdWU7XFxuICB0ZXh0LWRlY29yYXRpb24tbGluZTogbm9uZTtcXG59XFxuXFxuYTp2aXNpdGVkIHtcXG4gIGNvbG9yOiByb3lhbGJsdWU7XFxufVxcblxcbmJ1dHRvbiB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDsgXFxuICBmb250LXNpemU6IGluaGVyaXQ7IFxcbiAgcGFkZGluZzogNXB4IDEwcHg7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuYnV0dG9uOmZvY3VzIHtcXG4gIG91dGxpbmU6IHNvbGlkIDFweCByb3lhbGJsdWU7XFxufVxcblxcbmxhYmVsIHtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG50ZXh0YXJlYSB7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjODg4O1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbn1cXG5cXG50ZXh0YXJlYTpmb2N1cyB7XFxuICBib3JkZXI6IDFweCBzb2xpZCByb3lhbGJsdWU7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG5ib2R5LCBodG1sIHtcXG4gIG1hcmdpbjogMDsgXFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJPcGVuIFNhbnNcXFwiO1xcbiAgZm9udC1zaXplOiAxNnB4OyBcXG59XFxuXFxuYm9keSB7XFxuICBkaXNwbGF5OiBncmlkOyBcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyOyBcXG59XFxuXFxuI3dyYXBwZXIge1xcbiAgbWF4LXdpZHRoOiA3MDBweDsgXFxuICBwYWRkaW5nOiAyMHB4O1xcbiAgbWFyZ2luLXRvcDogNTBweDtcXG4gIGRpc3BsYXk6IGdyaWQ7IFxcbiAganVzdGlmeS1pdGVtczogbGVmdDtcXG59XFxuXFxuI2Rlc2NyaXB0aW9uIHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuI2luc3RydWN0aW9ucyB7XFxuICBjb2xvcjogIzQ0NDtcXG4gIG1hcmdpbi10b3A6IDVweDtcXG4gIG1hcmdpbi1ib3R0b206IDI1cHg7XFxuICBmb250LXNpemU6IDAuOTVlbTtcXG4gIGxpc3Qtc3R5bGUtdHlwZTogc3F1YXJlOyBcXG59XFxuXFxuI3NvdXJjZSB7XFxuICBmb250LXNpemU6IHNtYWxsZXI7XFxuICBjb2xvcjogIzY2NjtcXG59XFxuXFxuI2ZpbGUtYnV0dG9uIHtcXG4gIG1hcmdpbi1yaWdodDogMjBweDtcXG59XFxuXFxuI2ZpbGUtaW5wdXQge1xcbiAgb3BhY2l0eTogMDsgXFxuICB3aWR0aDogMDsgXFxuICBoZWlnaHQ6IDA7IFxcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogMDsgXFxuICB0b3A6IDA7XFxufVxcblxcbiNlZGl0b3Itd3JhcHBlciB7XFxuICB3aWR0aDogMTAwJTsgXFxuICBtYXJnaW4tdG9wOiAxNXB4O1xcbn1cXG5cXG4jZWRpdG9yIHtcXG4gIGZvbnQtc2l6ZTogaW5oZXJpdDtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xcbiAgcGFkZGluZzogMTBweDtcXG4gIG1hcmdpbi10b3A6IDVweDtcXG4gIHdpZHRoOiAxMDAlOyBcXG4gIGhlaWdodDogNTAwcHg7XFxufVxcblxcbiNlZGl0b3ItYnV0dG9ucyB7XFxuICBtYXJnaW4tdG9wOiA1cHg7XFxuICBkaXNwbGF5OiBncmlkOyBcXG4gIGp1c3RpZnktaXRlbXM6IGxlZnQ7IFxcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIDFmciBhdXRvIGF1dG87XFxuICBncmlkLXRlbXBsYXRlLWFyZWFzOiBcXFwiYSBiIGMgZFxcXCI7IFxcbiAgZ3JpZC1jb2x1bW4tZ2FwOiAxMHB4O1xcbiAgZm9udC1zaXplOiAwLjk1ZW07XFxufVxcblxcbiNlZGl0b3ItYnV0dG9ucyA+IGJ1dHRvbjpudGgtY2hpbGQoMG4rMil7XFxuICBqdXN0aWZ5LXNlbGY6IHJpZ2h0O1xcbiAgZ3JpZC1hcmVhOiBjO1xcbn1cXG5cXG4jZWRpdG9yLWJ1dHRvbnMgPiBidXR0b246bnRoLWNoaWxkKDBuKzMpe1xcbiAganVzdGlmeS1zZWxmOiByaWdodDtcXG4gIGdyaWQtYXJlYTogZDtcXG59XFxuXFxuI2hpc3Rvcnkge1xcbiAgbWFyZ2luOiA1MHB4IDA7XFxufVxcblxcbiNoaXN0b3J5ID4gZGl2OmZpcnN0LWNoaWxkIHtcXG4gIGZvbnQtc2l6ZTogMS4yZW07XFxufVxcblxcbiNoaXN0b3J5ID4gZGl2Om50aC1jaGlsZCgwbisyKSB7XFxuICBmb250LXNpemU6IDAuOWVtO1xcbiAgY29sb3I6ICM3Nzc7XFxufVxcblxcbiNoaXN0b3J5ID4gdWwge1xcbiAgbGlzdC1zdHlsZTogbm9uZTsgXFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbiAgbWFyZ2luLXRvcDogMTBweDtcXG4gIGRpc3BsYXk6IGdyaWQ7IFxcbn1cXG5cXG4uaGlzdG9yeS1uYW1lIHtcXG4gIGNvbG9yOiByb3lhbGJsdWU7XFxufVxcblxcbi5oaXN0b3J5LWRhdGUge1xcbiAgZm9udC1zaXplOiAwLjhlbTtcXG59XFxuXFxuLmhpc3RvcnktaXRlbSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgXFxuICBwYWRkaW5nOiA1cHg7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuLmhpc3RvcnktaXRlbTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xcbn1cXG5cXG4uaGlzdG9yeS1pdGVtOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xcbn1cXG5cXG4jY292ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIxOSk7IFxcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogMDsgXFxuICB0b3A6IDA7XFxuICB3aWR0aDogMTAwdnc7IFxcbiAgaGVpZ2h0OiAxMDB2aDtcXG59XCIsIFwiXCJdKTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXNlU291cmNlTWFwKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgcmV0dXJuICdAbWVkaWEgJyArIGl0ZW1bMl0gKyAneycgKyBjb250ZW50ICsgJ30nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgfSkuam9pbignJyk7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiAobW9kdWxlcywgbWVkaWFRdWVyeSkge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsICcnXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGhpc1tpXVswXTtcblxuICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IG1vZHVsZXNbaV07IC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcbiAgICAgIC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG4gICAgICAvLyB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG4gICAgICAvLyBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cbiAgICAgIGlmIChpdGVtWzBdID09IG51bGwgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgaWYgKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWFRdWVyeTtcbiAgICAgICAgfSBlbHNlIGlmIChtZWRpYVF1ZXJ5KSB7XG4gICAgICAgICAgaXRlbVsyXSA9ICcoJyArIGl0ZW1bMl0gKyAnKSBhbmQgKCcgKyBtZWRpYVF1ZXJ5ICsgJyknO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgaWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn0gLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuXG5cbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuICB2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuICByZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufSIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgdmFyIGhhcyA9IHJlcXVpcmUoJy4vbGliL2hhcycpO1xuXG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7IC8qKi8gfVxuICB9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcihcbiAgICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICAgICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJyArXG4gICAgICAgICAgICAgICdUaGlzIG9mdGVuIGhhcHBlbnMgYmVjYXVzZSBvZiB0eXBvcyBzdWNoIGFzIGBQcm9wVHlwZXMuZnVuY3Rpb25gIGluc3RlYWQgb2YgYFByb3BUeXBlcy5mdW5jYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC1kb20uZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIE1ldGEgUGxhdGZvcm1zLCBJbmMuIGFuZCBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WICYmXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XG4gICAgZnVuY3Rpb24gdGVzdFN0cmluZ0NvZXJjaW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gXCJcIiArIHZhbHVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVQb3J0YWwkMShjaGlsZHJlbiwgY29udGFpbmVySW5mbywgaW1wbGVtZW50YXRpb24pIHtcbiAgICAgIHZhciBrZXkgPVxuICAgICAgICAzIDwgYXJndW1lbnRzLmxlbmd0aCAmJiB2b2lkIDAgIT09IGFyZ3VtZW50c1szXSA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG4gICAgICB0cnkge1xuICAgICAgICB0ZXN0U3RyaW5nQ29lcmNpb24oa2V5KTtcbiAgICAgICAgdmFyIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9ICExO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSAhMDtcbiAgICAgIH1cbiAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCAmJlxuICAgICAgICAoY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIlRoZSBwcm92aWRlZCBrZXkgaXMgYW4gdW5zdXBwb3J0ZWQgdHlwZSAlcy4gVGhpcyB2YWx1ZSBtdXN0IGJlIGNvZXJjZWQgdG8gYSBzdHJpbmcgYmVmb3JlIHVzaW5nIGl0IGhlcmUuXCIsXG4gICAgICAgICAgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIFN5bWJvbCAmJlxuICAgICAgICAgICAgU3ltYm9sLnRvU3RyaW5nVGFnICYmXG4gICAgICAgICAgICBrZXlbU3ltYm9sLnRvU3RyaW5nVGFnXSkgfHxcbiAgICAgICAgICAgIGtleS5jb25zdHJ1Y3Rvci5uYW1lIHx8XG4gICAgICAgICAgICBcIk9iamVjdFwiXG4gICAgICAgICksXG4gICAgICAgIHRlc3RTdHJpbmdDb2VyY2lvbihrZXkpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICQkdHlwZW9mOiBSRUFDVF9QT1JUQUxfVFlQRSxcbiAgICAgICAga2V5OiBudWxsID09IGtleSA/IG51bGwgOiBcIlwiICsga2V5LFxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgIGNvbnRhaW5lckluZm86IGNvbnRhaW5lckluZm8sXG4gICAgICAgIGltcGxlbWVudGF0aW9uOiBpbXBsZW1lbnRhdGlvblxuICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Q3Jvc3NPcmlnaW5TdHJpbmdBcyhhcywgaW5wdXQpIHtcbiAgICAgIGlmIChcImZvbnRcIiA9PT0gYXMpIHJldHVybiBcIlwiO1xuICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBpbnB1dClcbiAgICAgICAgcmV0dXJuIFwidXNlLWNyZWRlbnRpYWxzXCIgPT09IGlucHV0ID8gaW5wdXQgOiBcIlwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKHRoaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbCA9PT0gdGhpbmdcbiAgICAgICAgPyBcImBudWxsYFwiXG4gICAgICAgIDogdm9pZCAwID09PSB0aGluZ1xuICAgICAgICAgID8gXCJgdW5kZWZpbmVkYFwiXG4gICAgICAgICAgOiBcIlwiID09PSB0aGluZ1xuICAgICAgICAgICAgPyBcImFuIGVtcHR5IHN0cmluZ1wiXG4gICAgICAgICAgICA6ICdzb21ldGhpbmcgd2l0aCB0eXBlIFwiJyArIHR5cGVvZiB0aGluZyArICdcIic7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ0VudW1Gb3JXYXJuaW5nKHRoaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbCA9PT0gdGhpbmdcbiAgICAgICAgPyBcImBudWxsYFwiXG4gICAgICAgIDogdm9pZCAwID09PSB0aGluZ1xuICAgICAgICAgID8gXCJgdW5kZWZpbmVkYFwiXG4gICAgICAgICAgOiBcIlwiID09PSB0aGluZ1xuICAgICAgICAgICAgPyBcImFuIGVtcHR5IHN0cmluZ1wiXG4gICAgICAgICAgICA6IFwic3RyaW5nXCIgPT09IHR5cGVvZiB0aGluZ1xuICAgICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KHRoaW5nKVxuICAgICAgICAgICAgICA6IFwibnVtYmVyXCIgPT09IHR5cGVvZiB0aGluZ1xuICAgICAgICAgICAgICAgID8gXCJgXCIgKyB0aGluZyArIFwiYFwiXG4gICAgICAgICAgICAgICAgOiAnc29tZXRoaW5nIHdpdGggdHlwZSBcIicgKyB0eXBlb2YgdGhpbmcgKyAnXCInO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgICAgIHZhciBkaXNwYXRjaGVyID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSDtcbiAgICAgIG51bGwgPT09IGRpc3BhdGNoZXIgJiZcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIkludmFsaWQgaG9vayBjYWxsLiBIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIG9mIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LiBUaGlzIGNvdWxkIGhhcHBlbiBmb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG4xLiBZb3UgbWlnaHQgaGF2ZSBtaXNtYXRjaGluZyB2ZXJzaW9ucyBvZiBSZWFjdCBhbmQgdGhlIHJlbmRlcmVyIChzdWNoIGFzIFJlYWN0IERPTSlcXG4yLiBZb3UgbWlnaHQgYmUgYnJlYWtpbmcgdGhlIFJ1bGVzIG9mIEhvb2tzXFxuMy4gWW91IG1pZ2h0IGhhdmUgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIFJlYWN0IGluIHRoZSBzYW1lIGFwcFxcblNlZSBodHRwczovL3JlYWN0LmRldi9saW5rL2ludmFsaWQtaG9vay1jYWxsIGZvciB0aXBzIGFib3V0IGhvdyB0byBkZWJ1ZyBhbmQgZml4IHRoaXMgcHJvYmxlbS5cIlxuICAgICAgICApO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoZXI7XG4gICAgfVxuICAgIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT1cbiAgICAgICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQgJiZcbiAgICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQoRXJyb3IoKSk7XG4gICAgdmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpLFxuICAgICAgSW50ZXJuYWxzID0ge1xuICAgICAgICBkOiB7XG4gICAgICAgICAgZjogbm9vcCxcbiAgICAgICAgICByOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgXCJJbnZhbGlkIGZvcm0gZWxlbWVudC4gcmVxdWVzdEZvcm1SZXNldCBtdXN0IGJlIHBhc3NlZCBhIGZvcm0gdGhhdCB3YXMgcmVuZGVyZWQgYnkgUmVhY3QuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBEOiBub29wLFxuICAgICAgICAgIEM6IG5vb3AsXG4gICAgICAgICAgTDogbm9vcCxcbiAgICAgICAgICBtOiBub29wLFxuICAgICAgICAgIFg6IG5vb3AsXG4gICAgICAgICAgUzogbm9vcCxcbiAgICAgICAgICBNOiBub29wXG4gICAgICAgIH0sXG4gICAgICAgIHA6IDAsXG4gICAgICAgIGZpbmRET01Ob2RlOiBudWxsXG4gICAgICB9LFxuICAgICAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QucG9ydGFsXCIpLFxuICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPVxuICAgICAgICBSZWFjdC5fX0NMSUVOVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9XQVJOX1VTRVJTX1RIRVlfQ0FOTk9UX1VQR1JBREU7XG4gICAgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIE1hcCAmJlxuICAgICAgbnVsbCAhPSBNYXAucHJvdG90eXBlICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBNYXAucHJvdG90eXBlLmZvckVhY2ggJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIFNldCAmJlxuICAgICAgbnVsbCAhPSBTZXQucHJvdG90eXBlICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBTZXQucHJvdG90eXBlLmNsZWFyICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBTZXQucHJvdG90eXBlLmZvckVhY2gpIHx8XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIlJlYWN0IGRlcGVuZHMgb24gTWFwIGFuZCBTZXQgYnVpbHQtaW4gdHlwZXMuIE1ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgcG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vcmVhY3Rqcy5vcmcvbGluay9yZWFjdC1wb2x5ZmlsbHNcIlxuICAgICAgKTtcbiAgICBleHBvcnRzLl9fRE9NX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1dBUk5fVVNFUlNfVEhFWV9DQU5OT1RfVVBHUkFERSA9XG4gICAgICBJbnRlcm5hbHM7XG4gICAgZXhwb3J0cy5jcmVhdGVQb3J0YWwgPSBmdW5jdGlvbiAoY2hpbGRyZW4sIGNvbnRhaW5lcikge1xuICAgICAgdmFyIGtleSA9XG4gICAgICAgIDIgPCBhcmd1bWVudHMubGVuZ3RoICYmIHZvaWQgMCAhPT0gYXJndW1lbnRzWzJdID8gYXJndW1lbnRzWzJdIDogbnVsbDtcbiAgICAgIGlmIChcbiAgICAgICAgIWNvbnRhaW5lciB8fFxuICAgICAgICAoMSAhPT0gY29udGFpbmVyLm5vZGVUeXBlICYmXG4gICAgICAgICAgOSAhPT0gY29udGFpbmVyLm5vZGVUeXBlICYmXG4gICAgICAgICAgMTEgIT09IGNvbnRhaW5lci5ub2RlVHlwZSlcbiAgICAgIClcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJUYXJnZXQgY29udGFpbmVyIGlzIG5vdCBhIERPTSBlbGVtZW50LlwiKTtcbiAgICAgIHJldHVybiBjcmVhdGVQb3J0YWwkMShjaGlsZHJlbiwgY29udGFpbmVyLCBudWxsLCBrZXkpO1xuICAgIH07XG4gICAgZXhwb3J0cy5mbHVzaFN5bmMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHZhciBwcmV2aW91c1RyYW5zaXRpb24gPSBSZWFjdFNoYXJlZEludGVybmFscy5ULFxuICAgICAgICBwcmV2aW91c1VwZGF0ZVByaW9yaXR5ID0gSW50ZXJuYWxzLnA7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoKChSZWFjdFNoYXJlZEludGVybmFscy5UID0gbnVsbCksIChJbnRlcm5hbHMucCA9IDIpLCBmbikpXG4gICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCA9IHByZXZpb3VzVHJhbnNpdGlvbiksXG4gICAgICAgICAgKEludGVybmFscy5wID0gcHJldmlvdXNVcGRhdGVQcmlvcml0eSksXG4gICAgICAgICAgSW50ZXJuYWxzLmQuZigpICYmXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcImZsdXNoU3luYyB3YXMgY2FsbGVkIGZyb20gaW5zaWRlIGEgbGlmZWN5Y2xlIG1ldGhvZC4gUmVhY3QgY2Fubm90IGZsdXNoIHdoZW4gUmVhY3QgaXMgYWxyZWFkeSByZW5kZXJpbmcuIENvbnNpZGVyIG1vdmluZyB0aGlzIGNhbGwgdG8gYSBzY2hlZHVsZXIgdGFzayBvciBtaWNybyB0YXNrLlwiXG4gICAgICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gICAgZXhwb3J0cy5wcmVjb25uZWN0ID0gZnVuY3Rpb24gKGhyZWYsIG9wdGlvbnMpIHtcbiAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIGhyZWZcbiAgICAgICAgPyBudWxsICE9IG9wdGlvbnMgJiYgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgICA/IGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiUmVhY3RET00ucHJlY29ubmVjdCgpOiBFeHBlY3RlZCB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IChzZWNvbmQpIHRvIGJlIGFuIG9iamVjdCBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC4gVGhlIG9ubHkgc3VwcG9ydGVkIG9wdGlvbiBhdCB0aGlzIHRpbWUgaXMgYGNyb3NzT3JpZ2luYCB3aGljaCBhY2NlcHRzIGEgc3RyaW5nLlwiLFxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogbnVsbCAhPSBvcHRpb25zICYmXG4gICAgICAgICAgICBcInN0cmluZ1wiICE9PSB0eXBlb2Ygb3B0aW9ucy5jcm9zc09yaWdpbiAmJlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVjb25uZWN0KCk6IEV4cGVjdGVkIHRoZSBgY3Jvc3NPcmlnaW5gIG9wdGlvbiAoc2Vjb25kIGFyZ3VtZW50KSB0byBiZSBhIHN0cmluZyBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC4gVHJ5IHJlbW92aW5nIHRoaXMgb3B0aW9uIG9yIHBhc3NpbmcgYSBzdHJpbmcgdmFsdWUgaW5zdGVhZC5cIixcbiAgICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhvcHRpb25zLmNyb3NzT3JpZ2luKVxuICAgICAgICAgICAgKVxuICAgICAgICA6IGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBcIlJlYWN0RE9NLnByZWNvbm5lY3QoKTogRXhwZWN0ZWQgdGhlIGBocmVmYCBhcmd1bWVudCAoZmlyc3QpIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZyBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC5cIixcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcoaHJlZilcbiAgICAgICAgICApO1xuICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYgJiZcbiAgICAgICAgKG9wdGlvbnNcbiAgICAgICAgICA/ICgob3B0aW9ucyA9IG9wdGlvbnMuY3Jvc3NPcmlnaW4pLFxuICAgICAgICAgICAgKG9wdGlvbnMgPVxuICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9uc1xuICAgICAgICAgICAgICAgID8gXCJ1c2UtY3JlZGVudGlhbHNcIiA9PT0gb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgPyBvcHRpb25zXG4gICAgICAgICAgICAgICAgICA6IFwiXCJcbiAgICAgICAgICAgICAgICA6IHZvaWQgMCkpXG4gICAgICAgICAgOiAob3B0aW9ucyA9IG51bGwpLFxuICAgICAgICBJbnRlcm5hbHMuZC5DKGhyZWYsIG9wdGlvbnMpKTtcbiAgICB9O1xuICAgIGV4cG9ydHMucHJlZmV0Y2hETlMgPSBmdW5jdGlvbiAoaHJlZikge1xuICAgICAgaWYgKFwic3RyaW5nXCIgIT09IHR5cGVvZiBocmVmIHx8ICFocmVmKVxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiUmVhY3RET00ucHJlZmV0Y2hETlMoKTogRXhwZWN0ZWQgdGhlIGBocmVmYCBhcmd1bWVudCAoZmlyc3QpIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZyBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC5cIixcbiAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpXG4gICAgICAgICk7XG4gICAgICBlbHNlIGlmICgxIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcImNyb3NzT3JpZ2luXCIpXG4gICAgICAgICAgPyBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlJlYWN0RE9NLnByZWZldGNoRE5TKCk6IEV4cGVjdGVkIG9ubHkgb25lIGFyZ3VtZW50LCBgaHJlZmAsIGJ1dCBlbmNvdW50ZXJlZCAlcyBhcyBhIHNlY29uZCBhcmd1bWVudCBpbnN0ZWFkLiBUaGlzIGFyZ3VtZW50IGlzIHJlc2VydmVkIGZvciBmdXR1cmUgb3B0aW9ucyBhbmQgaXMgY3VycmVudGx5IGRpc2FsbG93ZWQuIEl0IGxvb2tzIGxpa2UgdGhlIHlvdSBhcmUgYXR0ZW1wdGluZyB0byBzZXQgYSBjcm9zc09yaWdpbiBwcm9wZXJ0eSBmb3IgdGhpcyBETlMgbG9va3VwIGhpbnQuIEJyb3dzZXJzIGRvIG5vdCBwZXJmb3JtIEROUyBxdWVyaWVzIHVzaW5nIENPUlMgYW5kIHNldHRpbmcgdGhpcyBhdHRyaWJ1dGUgb24gdGhlIHJlc291cmNlIGhpbnQgaGFzIG5vIGVmZmVjdC4gVHJ5IGNhbGxpbmcgUmVhY3RET00ucHJlZmV0Y2hETlMoKSB3aXRoIGp1c3QgYSBzaW5nbGUgc3RyaW5nIGFyZ3VtZW50LCBgaHJlZmAuXCIsXG4gICAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ0VudW1Gb3JXYXJuaW5nKG9wdGlvbnMpXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlJlYWN0RE9NLnByZWZldGNoRE5TKCk6IEV4cGVjdGVkIG9ubHkgb25lIGFyZ3VtZW50LCBgaHJlZmAsIGJ1dCBlbmNvdW50ZXJlZCAlcyBhcyBhIHNlY29uZCBhcmd1bWVudCBpbnN0ZWFkLiBUaGlzIGFyZ3VtZW50IGlzIHJlc2VydmVkIGZvciBmdXR1cmUgb3B0aW9ucyBhbmQgaXMgY3VycmVudGx5IGRpc2FsbG93ZWQuIFRyeSBjYWxsaW5nIFJlYWN0RE9NLnByZWZldGNoRE5TKCkgd2l0aCBqdXN0IGEgc2luZ2xlIHN0cmluZyBhcmd1bWVudCwgYGhyZWZgLlwiLFxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zKVxuICAgICAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIEludGVybmFscy5kLkQoaHJlZik7XG4gICAgfTtcbiAgICBleHBvcnRzLnByZWluaXQgPSBmdW5jdGlvbiAoaHJlZiwgb3B0aW9ucykge1xuICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYgJiYgaHJlZlxuICAgICAgICA/IG51bGwgPT0gb3B0aW9ucyB8fCBcIm9iamVjdFwiICE9PSB0eXBlb2Ygb3B0aW9uc1xuICAgICAgICAgID8gY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJSZWFjdERPTS5wcmVpbml0KCk6IEV4cGVjdGVkIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgKHNlY29uZCkgdG8gYmUgYW4gb2JqZWN0IHdpdGggYW4gYGFzYCBwcm9wZXJ0eSBkZXNjcmliaW5nIHRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGJlIHByZWluaXRpYWxpemVkIGJ1dCBlbmNvdW50ZXJlZCAlcyBpbnN0ZWFkLlwiLFxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogXCJzdHlsZVwiICE9PSBvcHRpb25zLmFzICYmXG4gICAgICAgICAgICBcInNjcmlwdFwiICE9PSBvcHRpb25zLmFzICYmXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAnUmVhY3RET00ucHJlaW5pdCgpOiBFeHBlY3RlZCB0aGUgYGFzYCBwcm9wZXJ0eSBpbiB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IChzZWNvbmQpIHRvIGNvbnRhaW4gYSB2YWxpZCB2YWx1ZSBkZXNjcmliaW5nIHRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGJlIHByZWluaXRpYWxpemVkIGJ1dCBlbmNvdW50ZXJlZCAlcyBpbnN0ZWFkLiBWYWxpZCB2YWx1ZXMgZm9yIGBhc2AgYXJlIFwic3R5bGVcIiBhbmQgXCJzY3JpcHRcIi4nLFxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zLmFzKVxuICAgICAgICAgICAgKVxuICAgICAgICA6IGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBcIlJlYWN0RE9NLnByZWluaXQoKTogRXhwZWN0ZWQgdGhlIGBocmVmYCBhcmd1bWVudCAoZmlyc3QpIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZyBidXQgZW5jb3VudGVyZWQgJXMgaW5zdGVhZC5cIixcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcoaHJlZilcbiAgICAgICAgICApO1xuICAgICAgaWYgKFxuICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJlxuICAgICAgICBvcHRpb25zICYmXG4gICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmFzXG4gICAgICApIHtcbiAgICAgICAgdmFyIGFzID0gb3B0aW9ucy5hcyxcbiAgICAgICAgICBjcm9zc09yaWdpbiA9IGdldENyb3NzT3JpZ2luU3RyaW5nQXMoYXMsIG9wdGlvbnMuY3Jvc3NPcmlnaW4pLFxuICAgICAgICAgIGludGVncml0eSA9XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5pbnRlZ3JpdHkgPyBvcHRpb25zLmludGVncml0eSA6IHZvaWQgMCxcbiAgICAgICAgICBmZXRjaFByaW9yaXR5ID1cbiAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmZldGNoUHJpb3JpdHlcbiAgICAgICAgICAgICAgPyBvcHRpb25zLmZldGNoUHJpb3JpdHlcbiAgICAgICAgICAgICAgOiB2b2lkIDA7XG4gICAgICAgIFwic3R5bGVcIiA9PT0gYXNcbiAgICAgICAgICA/IEludGVybmFscy5kLlMoXG4gICAgICAgICAgICAgIGhyZWYsXG4gICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLnByZWNlZGVuY2VcbiAgICAgICAgICAgICAgICA/IG9wdGlvbnMucHJlY2VkZW5jZVxuICAgICAgICAgICAgICAgIDogdm9pZCAwLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IGNyb3NzT3JpZ2luLFxuICAgICAgICAgICAgICAgIGludGVncml0eTogaW50ZWdyaXR5LFxuICAgICAgICAgICAgICAgIGZldGNoUHJpb3JpdHk6IGZldGNoUHJpb3JpdHlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogXCJzY3JpcHRcIiA9PT0gYXMgJiZcbiAgICAgICAgICAgIEludGVybmFscy5kLlgoaHJlZiwge1xuICAgICAgICAgICAgICBjcm9zc09yaWdpbjogY3Jvc3NPcmlnaW4sXG4gICAgICAgICAgICAgIGludGVncml0eTogaW50ZWdyaXR5LFxuICAgICAgICAgICAgICBmZXRjaFByaW9yaXR5OiBmZXRjaFByaW9yaXR5LFxuICAgICAgICAgICAgICBub25jZTogXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMubm9uY2UgPyBvcHRpb25zLm5vbmNlIDogdm9pZCAwXG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV4cG9ydHMucHJlaW5pdE1vZHVsZSA9IGZ1bmN0aW9uIChocmVmLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZW5jb3VudGVyZWQgPSBcIlwiO1xuICAgICAgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIGhyZWYpIHx8XG4gICAgICAgIChlbmNvdW50ZXJlZCArPVxuICAgICAgICAgIFwiIFRoZSBgaHJlZmAgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpICtcbiAgICAgICAgICBcIi5cIik7XG4gICAgICB2b2lkIDAgIT09IG9wdGlvbnMgJiYgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgPyAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgb3B0aW9uc2AgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucykgK1xuICAgICAgICAgICAgXCIuXCIpXG4gICAgICAgIDogb3B0aW9ucyAmJlxuICAgICAgICAgIFwiYXNcIiBpbiBvcHRpb25zICYmXG4gICAgICAgICAgXCJzY3JpcHRcIiAhPT0gb3B0aW9ucy5hcyAmJlxuICAgICAgICAgIChlbmNvdW50ZXJlZCArPVxuICAgICAgICAgICAgXCIgVGhlIGBhc2Agb3B0aW9uIGVuY291bnRlcmVkIHdhcyBcIiArXG4gICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhvcHRpb25zLmFzKSArXG4gICAgICAgICAgICBcIi5cIik7XG4gICAgICBpZiAoZW5jb3VudGVyZWQpXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJSZWFjdERPTS5wcmVpbml0TW9kdWxlKCk6IEV4cGVjdGVkIHVwIHRvIHR3byBhcmd1bWVudHMsIGEgbm9uLWVtcHR5IGBocmVmYCBzdHJpbmcgYW5kLCBvcHRpb25hbGx5LCBhbiBgb3B0aW9uc2Agb2JqZWN0IHdpdGggYSB2YWxpZCBgYXNgIHByb3BlcnR5LiVzXCIsXG4gICAgICAgICAgZW5jb3VudGVyZWRcbiAgICAgICAgKTtcbiAgICAgIGVsc2VcbiAgICAgICAgc3dpdGNoIChcbiAgICAgICAgICAoKGVuY291bnRlcmVkID1cbiAgICAgICAgICAgIG9wdGlvbnMgJiYgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuYXMgPyBvcHRpb25zLmFzIDogXCJzY3JpcHRcIiksXG4gICAgICAgICAgZW5jb3VudGVyZWQpXG4gICAgICAgICkge1xuICAgICAgICAgIGNhc2UgXCJzY3JpcHRcIjpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAoZW5jb3VudGVyZWQgPVxuICAgICAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdFbnVtRm9yV2FybmluZyhlbmNvdW50ZXJlZCkpLFxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICdSZWFjdERPTS5wcmVpbml0TW9kdWxlKCk6IEN1cnJlbnRseSB0aGUgb25seSBzdXBwb3J0ZWQgXCJhc1wiIHR5cGUgZm9yIHRoaXMgZnVuY3Rpb24gaXMgXCJzY3JpcHRcIiBidXQgcmVjZWl2ZWQgXCIlc1wiIGluc3RlYWQuIFRoaXMgd2FybmluZyB3YXMgZ2VuZXJhdGVkIGZvciBgaHJlZmAgXCIlc1wiLiBJbiB0aGUgZnV0dXJlIG90aGVyIG1vZHVsZSB0eXBlcyB3aWxsIGJlIHN1cHBvcnRlZCwgYWxpZ25pbmcgd2l0aCB0aGUgaW1wb3J0LWF0dHJpYnV0ZXMgcHJvcG9zYWwuIExlYXJuIG1vcmUgaGVyZTogKGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWltcG9ydC1hdHRyaWJ1dGVzKScsXG4gICAgICAgICAgICAgICAgZW5jb3VudGVyZWQsXG4gICAgICAgICAgICAgICAgaHJlZlxuICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYpXG4gICAgICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2Ygb3B0aW9ucyAmJiBudWxsICE9PSBvcHRpb25zKSB7XG4gICAgICAgICAgaWYgKG51bGwgPT0gb3B0aW9ucy5hcyB8fCBcInNjcmlwdFwiID09PSBvcHRpb25zLmFzKVxuICAgICAgICAgICAgKGVuY291bnRlcmVkID0gZ2V0Q3Jvc3NPcmlnaW5TdHJpbmdBcyhcbiAgICAgICAgICAgICAgb3B0aW9ucy5hcyxcbiAgICAgICAgICAgICAgb3B0aW9ucy5jcm9zc09yaWdpblxuICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgIEludGVybmFscy5kLk0oaHJlZiwge1xuICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiBlbmNvdW50ZXJlZCxcbiAgICAgICAgICAgICAgICBpbnRlZ3JpdHk6XG4gICAgICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5pbnRlZ3JpdHlcbiAgICAgICAgICAgICAgICAgICAgPyBvcHRpb25zLmludGVncml0eVxuICAgICAgICAgICAgICAgICAgICA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgICBub25jZTpcbiAgICAgICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLm5vbmNlID8gb3B0aW9ucy5ub25jZSA6IHZvaWQgMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIG51bGwgPT0gb3B0aW9ucyAmJiBJbnRlcm5hbHMuZC5NKGhyZWYpO1xuICAgIH07XG4gICAgZXhwb3J0cy5wcmVsb2FkID0gZnVuY3Rpb24gKGhyZWYsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBlbmNvdW50ZXJlZCA9IFwiXCI7XG4gICAgICAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGhyZWYgJiYgaHJlZikgfHxcbiAgICAgICAgKGVuY291bnRlcmVkICs9XG4gICAgICAgICAgXCIgVGhlIGBocmVmYCBhcmd1bWVudCBlbmNvdW50ZXJlZCB3YXMgXCIgK1xuICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcoaHJlZikgK1xuICAgICAgICAgIFwiLlwiKTtcbiAgICAgIG51bGwgPT0gb3B0aW9ucyB8fCBcIm9iamVjdFwiICE9PSB0eXBlb2Ygb3B0aW9uc1xuICAgICAgICA/IChlbmNvdW50ZXJlZCArPVxuICAgICAgICAgICAgXCIgVGhlIGBvcHRpb25zYCBhcmd1bWVudCBlbmNvdW50ZXJlZCB3YXMgXCIgK1xuICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhvcHRpb25zKSArXG4gICAgICAgICAgICBcIi5cIilcbiAgICAgICAgOiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuYXMgJiYgb3B0aW9ucy5hcykgfHxcbiAgICAgICAgICAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgYXNgIG9wdGlvbiBlbmNvdW50ZXJlZCB3YXMgXCIgK1xuICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhvcHRpb25zLmFzKSArXG4gICAgICAgICAgICBcIi5cIik7XG4gICAgICBlbmNvdW50ZXJlZCAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdSZWFjdERPTS5wcmVsb2FkKCk6IEV4cGVjdGVkIHR3byBhcmd1bWVudHMsIGEgbm9uLWVtcHR5IGBocmVmYCBzdHJpbmcgYW5kIGFuIGBvcHRpb25zYCBvYmplY3Qgd2l0aCBhbiBgYXNgIHByb3BlcnR5IHZhbGlkIGZvciBhIGA8bGluayByZWw9XCJwcmVsb2FkXCIgYXM9XCIuLi5cIiAvPmAgdGFnLiVzJyxcbiAgICAgICAgICBlbmNvdW50ZXJlZFxuICAgICAgICApO1xuICAgICAgaWYgKFxuICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgaHJlZiAmJlxuICAgICAgICBcIm9iamVjdFwiID09PSB0eXBlb2Ygb3B0aW9ucyAmJlxuICAgICAgICBudWxsICE9PSBvcHRpb25zICYmXG4gICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmFzXG4gICAgICApIHtcbiAgICAgICAgZW5jb3VudGVyZWQgPSBvcHRpb25zLmFzO1xuICAgICAgICB2YXIgY3Jvc3NPcmlnaW4gPSBnZXRDcm9zc09yaWdpblN0cmluZ0FzKFxuICAgICAgICAgIGVuY291bnRlcmVkLFxuICAgICAgICAgIG9wdGlvbnMuY3Jvc3NPcmlnaW5cbiAgICAgICAgKTtcbiAgICAgICAgSW50ZXJuYWxzLmQuTChocmVmLCBlbmNvdW50ZXJlZCwge1xuICAgICAgICAgIGNyb3NzT3JpZ2luOiBjcm9zc09yaWdpbixcbiAgICAgICAgICBpbnRlZ3JpdHk6XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5pbnRlZ3JpdHkgPyBvcHRpb25zLmludGVncml0eSA6IHZvaWQgMCxcbiAgICAgICAgICBub25jZTogXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMubm9uY2UgPyBvcHRpb25zLm5vbmNlIDogdm9pZCAwLFxuICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLnR5cGUgPyBvcHRpb25zLnR5cGUgOiB2b2lkIDAsXG4gICAgICAgICAgZmV0Y2hQcmlvcml0eTpcbiAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmZldGNoUHJpb3JpdHlcbiAgICAgICAgICAgICAgPyBvcHRpb25zLmZldGNoUHJpb3JpdHlcbiAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgcmVmZXJyZXJQb2xpY3k6XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5yZWZlcnJlclBvbGljeVxuICAgICAgICAgICAgICA/IG9wdGlvbnMucmVmZXJyZXJQb2xpY3lcbiAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgaW1hZ2VTcmNTZXQ6XG4gICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucy5pbWFnZVNyY1NldFxuICAgICAgICAgICAgICA/IG9wdGlvbnMuaW1hZ2VTcmNTZXRcbiAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgaW1hZ2VTaXplczpcbiAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLmltYWdlU2l6ZXNcbiAgICAgICAgICAgICAgPyBvcHRpb25zLmltYWdlU2l6ZXNcbiAgICAgICAgICAgICAgOiB2b2lkIDAsXG4gICAgICAgICAgbWVkaWE6IFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zLm1lZGlhID8gb3B0aW9ucy5tZWRpYSA6IHZvaWQgMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV4cG9ydHMucHJlbG9hZE1vZHVsZSA9IGZ1bmN0aW9uIChocmVmLCBvcHRpb25zKSB7XG4gICAgICB2YXIgZW5jb3VudGVyZWQgPSBcIlwiO1xuICAgICAgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmIGhyZWYpIHx8XG4gICAgICAgIChlbmNvdW50ZXJlZCArPVxuICAgICAgICAgIFwiIFRoZSBgaHJlZmAgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICBnZXRWYWx1ZURlc2NyaXB0b3JFeHBlY3RpbmdPYmplY3RGb3JXYXJuaW5nKGhyZWYpICtcbiAgICAgICAgICBcIi5cIik7XG4gICAgICB2b2lkIDAgIT09IG9wdGlvbnMgJiYgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9wdGlvbnNcbiAgICAgICAgPyAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgb3B0aW9uc2AgYXJndW1lbnQgZW5jb3VudGVyZWQgd2FzIFwiICtcbiAgICAgICAgICAgIGdldFZhbHVlRGVzY3JpcHRvckV4cGVjdGluZ09iamVjdEZvcldhcm5pbmcob3B0aW9ucykgK1xuICAgICAgICAgICAgXCIuXCIpXG4gICAgICAgIDogb3B0aW9ucyAmJlxuICAgICAgICAgIFwiYXNcIiBpbiBvcHRpb25zICYmXG4gICAgICAgICAgXCJzdHJpbmdcIiAhPT0gdHlwZW9mIG9wdGlvbnMuYXMgJiZcbiAgICAgICAgICAoZW5jb3VudGVyZWQgKz1cbiAgICAgICAgICAgIFwiIFRoZSBgYXNgIG9wdGlvbiBlbmNvdW50ZXJlZCB3YXMgXCIgK1xuICAgICAgICAgICAgZ2V0VmFsdWVEZXNjcmlwdG9yRXhwZWN0aW5nT2JqZWN0Rm9yV2FybmluZyhvcHRpb25zLmFzKSArXG4gICAgICAgICAgICBcIi5cIik7XG4gICAgICBlbmNvdW50ZXJlZCAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdSZWFjdERPTS5wcmVsb2FkTW9kdWxlKCk6IEV4cGVjdGVkIHR3byBhcmd1bWVudHMsIGEgbm9uLWVtcHR5IGBocmVmYCBzdHJpbmcgYW5kLCBvcHRpb25hbGx5LCBhbiBgb3B0aW9uc2Agb2JqZWN0IHdpdGggYW4gYGFzYCBwcm9wZXJ0eSB2YWxpZCBmb3IgYSBgPGxpbmsgcmVsPVwibW9kdWxlcHJlbG9hZFwiIGFzPVwiLi4uXCIgLz5gIHRhZy4lcycsXG4gICAgICAgICAgZW5jb3VudGVyZWRcbiAgICAgICAgKTtcbiAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBocmVmICYmXG4gICAgICAgIChvcHRpb25zXG4gICAgICAgICAgPyAoKGVuY291bnRlcmVkID0gZ2V0Q3Jvc3NPcmlnaW5TdHJpbmdBcyhcbiAgICAgICAgICAgICAgb3B0aW9ucy5hcyxcbiAgICAgICAgICAgICAgb3B0aW9ucy5jcm9zc09yaWdpblxuICAgICAgICAgICAgKSksXG4gICAgICAgICAgICBJbnRlcm5hbHMuZC5tKGhyZWYsIHtcbiAgICAgICAgICAgICAgYXM6XG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuYXMgJiYgXCJzY3JpcHRcIiAhPT0gb3B0aW9ucy5hc1xuICAgICAgICAgICAgICAgICAgPyBvcHRpb25zLmFzXG4gICAgICAgICAgICAgICAgICA6IHZvaWQgMCxcbiAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IGVuY291bnRlcmVkLFxuICAgICAgICAgICAgICBpbnRlZ3JpdHk6XG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMuaW50ZWdyaXR5XG4gICAgICAgICAgICAgICAgICA/IG9wdGlvbnMuaW50ZWdyaXR5XG4gICAgICAgICAgICAgICAgICA6IHZvaWQgMFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgOiBJbnRlcm5hbHMuZC5tKGhyZWYpKTtcbiAgICB9O1xuICAgIGV4cG9ydHMucmVxdWVzdEZvcm1SZXNldCA9IGZ1bmN0aW9uIChmb3JtKSB7XG4gICAgICBJbnRlcm5hbHMuZC5yKGZvcm0pO1xuICAgIH07XG4gICAgZXhwb3J0cy51bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyA9IGZ1bmN0aW9uIChmbiwgYSkge1xuICAgICAgcmV0dXJuIGZuKGEpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VGb3JtU3RhdGUgPSBmdW5jdGlvbiAoYWN0aW9uLCBpbml0aWFsU3RhdGUsIHBlcm1hbGluaykge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlRm9ybVN0YXRlKGFjdGlvbiwgaW5pdGlhbFN0YXRlLCBwZXJtYWxpbmspO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VGb3JtU3RhdHVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlSG9zdFRyYW5zaXRpb25TdGF0dXMoKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudmVyc2lvbiA9IFwiMTkuMS4xXCI7XG4gICAgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAmJlxuICAgICAgXCJmdW5jdGlvblwiID09PVxuICAgICAgICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdG9wICYmXG4gICAgICBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18ucmVnaXN0ZXJJbnRlcm5hbE1vZHVsZVN0b3AoRXJyb3IoKSk7XG4gIH0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGNoZWNrRENFKCkge1xuICAvKiBnbG9iYWwgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICovXG4gIGlmIChcbiAgICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fID09PSAndW5kZWZpbmVkJyB8fFxuICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18uY2hlY2tEQ0UgIT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgLy8gVGhpcyBicmFuY2ggaXMgdW5yZWFjaGFibGUgYmVjYXVzZSB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkXG4gICAgLy8gaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBjb25kaXRpb24gaXMgdHJ1ZSBvbmx5IGluIGRldmVsb3BtZW50LlxuICAgIC8vIFRoZXJlZm9yZSBpZiB0aGUgYnJhbmNoIGlzIHN0aWxsIGhlcmUsIGRlYWQgY29kZSBlbGltaW5hdGlvbiB3YXNuJ3RcbiAgICAvLyBwcm9wZXJseSBhcHBsaWVkLlxuICAgIC8vIERvbid0IGNoYW5nZSB0aGUgbWVzc2FnZS4gUmVhY3QgRGV2VG9vbHMgcmVsaWVzIG9uIGl0LiBBbHNvIG1ha2Ugc3VyZVxuICAgIC8vIHRoaXMgbWVzc2FnZSBkb2Vzbid0IG9jY3VyIGVsc2V3aGVyZSBpbiB0aGlzIGZ1bmN0aW9uLCBvciBpdCB3aWxsIGNhdXNlXG4gICAgLy8gYSBmYWxzZSBwb3NpdGl2ZS5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ15fXicpO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGNvZGUgYWJvdmUgaGFzIGJlZW4gZGVhZCBjb2RlIGVsaW1pbmF0ZWQgKERDRSdkKS5cbiAgICBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18uY2hlY2tEQ0UoY2hlY2tEQ0UpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBEZXZUb29scyBzaG91bGRuJ3QgY3Jhc2ggUmVhY3QsIG5vIG1hdHRlciB3aGF0LlxuICAgIC8vIFdlIHNob3VsZCBzdGlsbCByZXBvcnQgaW4gY2FzZSB3ZSBicmVhayB0aGlzIGNvZGUuXG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIC8vIERDRSBjaGVjayBzaG91bGQgaGFwcGVuIGJlZm9yZSBSZWFjdERPTSBidW5kbGUgZXhlY3V0ZXMgc28gdGhhdFxuICAvLyBEZXZUb29scyBjYW4gcmVwb3J0IGJhZCBtaW5pZmljYXRpb24gZHVyaW5nIGluamVjdGlvbi5cbiAgY2hlY2tEQ0UoKTtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1kb20ucHJvZHVjdGlvbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1kb20uZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuMTQuMFxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBSZWFjdFZlcnNpb24gPSAnMTYuMTQuMCc7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudC1saWtlIHR5cGVzLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnBvcnRhbCcpIDogMHhlYWNhO1xudmFyIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mcmFnbWVudCcpIDogMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpIDogMHhlYWNjO1xudmFyIFJFQUNUX1BST0ZJTEVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm9maWxlcicpIDogMHhlYWQyO1xudmFyIFJFQUNUX1BST1ZJREVSX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5wcm92aWRlcicpIDogMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbnRleHQnKSA6IDB4ZWFjZTsgLy8gVE9ETzogV2UgZG9uJ3QgdXNlIEFzeW5jTW9kZSBvciBDb25jdXJyZW50TW9kZSBhbnltb3JlLiBUaGV5IHdlcmUgdGVtcG9yYXJ5XG52YXIgUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5jb25jdXJyZW50X21vZGUnKSA6IDB4ZWFjZjtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZm9yd2FyZF9yZWYnKSA6IDB4ZWFkMDtcbnZhciBSRUFDVF9TVVNQRU5TRV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3Quc3VzcGVuc2UnKSA6IDB4ZWFkMTtcbnZhciBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0JykgOiAweGVhZDg7XG52YXIgUkVBQ1RfTUVNT19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubWVtbycpIDogMHhlYWQzO1xudmFyIFJFQUNUX0xBWllfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmxhenknKSA6IDB4ZWFkNDtcbnZhciBSRUFDVF9CTE9DS19UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuYmxvY2snKSA6IDB4ZWFkOTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZnVuZGFtZW50YWwnKSA6IDB4ZWFkNTtcbnZhciBSRUFDVF9SRVNQT05ERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnJlc3BvbmRlcicpIDogMHhlYWQ2O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zY29wZScpIDogMHhlYWQ3O1xudmFyIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChtYXliZUl0ZXJhYmxlID09PSBudWxsIHx8IHR5cGVvZiBtYXliZUl0ZXJhYmxlICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIG1heWJlSXRlcmF0b3IgPSBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdIHx8IG1heWJlSXRlcmFibGVbRkFVWF9JVEVSQVRPUl9TWU1CT0xdO1xuXG4gIGlmICh0eXBlb2YgbWF5YmVJdGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogS2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgZGlzcGF0Y2hlci5cbiAqL1xudmFyIFJlYWN0Q3VycmVudERpc3BhdGNoZXIgPSB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxufTtcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBiYXRjaCdzIGNvbmZpZ3VyYXRpb24gc3VjaCBhcyBob3cgbG9uZyBhbiB1cGRhdGVcbiAqIHNob3VsZCBzdXNwZW5kIGZvciBpZiBpdCBuZWVkcyB0by5cbiAqL1xudmFyIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnID0ge1xuICBzdXNwZW5zZTogbnVsbFxufTtcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG52YXIgQkVGT1JFX1NMQVNIX1JFID0gL14oLiopW1xcXFxcXC9dLztcbmZ1bmN0aW9uIGRlc2NyaWJlQ29tcG9uZW50RnJhbWUgKG5hbWUsIHNvdXJjZSwgb3duZXJOYW1lKSB7XG4gIHZhciBzb3VyY2VJbmZvID0gJyc7XG5cbiAgaWYgKHNvdXJjZSkge1xuICAgIHZhciBwYXRoID0gc291cmNlLmZpbGVOYW1lO1xuICAgIHZhciBmaWxlTmFtZSA9IHBhdGgucmVwbGFjZShCRUZPUkVfU0xBU0hfUkUsICcnKTtcblxuICAgIHtcbiAgICAgIC8vIEluIERFViwgaW5jbHVkZSBjb2RlIGZvciBhIGNvbW1vbiBzcGVjaWFsIGNhc2U6XG4gICAgICAvLyBwcmVmZXIgXCJmb2xkZXIvaW5kZXguanNcIiBpbnN0ZWFkIG9mIGp1c3QgXCJpbmRleC5qc1wiLlxuICAgICAgaWYgKC9eaW5kZXhcXC4vLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHBhdGgubWF0Y2goQkVGT1JFX1NMQVNIX1JFKTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICB2YXIgcGF0aEJlZm9yZVNsYXNoID0gbWF0Y2hbMV07XG5cbiAgICAgICAgICBpZiAocGF0aEJlZm9yZVNsYXNoKSB7XG4gICAgICAgICAgICB2YXIgZm9sZGVyTmFtZSA9IHBhdGhCZWZvcmVTbGFzaC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuICAgICAgICAgICAgZmlsZU5hbWUgPSBmb2xkZXJOYW1lICsgJy8nICsgZmlsZU5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc291cmNlSW5mbyA9ICcgKGF0ICcgKyBmaWxlTmFtZSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknO1xuICB9IGVsc2UgaWYgKG93bmVyTmFtZSkge1xuICAgIHNvdXJjZUluZm8gPSAnIChjcmVhdGVkIGJ5ICcgKyBvd25lck5hbWUgKyAnKSc7XG4gIH1cblxuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgKG5hbWUgfHwgJ1Vua25vd24nKSArIHNvdXJjZUluZm87XG59XG5cbnZhciBSZXNvbHZlZCA9IDE7XG5mdW5jdGlvbiByZWZpbmVSZXNvbHZlZExhenlDb21wb25lbnQobGF6eUNvbXBvbmVudCkge1xuICByZXR1cm4gbGF6eUNvbXBvbmVudC5fc3RhdHVzID09PSBSZXNvbHZlZCA/IGxhenlDb21wb25lbnQuX3Jlc3VsdCA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFdyYXBwZWROYW1lKG91dGVyVHlwZSwgaW5uZXJUeXBlLCB3cmFwcGVyTmFtZSkge1xuICB2YXIgZnVuY3Rpb25OYW1lID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8ICcnO1xuICByZXR1cm4gb3V0ZXJUeXBlLmRpc3BsYXlOYW1lIHx8IChmdW5jdGlvbk5hbWUgIT09ICcnID8gd3JhcHBlck5hbWUgKyBcIihcIiArIGZ1bmN0aW9uTmFtZSArIFwiKVwiIDogd3JhcHBlck5hbWUpO1xufVxuXG5mdW5jdGlvbiBnZXRDb21wb25lbnROYW1lKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgIC8vIEhvc3Qgcm9vdCwgdGV4dCBub2RlIG9yIGp1c3QgaW52YWxpZCB0eXBlLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAge1xuICAgIGlmICh0eXBlb2YgdHlwZS50YWcgPT09ICdudW1iZXInKSB7XG4gICAgICBlcnJvcignUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZSgpLiAnICsgJ1RoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgIHJldHVybiAnRnJhZ21lbnQnO1xuXG4gICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgIHJldHVybiAnUG9ydGFsJztcblxuICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgIHJldHVybiBcIlByb2ZpbGVyXCI7XG5cbiAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N0cmljdE1vZGUnO1xuXG4gICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZSc7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRTpcbiAgICAgIHJldHVybiAnU3VzcGVuc2VMaXN0JztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBzd2l0Y2ggKHR5cGUuJCR0eXBlb2YpIHtcbiAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICByZXR1cm4gJ0NvbnRleHQuQ29uc3VtZXInO1xuXG4gICAgICBjYXNlIFJFQUNUX1BST1ZJREVSX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Qcm92aWRlcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldFdyYXBwZWROYW1lKHR5cGUsIHR5cGUucmVuZGVyLCAnRm9yd2FyZFJlZicpO1xuXG4gICAgICBjYXNlIFJFQUNUX01FTU9fVFlQRTpcbiAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUodHlwZS50eXBlKTtcblxuICAgICAgY2FzZSBSRUFDVF9CTE9DS19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnJlbmRlcik7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHRoZW5hYmxlID0gdHlwZTtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWRUaGVuYWJsZSA9IHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudCh0aGVuYWJsZSk7XG5cbiAgICAgICAgICBpZiAocmVzb2x2ZWRUaGVuYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWUocmVzb2x2ZWRUaGVuYWJsZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFJlYWN0RGVidWdDdXJyZW50RnJhbWUgPSB7fTtcbnZhciBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IG51bGw7XG5mdW5jdGlvbiBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChlbGVtZW50KSB7XG4gIHtcbiAgICBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudCA9IGVsZW1lbnQ7XG4gIH1cbn1cblxue1xuICAvLyBTdGFjayBpbXBsZW1lbnRhdGlvbiBpbmplY3RlZCBieSB0aGUgY3VycmVudCByZW5kZXJlci5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2sgPSBudWxsO1xuXG4gIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhY2sgPSAnJzsgLy8gQWRkIGFuIGV4dHJhIHRvcCBmcmFtZSB3aGlsZSBhbiBlbGVtZW50IGlzIGJlaW5nIHZhbGlkYXRlZFxuXG4gICAgaWYgKGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KSB7XG4gICAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQudHlwZSk7XG4gICAgICB2YXIgb3duZXIgPSBjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC5fb3duZXI7XG4gICAgICBzdGFjayArPSBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9zb3VyY2UsIG93bmVyICYmIGdldENvbXBvbmVudE5hbWUob3duZXIudHlwZSkpO1xuICAgIH0gLy8gRGVsZWdhdGUgdG8gdGhlIGluamVjdGVkIHJlbmRlcmVyLXNwZWNpZmljIGltcGxlbWVudGF0aW9uXG5cblxuICAgIHZhciBpbXBsID0gUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRDdXJyZW50U3RhY2s7XG5cbiAgICBpZiAoaW1wbCkge1xuICAgICAgc3RhY2sgKz0gaW1wbCgpIHx8ICcnO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFjaztcbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VkIGJ5IGFjdCgpIHRvIHRyYWNrIHdoZXRoZXIgeW91J3JlIGluc2lkZSBhbiBhY3QoKSBzY29wZS5cbiAqL1xudmFyIElzU29tZVJlbmRlcmVyQWN0aW5nID0ge1xuICBjdXJyZW50OiBmYWxzZVxufTtcblxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0ge1xuICBSZWFjdEN1cnJlbnREaXNwYXRjaGVyOiBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLFxuICBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZzogUmVhY3RDdXJyZW50QmF0Y2hDb25maWcsXG4gIFJlYWN0Q3VycmVudE93bmVyOiBSZWFjdEN1cnJlbnRPd25lcixcbiAgSXNTb21lUmVuZGVyZXJBY3Rpbmc6IElzU29tZVJlbmRlcmVyQWN0aW5nLFxuICAvLyBVc2VkIGJ5IHJlbmRlcmVycyB0byBhdm9pZCBidW5kbGluZyBvYmplY3QtYXNzaWduIHR3aWNlIGluIFVNRCBidW5kbGVzOlxuICBhc3NpZ246IF9hc3NpZ25cbn07XG5cbntcbiAgX2Fzc2lnbihSZWFjdFNoYXJlZEludGVybmFscywge1xuICAgIC8vIFRoZXNlIHNob3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gcHJvZHVjdGlvbi5cbiAgICBSZWFjdERlYnVnQ3VycmVudEZyYW1lOiBSZWFjdERlYnVnQ3VycmVudEZyYW1lLFxuICAgIC8vIFNoaW0gZm9yIFJlYWN0IERPTSAxNi4wLjAgd2hpY2ggc3RpbGwgZGVzdHJ1Y3R1cmVkIChidXQgbm90IHVzZWQpIHRoaXMuXG4gICAgLy8gVE9ETzogcmVtb3ZlIGluIFJlYWN0IDE3LjAuXG4gICAgUmVhY3RDb21wb25lbnRUcmVlSG9vazoge31cbiAgfSk7XG59XG5cbi8vIGJ5IGNhbGxzIHRvIHRoZXNlIG1ldGhvZHMgYnkgYSBCYWJlbCBwbHVnaW4uXG4vL1xuLy8gSW4gUFJPRCAob3IgaW4gcGFja2FnZXMgd2l0aG91dCBhY2Nlc3MgdG8gUmVhY3QgaW50ZXJuYWxzKSxcbi8vIHRoZXkgYXJlIGxlZnQgYXMgdGhleSBhcmUgaW5zdGVhZC5cblxuZnVuY3Rpb24gd2Fybihmb3JtYXQpIHtcbiAge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHByaW50V2FybmluZygnd2FybicsIGZvcm1hdCwgYXJncyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGVycm9yKGZvcm1hdCkge1xuICB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcHJpbnRXYXJuaW5nKCdlcnJvcicsIGZvcm1hdCwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJpbnRXYXJuaW5nKGxldmVsLCBmb3JtYXQsIGFyZ3MpIHtcbiAgLy8gV2hlbiBjaGFuZ2luZyB0aGlzIGxvZ2ljLCB5b3UgbWlnaHQgd2FudCB0byBhbHNvXG4gIC8vIHVwZGF0ZSBjb25zb2xlV2l0aFN0YWNrRGV2Lnd3dy5qcyBhcyB3ZWxsLlxuICB7XG4gICAgdmFyIGhhc0V4aXN0aW5nU3RhY2sgPSBhcmdzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ3N0cmluZycgJiYgYXJnc1thcmdzLmxlbmd0aCAtIDFdLmluZGV4T2YoJ1xcbiAgICBpbicpID09PSAwO1xuXG4gICAgaWYgKCFoYXNFeGlzdGluZ1N0YWNrKSB7XG4gICAgICB2YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlJlYWN0RGVidWdDdXJyZW50RnJhbWU7XG4gICAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcblxuICAgICAgaWYgKHN0YWNrICE9PSAnJykge1xuICAgICAgICBmb3JtYXQgKz0gJyVzJztcbiAgICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtzdGFja10pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gJycgKyBpdGVtO1xuICAgIH0pOyAvLyBDYXJlZnVsOiBSTiBjdXJyZW50bHkgZGVwZW5kcyBvbiB0aGlzIHByZWZpeFxuXG4gICAgYXJnc1dpdGhGb3JtYXQudW5zaGlmdCgnV2FybmluZzogJyArIGZvcm1hdCk7IC8vIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIHNwcmVhZCAob3IgLmFwcGx5KSBkaXJlY3RseSBiZWNhdXNlIGl0XG4gICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmdcblxuICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGVbbGV2ZWxdLCBjb25zb2xlLCBhcmdzV2l0aEZvcm1hdCk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9XG59XG5cbnZhciBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnQgPSB7fTtcblxuZnVuY3Rpb24gd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIGNhbGxlck5hbWUpIHtcbiAge1xuICAgIHZhciBfY29uc3RydWN0b3IgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IF9jb25zdHJ1Y3RvciAmJiAoX2NvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8IF9jb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcyc7XG4gICAgdmFyIHdhcm5pbmdLZXkgPSBjb21wb25lbnROYW1lICsgXCIuXCIgKyBjYWxsZXJOYW1lO1xuXG4gICAgaWYgKGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVycm9yKFwiQ2FuJ3QgY2FsbCAlcyBvbiBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB5ZXQgbW91bnRlZC4gXCIgKyAnVGhpcyBpcyBhIG5vLW9wLCBidXQgaXQgbWlnaHQgaW5kaWNhdGUgYSBidWcgaW4geW91ciBhcHBsaWNhdGlvbi4gJyArICdJbnN0ZWFkLCBhc3NpZ24gdG8gYHRoaXMuc3RhdGVgIGRpcmVjdGx5IG9yIGRlZmluZSBhIGBzdGF0ZSA9IHt9O2AgJyArICdjbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNpcmVkIHN0YXRlIGluIHRoZSAlcyBjb21wb25lbnQuJywgY2FsbGVyTmFtZSwgY29tcG9uZW50TmFtZSk7XG5cbiAgICBkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0gPSB0cnVlO1xuICB9XG59XG4vKipcbiAqIFRoaXMgaXMgdGhlIGFic3RyYWN0IEFQSSBmb3IgYW4gdXBkYXRlIHF1ZXVlLlxuICovXG5cblxudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0ge1xuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnZm9yY2VVcGRhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVwbGFjZXMgYWxsIG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIG9yIGBzZXRTdGF0ZWAgdG8gbXV0YXRlIHN0YXRlLlxuICAgKiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gICAqXG4gICAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gICAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRoYXQgc2hvdWxkIHJlcmVuZGVyLlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29tcGxldGVTdGF0ZSBOZXh0IHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNhbGxlck5hbWUgbmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdyZXBsYWNlU3RhdGUnKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIFRoaXMgb25seSBleGlzdHMgYmVjYXVzZSBfcGVuZGluZ1N0YXRlIGlzXG4gICAqIGludGVybmFsLiBUaGlzIHByb3ZpZGVzIGEgbWVyZ2luZyBzdHJhdGVneSB0aGF0IGlzIG5vdCBhdmFpbGFibGUgdG8gZGVlcFxuICAgKiBwcm9wZXJ0aWVzIHdoaWNoIGlzIGNvbmZ1c2luZy4gVE9ETzogRXhwb3NlIHBlbmRpbmdTdGF0ZSBvciBkb24ndCB1c2UgaXRcbiAgICogZHVyaW5nIHRoZSBtZXJnZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIHN0YXRlLlxuICAgKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIGNvbXBvbmVudCBpcyB1cGRhdGVkLlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IE5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3NldFN0YXRlJyk7XG4gIH1cbn07XG5cbnZhciBlbXB0eU9iamVjdCA9IHt9O1xuXG57XG4gIE9iamVjdC5mcmVlemUoZW1wdHlPYmplY3QpO1xufVxuLyoqXG4gKiBCYXNlIGNsYXNzIGhlbHBlcnMgZm9yIHRoZSB1cGRhdGluZyBzdGF0ZSBvZiBhIGNvbXBvbmVudC5cbiAqL1xuXG5cbmZ1bmN0aW9uIENvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7IC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0OyAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cblxuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG5Db21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcbi8qKlxuICogU2V0cyBhIHN1YnNldCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyB0byBtdXRhdGVcbiAqIHN0YXRlLiBZb3Ugc2hvdWxkIHRyZWF0IGB0aGlzLnN0YXRlYCBhcyBpbW11dGFibGUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAqIGFjY2Vzc2luZyBgdGhpcy5zdGF0ZWAgYWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCBtYXkgcmV0dXJuIHRoZSBvbGQgdmFsdWUuXG4gKlxuICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgY2FsbHMgdG8gYHNldFN0YXRlYCB3aWxsIHJ1biBzeW5jaHJvbm91c2x5LFxuICogYXMgdGhleSBtYXkgZXZlbnR1YWxseSBiZSBiYXRjaGVkIHRvZ2V0aGVyLiAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsXG4gKiBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgY2FsbCB0byBzZXRTdGF0ZSBpcyBhY3R1YWxseVxuICogY29tcGxldGVkLlxuICpcbiAqIFdoZW4gYSBmdW5jdGlvbiBpcyBwcm92aWRlZCB0byBzZXRTdGF0ZSwgaXQgd2lsbCBiZSBjYWxsZWQgYXQgc29tZSBwb2ludCBpblxuICogdGhlIGZ1dHVyZSAobm90IHN5bmNocm9ub3VzbHkpLiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSB1cCB0byBkYXRlXG4gKiBjb21wb25lbnQgYXJndW1lbnRzIChzdGF0ZSwgcHJvcHMsIGNvbnRleHQpLiBUaGVzZSB2YWx1ZXMgY2FuIGJlIGRpZmZlcmVudFxuICogZnJvbSB0aGlzLiogYmVjYXVzZSB5b3VyIGZ1bmN0aW9uIG1heSBiZSBjYWxsZWQgYWZ0ZXIgcmVjZWl2ZVByb3BzIGJ1dCBiZWZvcmVcbiAqIHNob3VsZENvbXBvbmVudFVwZGF0ZSwgYW5kIHRoaXMgbmV3IHN0YXRlLCBwcm9wcywgYW5kIGNvbnRleHQgd2lsbCBub3QgeWV0IGJlXG4gKiBhc3NpZ25lZCB0byB0aGlzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fGZ1bmN0aW9ufSBwYXJ0aWFsU3RhdGUgTmV4dCBwYXJ0aWFsIHN0YXRlIG9yIGZ1bmN0aW9uIHRvXG4gKiAgICAgICAgcHJvZHVjZSBuZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5cbkNvbXBvbmVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFydGlhbFN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcInNldFN0YXRlKC4uLik6IHRha2VzIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMgdG8gdXBkYXRlIG9yIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzLlwiICk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCAnc2V0U3RhdGUnKTtcbn07XG4vKipcbiAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICpcbiAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICpcbiAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gKlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciB1cGRhdGUgaXMgY29tcGxldGUuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuXG5cbkNvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgJ2ZvcmNlVXBkYXRlJyk7XG59O1xuLyoqXG4gKiBEZXByZWNhdGVkIEFQSXMuIFRoZXNlIEFQSXMgdXNlZCB0byBleGlzdCBvbiBjbGFzc2ljIFJlYWN0IGNsYXNzZXMgYnV0IHNpbmNlXG4gKiB3ZSB3b3VsZCBsaWtlIHRvIGRlcHJlY2F0ZSB0aGVtLCB3ZSdyZSBub3QgZ29pbmcgdG8gbW92ZSB0aGVtIG92ZXIgdG8gdGhpc1xuICogbW9kZXJuIGJhc2UgY2xhc3MuIEluc3RlYWQsIHdlIGRlZmluZSBhIGdldHRlciB0aGF0IHdhcm5zIGlmIGl0J3MgYWNjZXNzZWQuXG4gKi9cblxuXG57XG4gIHZhciBkZXByZWNhdGVkQVBJcyA9IHtcbiAgICBpc01vdW50ZWQ6IFsnaXNNb3VudGVkJywgJ0luc3RlYWQsIG1ha2Ugc3VyZSB0byBjbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nIHJlcXVlc3RzIGluICcgKyAnY29tcG9uZW50V2lsbFVubW91bnQgdG8gcHJldmVudCBtZW1vcnkgbGVha3MuJ10sXG4gICAgcmVwbGFjZVN0YXRlOiBbJ3JlcGxhY2VTdGF0ZScsICdSZWZhY3RvciB5b3VyIGNvZGUgdG8gdXNlIHNldFN0YXRlIGluc3RlYWQgKHNlZSAnICsgJ2h0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzIzNikuJ11cbiAgfTtcblxuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tcG9uZW50LnByb3RvdHlwZSwgbWV0aG9kTmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdhcm4oJyVzKC4uLikgaXMgZGVwcmVjYXRlZCBpbiBwbGFpbiBKYXZhU2NyaXB0IFJlYWN0IGNsYXNzZXMuICVzJywgaW5mb1swXSwgaW5mb1sxXSk7XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBmb3IgKHZhciBmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpIHtcbiAgICBpZiAoZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSkge1xuICAgICAgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKGZuTmFtZSwgZGVwcmVjYXRlZEFQSXNbZm5OYW1lXSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cblxuQ29tcG9uZW50RHVtbXkucHJvdG90eXBlID0gQ29tcG9uZW50LnByb3RvdHlwZTtcbi8qKlxuICogQ29udmVuaWVuY2UgY29tcG9uZW50IHdpdGggZGVmYXVsdCBzaGFsbG93IGVxdWFsaXR5IGNoZWNrIGZvciBzQ1UuXG4gKi9cblxuZnVuY3Rpb24gUHVyZUNvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7IC8vIElmIGEgY29tcG9uZW50IGhhcyBzdHJpbmcgcmVmcywgd2Ugd2lsbCBhc3NpZ24gYSBkaWZmZXJlbnQgb2JqZWN0IGxhdGVyLlxuXG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG52YXIgcHVyZUNvbXBvbmVudFByb3RvdHlwZSA9IFB1cmVDb21wb25lbnQucHJvdG90eXBlID0gbmV3IENvbXBvbmVudER1bW15KCk7XG5wdXJlQ29tcG9uZW50UHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHVyZUNvbXBvbmVudDsgLy8gQXZvaWQgYW4gZXh0cmEgcHJvdG90eXBlIGp1bXAgZm9yIHRoZXNlIG1ldGhvZHMuXG5cbl9hc3NpZ24ocHVyZUNvbXBvbmVudFByb3RvdHlwZSwgQ29tcG9uZW50LnByb3RvdHlwZSk7XG5cbnB1cmVDb21wb25lbnRQcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuXG4vLyBhbiBpbW11dGFibGUgb2JqZWN0IHdpdGggYSBzaW5nbGUgbXV0YWJsZSB2YWx1ZVxuZnVuY3Rpb24gY3JlYXRlUmVmKCkge1xuICB2YXIgcmVmT2JqZWN0ID0ge1xuICAgIGN1cnJlbnQ6IG51bGxcbiAgfTtcblxuICB7XG4gICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgfVxuXG4gIHJldHVybiByZWZPYmplY3Q7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgUkVTRVJWRURfUFJPUFMgPSB7XG4gIGtleTogdHJ1ZSxcbiAgcmVmOiB0cnVlLFxuICBfX3NlbGY6IHRydWUsXG4gIF9fc291cmNlOiB0cnVlXG59O1xudmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duLCBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biwgZGlkV2FybkFib3V0U3RyaW5nUmVmcztcblxue1xuICBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzID0ge307XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAncmVmJykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ3JlZicpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCAna2V5JykpIHtcbiAgICAgIHZhciBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbmZpZywgJ2tleScpLmdldDtcblxuICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYGtleWAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ2tleScsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ0tleSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nUmVmID0gZnVuY3Rpb24gKCkge1xuICAgIHtcbiAgICAgIGlmICghc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24pIHtcbiAgICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuXG4gICAgICAgIGVycm9yKCclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHdhcm5BYm91dEFjY2Vzc2luZ1JlZi5pc1JlYWN0V2FybmluZyA9IHRydWU7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ3JlZicsIHtcbiAgICBnZXQ6IHdhcm5BYm91dEFjY2Vzc2luZ1JlZixcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHdhcm5JZlN0cmluZ1JlZkNhbm5vdEJlQXV0b0NvbnZlcnRlZChjb25maWcpIHtcbiAge1xuICAgIGlmICh0eXBlb2YgY29uZmlnLnJlZiA9PT0gJ3N0cmluZycgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCAmJiBjb25maWcuX19zZWxmICYmIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQuc3RhdGVOb2RlICE9PSBjb25maWcuX19zZWxmKSB7XG4gICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKTtcblxuICAgICAgaWYgKCFkaWRXYXJuQWJvdXRTdHJpbmdSZWZzW2NvbXBvbmVudE5hbWVdKSB7XG4gICAgICAgIGVycm9yKCdDb21wb25lbnQgXCIlc1wiIGNvbnRhaW5zIHRoZSBzdHJpbmcgcmVmIFwiJXNcIi4gJyArICdTdXBwb3J0IGZvciBzdHJpbmcgcmVmcyB3aWxsIGJlIHJlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gJyArICdUaGlzIGNhc2UgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgY29udmVydGVkIHRvIGFuIGFycm93IGZ1bmN0aW9uLiAnICsgJ1dlIGFzayB5b3UgdG8gbWFudWFsbHkgZml4IHRoaXMgY2FzZSBieSB1c2luZyB1c2VSZWYoKSBvciBjcmVhdGVSZWYoKSBpbnN0ZWFkLiAnICsgJ0xlYXJuIG1vcmUgYWJvdXQgdXNpbmcgcmVmcyBzYWZlbHkgaGVyZTogJyArICdodHRwczovL2ZiLm1lL3JlYWN0LXN0cmljdC1tb2RlLXN0cmluZy1yZWYnLCBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSksIGNvbmZpZy5yZWYpO1xuXG4gICAgICAgIGRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgUmVhY3QgZWxlbWVudC4gVGhpcyBubyBsb25nZXIgYWRoZXJlcyB0b1xuICogdGhlIGNsYXNzIHBhdHRlcm4sIHNvIGRvIG5vdCB1c2UgbmV3IHRvIGNhbGwgaXQuIEFsc28sIGluc3RhbmNlb2YgY2hlY2tcbiAqIHdpbGwgbm90IHdvcmsuIEluc3RlYWQgdGVzdCAkJHR5cGVvZiBmaWVsZCBhZ2FpbnN0IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSB0byBjaGVja1xuICogaWYgc29tZXRoaW5nIGlzIGEgUmVhY3QgRWxlbWVudC5cbiAqXG4gKiBAcGFyYW0geyp9IHR5cGVcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBwYXJhbSB7Kn0ga2V5XG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJlZlxuICogQHBhcmFtIHsqfSBvd25lclxuICogQHBhcmFtIHsqfSBzZWxmIEEgKnRlbXBvcmFyeSogaGVscGVyIHRvIGRldGVjdCBwbGFjZXMgd2hlcmUgYHRoaXNgIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSB0aGUgYG93bmVyYCB3aGVuIFJlYWN0LmNyZWF0ZUVsZW1lbnQgaXMgY2FsbGVkLCBzbyB0aGF0IHdlXG4gKiBjYW4gd2Fybi4gV2Ugd2FudCB0byBnZXQgcmlkIG9mIG93bmVyIGFuZCByZXBsYWNlIHN0cmluZyBgcmVmYHMgd2l0aCBhcnJvd1xuICogZnVuY3Rpb25zLCBhbmQgYXMgbG9uZyBhcyBgdGhpc2AgYW5kIG93bmVyIGFyZSB0aGUgc2FtZSwgdGhlcmUgd2lsbCBiZSBub1xuICogY2hhbmdlIGluIGJlaGF2aW9yLlxuICogQHBhcmFtIHsqfSBzb3VyY2UgQW4gYW5ub3RhdGlvbiBvYmplY3QgKGFkZGVkIGJ5IGEgdHJhbnNwaWxlciBvciBvdGhlcndpc2UpXG4gKiBpbmRpY2F0aW5nIGZpbGVuYW1lLCBsaW5lIG51bWJlciwgYW5kL29yIG90aGVyIGluZm9ybWF0aW9uLlxuICogQGludGVybmFsXG4gKi9cblxuXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvd3MgdXMgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhpcyBhcyBhIFJlYWN0IEVsZW1lbnRcbiAgICAkJHR5cGVvZjogUkVBQ1RfRUxFTUVOVF9UWVBFLFxuICAgIC8vIEJ1aWx0LWluIHByb3BlcnRpZXMgdGhhdCBiZWxvbmcgb24gdGhlIGVsZW1lbnRcbiAgICB0eXBlOiB0eXBlLFxuICAgIGtleToga2V5LFxuICAgIHJlZjogcmVmLFxuICAgIHByb3BzOiBwcm9wcyxcbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICB7XG4gICAgLy8gVGhlIHZhbGlkYXRpb24gZmxhZyBpcyBjdXJyZW50bHkgbXV0YXRpdmUuIFdlIHB1dCBpdCBvblxuICAgIC8vIGFuIGV4dGVybmFsIGJhY2tpbmcgc3RvcmUgc28gdGhhdCB3ZSBjYW4gZnJlZXplIHRoZSB3aG9sZSBvYmplY3QuXG4gICAgLy8gVGhpcyBjYW4gYmUgcmVwbGFjZWQgd2l0aCBhIFdlYWtNYXAgb25jZSB0aGV5IGFyZSBpbXBsZW1lbnRlZCBpblxuICAgIC8vIGNvbW1vbmx5IHVzZWQgZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzLlxuICAgIGVsZW1lbnQuX3N0b3JlID0ge307IC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7IC8vIHNlbGYgYW5kIHNvdXJjZSBhcmUgREVWIG9ubHkgcHJvcGVydGllcy5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50LCAnX3NlbGYnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc2VsZlxuICAgIH0pOyAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgIC8vIGVxdWFsIGZvciB0ZXN0aW5nIHB1cnBvc2VzIGFuZCB0aGVyZWZvcmUgd2UgaGlkZSBpdCBmcm9tIGVudW1lcmF0aW9uLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc291cmNlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHNvdXJjZVxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcbi8qKlxuICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IG9mIHRoZSBnaXZlbiB0eXBlLlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjcmVhdGVlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG4gIHZhciBwcm9wcyA9IHt9O1xuICB2YXIga2V5ID0gbnVsbDtcbiAgdmFyIHJlZiA9IG51bGw7XG4gIHZhciBzZWxmID0gbnVsbDtcbiAgdmFyIHNvdXJjZSA9IG51bGw7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG5cbiAgICAgIHtcbiAgICAgICAgd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9XG5cbiAgICBzZWxmID0gY29uZmlnLl9fc2VsZiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NlbGY7XG4gICAgc291cmNlID0gY29uZmlnLl9fc291cmNlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc291cmNlOyAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuXG5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG5cbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuXG4gICAge1xuICAgICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH0gLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG5cblxuICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcykge1xuICAgIHZhciBkZWZhdWx0UHJvcHMgPSB0eXBlLmRlZmF1bHRQcm9wcztcblxuICAgIGZvciAocHJvcE5hbWUgaW4gZGVmYXVsdFByb3BzKSB7XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB7XG4gICAgaWYgKGtleSB8fCByZWYpIHtcbiAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcblxuICAgICAgaWYgKGtleSkge1xuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmKSB7XG4gICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59XG5mdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gIHZhciBuZXdFbGVtZW50ID0gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnJlZiwgb2xkRWxlbWVudC5fc2VsZiwgb2xkRWxlbWVudC5fc291cmNlLCBvbGRFbGVtZW50Ll9vd25lciwgb2xkRWxlbWVudC5wcm9wcyk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjY2xvbmVlbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gY2xvbmVFbGVtZW50KGVsZW1lbnQsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgaWYgKCEhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIlJlYWN0LmNsb25lRWxlbWVudCguLi4pOiBUaGUgYXJndW1lbnQgbXVzdCBiZSBhIFJlYWN0IGVsZW1lbnQsIGJ1dCB5b3UgcGFzc2VkIFwiICsgZWxlbWVudCArIFwiLlwiICk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb3BOYW1lOyAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG5cbiAgdmFyIHByb3BzID0gX2Fzc2lnbih7fSwgZWxlbWVudC5wcm9wcyk7IC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcblxuXG4gIHZhciBrZXkgPSBlbGVtZW50LmtleTtcbiAgdmFyIHJlZiA9IGVsZW1lbnQucmVmOyAvLyBTZWxmIGlzIHByZXNlcnZlZCBzaW5jZSB0aGUgb3duZXIgaXMgcHJlc2VydmVkLlxuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjsgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG5cbiAgdmFyIHNvdXJjZSA9IGVsZW1lbnQuX3NvdXJjZTsgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuXG4gIHZhciBvd25lciA9IGVsZW1lbnQuX293bmVyO1xuXG4gIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgIGlmIChoYXNWYWxpZFJlZihjb25maWcpKSB7XG4gICAgICAvLyBTaWxlbnRseSBzdGVhbCB0aGUgcmVmIGZyb20gdGhlIHBhcmVudC5cbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgICBvd25lciA9IFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkS2V5KGNvbmZpZykpIHtcbiAgICAgIGtleSA9ICcnICsgY29uZmlnLmtleTtcbiAgICB9IC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG5cblxuICAgIHZhciBkZWZhdWx0UHJvcHM7XG5cbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbmZpZ1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIFJlc29sdmUgZGVmYXVsdCBwcm9wc1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGRlZmF1bHRQcm9wc1twcm9wTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuXG5cbiAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG5cbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRBcnJheVtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgfVxuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcyk7XG59XG4vKipcbiAqIFZlcmlmaWVzIHRoZSBvYmplY3QgaXMgYSBSZWFjdEVsZW1lbnQuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2lzdmFsaWRlbGVtZW50XG4gKiBAcGFyYW0gez9vYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBgb2JqZWN0YCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIEBmaW5hbFxuICovXG5cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuXG52YXIgU0VQQVJBVE9SID0gJy4nO1xudmFyIFNVQlNFUEFSQVRPUiA9ICc6Jztcbi8qKlxuICogRXNjYXBlIGFuZCB3cmFwIGtleSBzbyBpdCBpcyBzYWZlIHRvIHVzZSBhcyBhIHJlYWN0aWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGJlIGVzY2FwZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBlc2NhcGVkIGtleS5cbiAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gIHZhciBlc2NhcGVSZWdleCA9IC9bPTpdL2c7XG4gIHZhciBlc2NhcGVyTG9va3VwID0ge1xuICAgICc9JzogJz0wJyxcbiAgICAnOic6ICc9MidcbiAgfTtcbiAgdmFyIGVzY2FwZWRTdHJpbmcgPSAoJycgKyBrZXkpLnJlcGxhY2UoZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgfSk7XG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuLyoqXG4gKiBUT0RPOiBUZXN0IHRoYXQgYSBzaW5nbGUgY2hpbGQgYW5kIGFuIGFycmF5IHdpdGggb25lIGl0ZW0gaGF2ZSB0aGUgc2FtZSBrZXlcbiAqIHBhdHRlcm4uXG4gKi9cblxuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcblxuZnVuY3Rpb24gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHRleHQpIHtcbiAgcmV0dXJuICgnJyArIHRleHQpLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsICckJi8nKTtcbn1cblxudmFyIFBPT0xfU0laRSA9IDEwO1xudmFyIHRyYXZlcnNlQ29udGV4dFBvb2wgPSBbXTtcblxuZnVuY3Rpb24gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGgpIHtcbiAgICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gdHJhdmVyc2VDb250ZXh0UG9vbC5wb3AoKTtcbiAgICB0cmF2ZXJzZUNvbnRleHQucmVzdWx0ID0gbWFwUmVzdWx0O1xuICAgIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gICAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBtYXBGdW5jdGlvbjtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG1hcENvbnRleHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcbiAgICByZXR1cm4gdHJhdmVyc2VDb250ZXh0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICByZXN1bHQ6IG1hcFJlc3VsdCxcbiAgICAgIGtleVByZWZpeDoga2V5UHJlZml4LFxuICAgICAgZnVuYzogbWFwRnVuY3Rpb24sXG4gICAgICBjb250ZXh0OiBtYXBDb250ZXh0LFxuICAgICAgY291bnQ6IDBcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KSB7XG4gIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQua2V5UHJlZml4ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmZ1bmMgPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuY29udGV4dCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb3VudCA9IDA7XG5cbiAgaWYgKHRyYXZlcnNlQ29udGV4dFBvb2wubGVuZ3RoIDwgUE9PTF9TSVpFKSB7XG4gICAgdHJhdmVyc2VDb250ZXh0UG9vbC5wdXNoKHRyYXZlcnNlQ29udGV4dCk7XG4gIH1cbn1cbi8qKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0geyFzdHJpbmd9IG5hbWVTb0ZhciBOYW1lIG9mIHRoZSBrZXkgcGF0aCBzbyBmYXIuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gaW52b2tlIHdpdGggZWFjaCBjaGlsZCBmb3VuZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBVc2VkIHRvIHBhc3MgaW5mb3JtYXRpb24gdGhyb3VnaG91dCB0aGUgdHJhdmVyc2FsXG4gKiBwcm9jZXNzLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cblxuXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgbmFtZVNvRmFyLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuXG4gIGlmICh0eXBlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAvLyBBbGwgb2YgdGhlIGFib3ZlIGFyZSBwZXJjZWl2ZWQgYXMgbnVsbC5cbiAgICBjaGlsZHJlbiA9IG51bGw7XG4gIH1cblxuICB2YXIgaW52b2tlQ2FsbGJhY2sgPSBmYWxzZTtcblxuICBpZiAoY2hpbGRyZW4gPT09IG51bGwpIHtcbiAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgc3dpdGNoIChjaGlsZHJlbi4kJHR5cGVvZikge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIGlmIChpbnZva2VDYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKHRyYXZlcnNlQ29udGV4dCwgY2hpbGRyZW4sIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0Zhcik7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG5cbiAgdmFyIG5leHROYW1lUHJlZml4ID0gbmFtZVNvRmFyID09PSAnJyA/IFNFUEFSQVRPUiA6IG5hbWVTb0ZhciArIFNVQlNFUEFSQVRPUjtcblxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaSk7XG4gICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGNoaWxkcmVuKTtcblxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICB7XG4gICAgICAgIC8vIFdhcm4gYWJvdXQgdXNpbmcgTWFwcyBhcyBjaGlsZHJlblxuICAgICAgICBpZiAoaXRlcmF0b3JGbiA9PT0gY2hpbGRyZW4uZW50cmllcykge1xuICAgICAgICAgIGlmICghZGlkV2FybkFib3V0TWFwcykge1xuICAgICAgICAgICAgd2FybignVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBDb25zaWRlciBjb252ZXJ0aW5nIGNoaWxkcmVuIHRvICcgKyAnYW4gYXJyYXkgb2Yga2V5ZWQgUmVhY3RFbGVtZW50cyBpbnN0ZWFkLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRpZFdhcm5BYm91dE1hcHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpaSA9IDA7XG5cbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgY2hpbGQgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpaSsrKTtcbiAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG5cbiAgICAgIHtcbiAgICAgICAgYWRkZW5kdW0gPSAnIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgJyArICdpbnN0ZWFkLicgKyBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNoaWxkcmVuU3RyaW5nID0gJycgKyBjaGlsZHJlbjtcblxuICAgICAge1xuICAgICAgICB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoIFwiT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiBcIiArIChjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcpICsgXCIpLlwiICsgYWRkZW5kdW0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG4vKipcbiAqIFRyYXZlcnNlcyBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAsIGJ1dFxuICogbWlnaHQgYWxzbyBiZSBzcGVjaWZpZWQgdGhyb3VnaCBhdHRyaWJ1dGVzOlxuICpcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5jaGlsZHJlbiwgLi4uKWBcbiAqIC0gYHRyYXZlcnNlQWxsQ2hpbGRyZW4odGhpcy5wcm9wcy5sZWZ0UGFuZWxDaGlsZHJlbiwgLi4uKWBcbiAqXG4gKiBUaGUgYHRyYXZlcnNlQ29udGV4dGAgaXMgYW4gb3B0aW9uYWwgYXJndW1lbnQgdGhhdCBpcyBwYXNzZWQgdGhyb3VnaCB0aGVcbiAqIGVudGlyZSB0cmF2ZXJzYWwuIEl0IGNhbiBiZSB1c2VkIHRvIHN0b3JlIGFjY3VtdWxhdGlvbnMgb3IgYW55dGhpbmcgZWxzZSB0aGF0XG4gKiB0aGUgY2FsbGJhY2sgbWlnaHQgZmluZCByZWxldmFudC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIG9iamVjdC5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBUbyBpbnZva2UgdXBvbiB0cmF2ZXJzaW5nIGVhY2ggY2hpbGQuXG4gKiBAcGFyYW0gez8qfSB0cmF2ZXJzZUNvbnRleHQgQ29udGV4dCBmb3IgdHJhdmVyc2FsLlxuICogQHJldHVybiB7IW51bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGlzIHN1YnRyZWUuXG4gKi9cblxuXG5mdW5jdGlvbiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sICcnLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbn1cbi8qKlxuICogR2VuZXJhdGUgYSBrZXkgc3RyaW5nIHRoYXQgaWRlbnRpZmllcyBhIGNvbXBvbmVudCB3aXRoaW4gYSBzZXQuXG4gKlxuICogQHBhcmFtIHsqfSBjb21wb25lbnQgQSBjb21wb25lbnQgdGhhdCBjb3VsZCBjb250YWluIGEgbWFudWFsIGtleS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJbmRleCB0aGF0IGlzIHVzZWQgaWYgYSBtYW51YWwga2V5IGlzIG5vdCBwcm92aWRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gJ29iamVjdCcgJiYgY29tcG9uZW50ICE9PSBudWxsICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBlc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH0gLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcblxuXG4gIHJldHVybiBpbmRleC50b1N0cmluZygzNik7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTaW5nbGVDaGlsZChib29rS2VlcGluZywgY2hpbGQsIG5hbWUpIHtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jLFxuICAgICAgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG4gIGZ1bmMuY2FsbChjb250ZXh0LCBjaGlsZCwgYm9va0tlZXBpbmcuY291bnQrKyk7XG59XG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmZvcmVhY2hcbiAqXG4gKiBUaGUgcHJvdmlkZWQgZm9yRWFjaEZ1bmMoY2hpbGQsIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZm9yRWFjaEZ1bmNcbiAqIEBwYXJhbSB7Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCBmb3IgZm9yRWFjaENvbnRleHQuXG4gKi9cblxuXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobnVsbCwgbnVsbCwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkLCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQoYm9va0tlZXBpbmcsIGNoaWxkLCBjaGlsZEtleSkge1xuICB2YXIgcmVzdWx0ID0gYm9va0tlZXBpbmcucmVzdWx0LFxuICAgICAga2V5UHJlZml4ID0gYm9va0tlZXBpbmcua2V5UHJlZml4LFxuICAgICAgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcbiAgdmFyIG1hcHBlZENoaWxkID0gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBmdW5jdGlvbiAoYykge1xuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAobWFwcGVkQ2hpbGQgIT0gbnVsbCkge1xuICAgIGlmIChpc1ZhbGlkRWxlbWVudChtYXBwZWRDaGlsZCkpIHtcbiAgICAgIG1hcHBlZENoaWxkID0gY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLCAvLyBLZWVwIGJvdGggdGhlIChtYXBwZWQpIGFuZCBvbGQga2V5cyBpZiB0aGV5IGRpZmZlciwganVzdCBhc1xuICAgICAgLy8gdHJhdmVyc2VBbGxDaGlsZHJlbiB1c2VkIHRvIGRvIGZvciBvYmplY3RzIGFzIGNoaWxkcmVuXG4gICAgICBrZXlQcmVmaXggKyAobWFwcGVkQ2hpbGQua2V5ICYmICghY2hpbGQgfHwgY2hpbGQua2V5ICE9PSBtYXBwZWRDaGlsZC5rZXkpID8gZXNjYXBlVXNlclByb3ZpZGVkS2V5KG1hcHBlZENoaWxkLmtleSkgKyAnLycgOiAnJykgKyBjaGlsZEtleSk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2gobWFwcGVkQ2hpbGQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIGFycmF5LCBwcmVmaXgsIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIGVzY2FwZWRQcmVmaXggPSAnJztcblxuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cblxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gZ2V0UG9vbGVkVHJhdmVyc2VDb250ZXh0KGFycmF5LCBlc2NhcGVkUHJlZml4LCBmdW5jLCBjb250ZXh0KTtcbiAgdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dCwgdHJhdmVyc2VDb250ZXh0KTtcbiAgcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpO1xufVxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5tYXBcbiAqXG4gKiBUaGUgcHJvdmlkZWQgbWFwRnVuY3Rpb24oY2hpbGQsIGtleSwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmdW5jIFRoZSBtYXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgQ29udGV4dCBmb3IgbWFwRnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtvYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBvcmRlcmVkIG1hcCBvZiByZXN1bHRzLlxuICovXG5cblxuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuYywgY29udGV4dCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5jb3VudFxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuLlxuICovXG5cblxuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbikge1xuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LCBudWxsKTtcbn1cbi8qKlxuICogRmxhdHRlbiBhIGNoaWxkcmVuIG9iamVjdCAodHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gKSBhbmRcbiAqIHJldHVybiBhbiBhcnJheSB3aXRoIGFwcHJvcHJpYXRlbHkgcmUta2V5ZWQgY2hpbGRyZW4uXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVudG9hcnJheVxuICovXG5cblxuZnVuY3Rpb24gdG9BcnJheShjaGlsZHJlbikge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwoY2hpbGRyZW4sIHJlc3VsdCwgbnVsbCwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgY2hpbGQgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuIGFuZCB2ZXJpZmllcyB0aGF0IHRoZXJlXG4gKiBpcyBvbmx5IG9uZSBjaGlsZCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cblxuXG5mdW5jdGlvbiBvbmx5Q2hpbGQoY2hpbGRyZW4pIHtcbiAgaWYgKCFpc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaGlsZHJlbjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29udGV4dChkZWZhdWx0VmFsdWUsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKSB7XG4gIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgPSBudWxsO1xuICB9IGVsc2Uge1xuICAgIHtcbiAgICAgIGlmIChjYWxjdWxhdGVDaGFuZ2VkQml0cyAhPT0gbnVsbCAmJiB0eXBlb2YgY2FsY3VsYXRlQ2hhbmdlZEJpdHMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXJyb3IoJ2NyZWF0ZUNvbnRleHQ6IEV4cGVjdGVkIHRoZSBvcHRpb25hbCBzZWNvbmQgYXJndW1lbnQgdG8gYmUgYSAnICsgJ2Z1bmN0aW9uLiBJbnN0ZWFkIHJlY2VpdmVkOiAlcycsIGNhbGN1bGF0ZUNoYW5nZWRCaXRzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YXIgY29udGV4dCA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY2FsY3VsYXRlQ2hhbmdlZEJpdHMsXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRvIHN1cHBvcnQgbXVsdGlwbGUgY29uY3VycmVudCByZW5kZXJlcnMsIHdlIGNhdGVnb3JpemVcbiAgICAvLyBzb21lIHJlbmRlcmVycyBhcyBwcmltYXJ5IGFuZCBvdGhlcnMgYXMgc2Vjb25kYXJ5LiBXZSBvbmx5IGV4cGVjdFxuICAgIC8vIHRoZXJlIHRvIGJlIHR3byBjb25jdXJyZW50IHJlbmRlcmVycyBhdCBtb3N0OiBSZWFjdCBOYXRpdmUgKHByaW1hcnkpIGFuZFxuICAgIC8vIEZhYnJpYyAoc2Vjb25kYXJ5KTsgUmVhY3QgRE9NIChwcmltYXJ5KSBhbmQgUmVhY3QgQVJUIChzZWNvbmRhcnkpLlxuICAgIC8vIFNlY29uZGFyeSByZW5kZXJlcnMgc3RvcmUgdGhlaXIgY29udGV4dCB2YWx1ZXMgb24gc2VwYXJhdGUgZmllbGRzLlxuICAgIF9jdXJyZW50VmFsdWU6IGRlZmF1bHRWYWx1ZSxcbiAgICBfY3VycmVudFZhbHVlMjogZGVmYXVsdFZhbHVlLFxuICAgIC8vIFVzZWQgdG8gdHJhY2sgaG93IG1hbnkgY29uY3VycmVudCByZW5kZXJlcnMgdGhpcyBjb250ZXh0IGN1cnJlbnRseVxuICAgIC8vIHN1cHBvcnRzIHdpdGhpbiBpbiBhIHNpbmdsZSByZW5kZXJlci4gU3VjaCBhcyBwYXJhbGxlbCBzZXJ2ZXIgcmVuZGVyaW5nLlxuICAgIF90aHJlYWRDb3VudDogMCxcbiAgICAvLyBUaGVzZSBhcmUgY2lyY3VsYXJcbiAgICBQcm92aWRlcjogbnVsbCxcbiAgICBDb25zdW1lcjogbnVsbFxuICB9O1xuICBjb250ZXh0LlByb3ZpZGVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9QUk9WSURFUl9UWVBFLFxuICAgIF9jb250ZXh0OiBjb250ZXh0XG4gIH07XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IGZhbHNlO1xuICB2YXIgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSBmYWxzZTtcblxuICB7XG4gICAgLy8gQSBzZXBhcmF0ZSBvYmplY3QsIGJ1dCBwcm94aWVzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIGNvbnRleHQgb2JqZWN0IGZvclxuICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBJdCBoYXMgYSBkaWZmZXJlbnQgJCR0eXBlb2YsIHNvIHdlIGNhbiBwcm9wZXJseVxuICAgIC8vIHdhcm4gZm9yIHRoZSBpbmNvcnJlY3QgdXNhZ2Ugb2YgQ29udGV4dCBhcyBhIENvbnN1bWVyLlxuICAgIHZhciBDb25zdW1lciA9IHtcbiAgICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgICBfY29udGV4dDogY29udGV4dCxcbiAgICAgIF9jYWxjdWxhdGVDaGFuZ2VkQml0czogY29udGV4dC5fY2FsY3VsYXRlQ2hhbmdlZEJpdHNcbiAgICB9OyAvLyAkRmxvd0ZpeE1lOiBGbG93IGNvbXBsYWlucyBhYm91dCBub3Qgc2V0dGluZyBhIHZhbHVlLCB3aGljaCBpcyBpbnRlbnRpb25hbCBoZXJlXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhDb25zdW1lciwge1xuICAgICAgUHJvdmlkZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlcikge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ0NvbnN1bWVyUHJvdmlkZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICBlcnJvcignUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLlByb3ZpZGVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LlByb3ZpZGVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjb250ZXh0LlByb3ZpZGVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfUHJvdmlkZXIpIHtcbiAgICAgICAgICBjb250ZXh0LlByb3ZpZGVyID0gX1Byb3ZpZGVyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZToge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fY3VycmVudFZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlID0gX2N1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9jdXJyZW50VmFsdWUyOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChfY3VycmVudFZhbHVlMikge1xuICAgICAgICAgIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTIgPSBfY3VycmVudFZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF90aHJlYWRDb3VudDoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dC5fdGhyZWFkQ291bnQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF90aHJlYWRDb3VudCkge1xuICAgICAgICAgIGNvbnRleHQuX3RocmVhZENvdW50ID0gX3RocmVhZENvdW50O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ29uc3VtZXI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycykge1xuICAgICAgICAgICAgaGFzV2FybmVkQWJvdXRVc2luZ05lc3RlZENvbnRleHRDb25zdW1lcnMgPSB0cnVlO1xuXG4gICAgICAgICAgICBlcnJvcignUmVuZGVyaW5nIDxDb250ZXh0LkNvbnN1bWVyLkNvbnN1bWVyPiBpcyBub3Qgc3VwcG9ydGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBEaWQgeW91IG1lYW4gdG8gcmVuZGVyIDxDb250ZXh0LkNvbnN1bWVyPiBpbnN0ZWFkPycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBjb250ZXh0LkNvbnN1bWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7IC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG1pc3NpbmcgcHJvcGVydGllcyBiZWNhdXNlIGl0IGRvZXNuJ3QgdW5kZXJzdGFuZCBkZWZpbmVQcm9wZXJ0eVxuXG4gICAgY29udGV4dC5Db25zdW1lciA9IENvbnN1bWVyO1xuICB9XG5cbiAge1xuICAgIGNvbnRleHQuX2N1cnJlbnRSZW5kZXJlciA9IG51bGw7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyMiA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gY29udGV4dDtcbn1cblxuZnVuY3Rpb24gbGF6eShjdG9yKSB7XG4gIHZhciBsYXp5VHlwZSA9IHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTEFaWV9UWVBFLFxuICAgIF9jdG9yOiBjdG9yLFxuICAgIC8vIFJlYWN0IHVzZXMgdGhlc2UgZmllbGRzIHRvIHN0b3JlIHRoZSByZXN1bHQuXG4gICAgX3N0YXR1czogLTEsXG4gICAgX3Jlc3VsdDogbnVsbFxuICB9O1xuXG4gIHtcbiAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGlzIHdvdWxkIGp1c3Qgc2V0IGl0IG9uIHRoZSBvYmplY3QuXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcbiAgICB2YXIgcHJvcFR5cGVzO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGxhenlUeXBlLCB7XG4gICAgICBkZWZhdWx0UHJvcHM6IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gZGVmYXVsdFByb3BzO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdEZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgICBlcnJvcignUmVhY3QubGF6eSguLi4pOiBJdCBpcyBub3Qgc3VwcG9ydGVkIHRvIGFzc2lnbiBgZGVmYXVsdFByb3BzYCB0byAnICsgJ2EgbGF6eSBjb21wb25lbnQgaW1wb3J0LiBFaXRoZXIgc3BlY2lmeSB0aGVtIHdoZXJlIHRoZSBjb21wb25lbnQgJyArICdpcyBkZWZpbmVkLCBvciBjcmVhdGUgYSB3cmFwcGluZyBjb21wb25lbnQgYXJvdW5kIGl0LicpO1xuXG4gICAgICAgICAgZGVmYXVsdFByb3BzID0gbmV3RGVmYXVsdFByb3BzOyAvLyBNYXRjaCBwcm9kdWN0aW9uIGJlaGF2aW9yIG1vcmUgY2xvc2VseTpcblxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsYXp5VHlwZSwgJ2RlZmF1bHRQcm9wcycsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb3BUeXBlczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBwcm9wVHlwZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1Byb3BUeXBlcykge1xuICAgICAgICAgIGVycm9yKCdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBwcm9wVHlwZXNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG5cbiAgICAgICAgICBwcm9wVHlwZXMgPSBuZXdQcm9wVHlwZXM7IC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAncHJvcFR5cGVzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbGF6eVR5cGU7XG59XG5cbmZ1bmN0aW9uIGZvcndhcmRSZWYocmVuZGVyKSB7XG4gIHtcbiAgICBpZiAocmVuZGVyICE9IG51bGwgJiYgcmVuZGVyLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpIHtcbiAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCAnICsgJ2NvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSAnICsgJ21lbW8oZm9yd2FyZFJlZiguLi4pKS4nKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiByZW5kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuJywgcmVuZGVyID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHJlbmRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZW5kZXIubGVuZ3RoICE9PSAwICYmIHJlbmRlci5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBhY2NlcHQgZXhhY3RseSB0d28gcGFyYW1ldGVyczogcHJvcHMgYW5kIHJlZi4gJXMnLCByZW5kZXIubGVuZ3RoID09PSAxID8gJ0RpZCB5b3UgZm9yZ2V0IHRvIHVzZSB0aGUgcmVmIHBhcmFtZXRlcj8nIDogJ0FueSBhZGRpdGlvbmFsIHBhcmFtZXRlciB3aWxsIGJlIHVuZGVmaW5lZC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVuZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZW5kZXIuZGVmYXVsdFByb3BzICE9IG51bGwgfHwgcmVuZGVyLnByb3BUeXBlcyAhPSBudWxsKSB7XG4gICAgICAgIGVycm9yKCdmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgcHJvcFR5cGVzIG9yIGRlZmF1bHRQcm9wcy4gJyArICdEaWQgeW91IGFjY2lkZW50YWxseSBwYXNzIGEgUmVhY3QgY29tcG9uZW50PycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUsXG4gICAgcmVuZGVyOiByZW5kZXJcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCAvLyBOb3RlOiBpdHMgdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgaWYgaXQncyBhIHBvbHlmaWxsLlxuICB0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX0NPTkNVUlJFTlRfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgdHlwZSAhPT0gbnVsbCAmJiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfUkVTUE9OREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfU0NPUEVfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9CTE9DS19UWVBFKTtcbn1cblxuZnVuY3Rpb24gbWVtbyh0eXBlLCBjb21wYXJlKSB7XG4gIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKSkge1xuICAgICAgZXJyb3IoJ21lbW86IFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgY29tcG9uZW50LiBJbnN0ZWFkICcgKyAncmVjZWl2ZWQ6ICVzJywgdHlwZSA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiB0eXBlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9NRU1PX1RZUEUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBjb21wYXJlOiBjb21wYXJlID09PSB1bmRlZmluZWQgPyBudWxsIDogY29tcGFyZVxuICB9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdEN1cnJlbnREaXNwYXRjaGVyLmN1cnJlbnQ7XG5cbiAgaWYgKCEoZGlzcGF0Y2hlciAhPT0gbnVsbCkpIHtcbiAgICB7XG4gICAgICB0aHJvdyBFcnJvciggXCJJbnZhbGlkIGhvb2sgY2FsbC4gSG9va3MgY2FuIG9ubHkgYmUgY2FsbGVkIGluc2lkZSBvZiB0aGUgYm9keSBvZiBhIGZ1bmN0aW9uIGNvbXBvbmVudC4gVGhpcyBjb3VsZCBoYXBwZW4gZm9yIG9uZSBvZiB0aGUgZm9sbG93aW5nIHJlYXNvbnM6XFxuMS4gWW91IG1pZ2h0IGhhdmUgbWlzbWF0Y2hpbmcgdmVyc2lvbnMgb2YgUmVhY3QgYW5kIHRoZSByZW5kZXJlciAoc3VjaCBhcyBSZWFjdCBET00pXFxuMi4gWW91IG1pZ2h0IGJlIGJyZWFraW5nIHRoZSBSdWxlcyBvZiBIb29rc1xcbjMuIFlvdSBtaWdodCBoYXZlIG1vcmUgdGhhbiBvbmUgY29weSBvZiBSZWFjdCBpbiB0aGUgc2FtZSBhcHBcXG5TZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC1pbnZhbGlkLWhvb2stY2FsbCBmb3IgdGlwcyBhYm91dCBob3cgdG8gZGVidWcgYW5kIGZpeCB0aGlzIHByb2JsZW0uXCIgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlcjtcbn1cblxuZnVuY3Rpb24gdXNlQ29udGV4dChDb250ZXh0LCB1bnN0YWJsZV9vYnNlcnZlZEJpdHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuXG4gIHtcbiAgICBpZiAodW5zdGFibGVfb2JzZXJ2ZWRCaXRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yKCd1c2VDb250ZXh0KCkgc2Vjb25kIGFyZ3VtZW50IGlzIHJlc2VydmVkIGZvciBmdXR1cmUgJyArICd1c2UgaW4gUmVhY3QuIFBhc3NpbmcgaXQgaXMgbm90IHN1cHBvcnRlZC4gJyArICdZb3UgcGFzc2VkOiAlcy4lcycsIHVuc3RhYmxlX29ic2VydmVkQml0cywgdHlwZW9mIHVuc3RhYmxlX29ic2VydmVkQml0cyA9PT0gJ251bWJlcicgJiYgQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMl0pID8gJ1xcblxcbkRpZCB5b3UgY2FsbCBhcnJheS5tYXAodXNlQ29udGV4dCk/ICcgKyAnQ2FsbGluZyBIb29rcyBpbnNpZGUgYSBsb29wIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnTGVhcm4gbW9yZSBhdCBodHRwczovL2ZiLm1lL3J1bGVzLW9mLWhvb2tzJyA6ICcnKTtcbiAgICB9IC8vIFRPRE86IGFkZCBhIG1vcmUgZ2VuZXJpYyB3YXJuaW5nIGZvciBpbnZhbGlkIHZhbHVlcy5cblxuXG4gICAgaWYgKENvbnRleHQuX2NvbnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHJlYWxDb250ZXh0ID0gQ29udGV4dC5fY29udGV4dDsgLy8gRG9uJ3QgZGVkdXBsaWNhdGUgYmVjYXVzZSB0aGlzIGxlZ2l0aW1hdGVseSBjYXVzZXMgYnVnc1xuICAgICAgLy8gYW5kIG5vYm9keSBzaG91bGQgYmUgdXNpbmcgdGhpcyBpbiBleGlzdGluZyBjb2RlLlxuXG4gICAgICBpZiAocmVhbENvbnRleHQuQ29uc3VtZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgZXJyb3IoJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LkNvbnN1bWVyKSBpcyBub3Qgc3VwcG9ydGVkLCBtYXkgY2F1c2UgYnVncywgYW5kIHdpbGwgYmUgJyArICdyZW1vdmVkIGluIGEgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH0gZWxzZSBpZiAocmVhbENvbnRleHQuUHJvdmlkZXIgPT09IENvbnRleHQpIHtcbiAgICAgICAgZXJyb3IoJ0NhbGxpbmcgdXNlQ29udGV4dChDb250ZXh0LlByb3ZpZGVyKSBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ0RpZCB5b3UgbWVhbiB0byBjYWxsIHVzZUNvbnRleHQoQ29udGV4dCkgaW5zdGVhZD8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cyk7XG59XG5mdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xufVxuZnVuY3Rpb24gdXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn1cbmZ1bmN0aW9uIHVzZVJlZihpbml0aWFsVmFsdWUpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWYoaW5pdGlhbFZhbHVlKTtcbn1cbmZ1bmN0aW9uIHVzZUVmZmVjdChjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUxheW91dEVmZmVjdChjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlQ2FsbGJhY2soY2FsbGJhY2ssIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlTWVtbyhjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VNZW1vKGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBkZXBzKSB7XG4gIHZhciBkaXNwYXRjaGVyID0gcmVzb2x2ZURpc3BhdGNoZXIoKTtcbiAgcmV0dXJuIGRpc3BhdGNoZXIudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbikge1xuICB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICAgIHJldHVybiBkaXNwYXRjaGVyLnVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKTtcbiAgfVxufVxuXG52YXIgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd247XG5cbntcbiAgcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24gPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnXFxuXFxuQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKHNvdXJjZSkge1xuICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBzb3VyY2UuZmlsZU5hbWUucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpO1xuICAgIHZhciBsaW5lTnVtYmVyID0gc291cmNlLmxpbmVOdW1iZXI7XG4gICAgcmV0dXJuICdcXG5cXG5DaGVjayB5b3VyIGNvZGUgYXQgJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICcuJztcbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyhlbGVtZW50UHJvcHMpIHtcbiAgaWYgKGVsZW1lbnRQcm9wcyAhPT0gbnVsbCAmJiBlbGVtZW50UHJvcHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bShlbGVtZW50UHJvcHMuX19zb3VyY2UpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cblxuXG52YXIgb3duZXJIYXNLZXlVc2VXYXJuaW5nID0ge307XG5cbmZ1bmN0aW9uIGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSkge1xuICB2YXIgaW5mbyA9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuXG4gIGlmICghaW5mbykge1xuICAgIHZhciBwYXJlbnROYW1lID0gdHlwZW9mIHBhcmVudFR5cGUgPT09ICdzdHJpbmcnID8gcGFyZW50VHlwZSA6IHBhcmVudFR5cGUuZGlzcGxheU5hbWUgfHwgcGFyZW50VHlwZS5uYW1lO1xuXG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSBcIlxcblxcbkNoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPFwiICsgcGFyZW50TmFtZSArIFwiPi5cIjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5mbztcbn1cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUV4cGxpY2l0S2V5KGVsZW1lbnQsIHBhcmVudFR5cGUpIHtcbiAgaWYgKCFlbGVtZW50Ll9zdG9yZSB8fCBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgfHwgZWxlbWVudC5rZXkgIT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gIHZhciBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvID0gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKTtcblxuICBpZiAob3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb3duZXJIYXNLZXlVc2VXYXJuaW5nW2N1cnJlbnRDb21wb25lbnRFcnJvckluZm9dID0gdHJ1ZTsgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG5cbiAgdmFyIGNoaWxkT3duZXIgPSAnJztcblxuICBpZiAoZWxlbWVudCAmJiBlbGVtZW50Ll9vd25lciAmJiBlbGVtZW50Ll9vd25lciAhPT0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGNvbXBvbmVudCB0aGF0IG9yaWdpbmFsbHkgY3JlYXRlZCB0aGlzIGNoaWxkLlxuICAgIGNoaWxkT3duZXIgPSBcIiBJdCB3YXMgcGFzc2VkIGEgY2hpbGQgZnJvbSBcIiArIGdldENvbXBvbmVudE5hbWUoZWxlbWVudC5fb3duZXIudHlwZSkgKyBcIi5cIjtcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuXG4gIHtcbiAgICBlcnJvcignRWFjaCBjaGlsZCBpbiBhIGxpc3Qgc2hvdWxkIGhhdmUgYSB1bmlxdWUgXCJrZXlcIiBwcm9wLicgKyAnJXMlcyBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWtleXMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJywgY3VycmVudENvbXBvbmVudEVycm9ySW5mbywgY2hpbGRPd25lcik7XG4gIH1cblxuICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbn1cbi8qKlxuICogRW5zdXJlIHRoYXQgZXZlcnkgZWxlbWVudCBlaXRoZXIgaXMgcGFzc2VkIGluIGEgc3RhdGljIGxvY2F0aW9uLCBpbiBhblxuICogYXJyYXkgd2l0aCBhbiBleHBsaWNpdCBrZXlzIHByb3BlcnR5IGRlZmluZWQsIG9yIGluIGFuIG9iamVjdCBsaXRlcmFsXG4gKiB3aXRoIHZhbGlkIGtleSBwcm9wZXJ0eS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3ROb2RlfSBub2RlIFN0YXRpY2FsbHkgcGFzc2VkIGNoaWxkIG9mIGFueSB0eXBlLlxuICogQHBhcmFtIHsqfSBwYXJlbnRUeXBlIG5vZGUncyBwYXJlbnQncyB0eXBlLlxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZSkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGVbaV07XG5cbiAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzVmFsaWRFbGVtZW50KG5vZGUpKSB7XG4gICAgLy8gVGhpcyBlbGVtZW50IHdhcyBwYXNzZWQgaW4gYSB2YWxpZCBsb2NhdGlvbi5cbiAgICBpZiAobm9kZS5fc3RvcmUpIHtcbiAgICAgIG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5vZGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obm9kZSk7XG5cbiAgICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyB1c2VkIHRvIHByb3ZpZGUgaW1wbGljaXQga2V5cyxcbiAgICAgIC8vIGJ1dCBub3cgd2UgcHJpbnQgYSBzZXBhcmF0ZSB3YXJuaW5nIGZvciB0aGVtIGxhdGVyLlxuICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IG5vZGUuZW50cmllcykge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwobm9kZSk7XG4gICAgICAgIHZhciBzdGVwO1xuXG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBpZiAoaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGFuIGVsZW1lbnQsIHZhbGlkYXRlIHRoYXQgaXRzIHByb3BzIGZvbGxvdyB0aGUgcHJvcFR5cGVzIGRlZmluaXRpb24sXG4gKiBwcm92aWRlZCBieSB0aGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCkge1xuICB7XG4gICAgdmFyIHR5cGUgPSBlbGVtZW50LnR5cGU7XG5cbiAgICBpZiAodHlwZSA9PT0gbnVsbCB8fCB0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKHR5cGUpO1xuICAgIHZhciBwcm9wVHlwZXM7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IC8vIE5vdGU6IE1lbW8gb25seSBjaGVja3Mgb3V0ZXIgcHJvcHMgaGVyZS5cbiAgICAvLyBJbm5lciBwcm9wcyBhcmUgY2hlY2tlZCBpbiB0aGUgcmVjb25jaWxlci5cbiAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEUpKSB7XG4gICAgICBwcm9wVHlwZXMgPSB0eXBlLnByb3BUeXBlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wVHlwZXMpIHtcbiAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgY2hlY2tQcm9wVHlwZXMocHJvcFR5cGVzLCBlbGVtZW50LnByb3BzLCAncHJvcCcsIG5hbWUsIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSk7XG4gICAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUuUHJvcFR5cGVzICE9PSB1bmRlZmluZWQgJiYgIXByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duKSB7XG4gICAgICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IHRydWU7XG5cbiAgICAgIGVycm9yKCdDb21wb25lbnQgJXMgZGVjbGFyZWQgYFByb3BUeXBlc2AgaW5zdGVhZCBvZiBgcHJvcFR5cGVzYC4gRGlkIHlvdSBtaXNzcGVsbCB0aGUgcHJvcGVydHkgYXNzaWdubWVudD8nLCBuYW1lIHx8ICdVbmtub3duJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0eXBlLmdldERlZmF1bHRQcm9wcyA9PT0gJ2Z1bmN0aW9uJyAmJiAhdHlwZS5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQpIHtcbiAgICAgIGVycm9yKCdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJyk7XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEdpdmVuIGEgZnJhZ21lbnQsIHZhbGlkYXRlIHRoYXQgaXQgY2FuIG9ubHkgYmUgcHJvdmlkZWQgd2l0aCBmcmFnbWVudCBwcm9wc1xuICogQHBhcmFtIHtSZWFjdEVsZW1lbnR9IGZyYWdtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZyYWdtZW50UHJvcHMoZnJhZ21lbnQpIHtcbiAge1xuICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGZyYWdtZW50KTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGZyYWdtZW50LnByb3BzKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG5cbiAgICAgIGlmIChrZXkgIT09ICdjaGlsZHJlbicgJiYga2V5ICE9PSAna2V5Jykge1xuICAgICAgICBlcnJvcignSW52YWxpZCBwcm9wIGAlc2Agc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4gJyArICdSZWFjdC5GcmFnbWVudCBjYW4gb25seSBoYXZlIGBrZXlgIGFuZCBgY2hpbGRyZW5gIHByb3BzLicsIGtleSk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50LnJlZiAhPT0gbnVsbCkge1xuICAgICAgZXJyb3IoJ0ludmFsaWQgYXR0cmlidXRlIGByZWZgIHN1cHBsaWVkIHRvIGBSZWFjdC5GcmFnbWVudGAuJyk7XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQobnVsbCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbih0eXBlLCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIHZhbGlkVHlwZSA9IGlzVmFsaWRFbGVtZW50VHlwZSh0eXBlKTsgLy8gV2Ugd2FybiBpbiB0aGlzIGNhc2UgYnV0IGRvbid0IHRocm93LiBXZSBleHBlY3QgdGhlIGVsZW1lbnQgY3JlYXRpb24gdG9cbiAgLy8gc3VjY2VlZCBhbmQgdGhlcmUgd2lsbCBsaWtlbHkgYmUgZXJyb3JzIGluIHJlbmRlci5cblxuICBpZiAoIXZhbGlkVHlwZSkge1xuICAgIHZhciBpbmZvID0gJyc7XG5cbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmIE9iamVjdC5rZXlzKHR5cGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaW5mbyArPSAnIFlvdSBsaWtlbHkgZm9yZ290IHRvIGV4cG9ydCB5b3VyIGNvbXBvbmVudCBmcm9tIHRoZSBmaWxlICcgKyBcIml0J3MgZGVmaW5lZCBpbiwgb3IgeW91IG1pZ2h0IGhhdmUgbWl4ZWQgdXAgZGVmYXVsdCBhbmQgbmFtZWQgaW1wb3J0cy5cIjtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlSW5mbyA9IGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtRm9yUHJvcHMocHJvcHMpO1xuXG4gICAgaWYgKHNvdXJjZUluZm8pIHtcbiAgICAgIGluZm8gKz0gc291cmNlSW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mbyArPSBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKTtcbiAgICB9XG5cbiAgICB2YXIgdHlwZVN0cmluZztcblxuICAgIGlmICh0eXBlID09PSBudWxsKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ251bGwnO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgICAgdHlwZVN0cmluZyA9ICdhcnJheSc7XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSB1bmRlZmluZWQgJiYgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICB0eXBlU3RyaW5nID0gXCI8XCIgKyAoZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpIHx8ICdVbmtub3duJykgKyBcIiAvPlwiO1xuICAgICAgaW5mbyA9ICcgRGlkIHlvdSBhY2NpZGVudGFsbHkgZXhwb3J0IGEgSlNYIGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNvbXBvbmVudD8nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlU3RyaW5nID0gdHlwZW9mIHR5cGU7XG4gICAgfVxuXG4gICAge1xuICAgICAgZXJyb3IoJ1JlYWN0LmNyZWF0ZUVsZW1lbnQ6IHR5cGUgaXMgaW52YWxpZCAtLSBleHBlY3RlZCBhIHN0cmluZyAoZm9yICcgKyAnYnVpbHQtaW4gY29tcG9uZW50cykgb3IgYSBjbGFzcy9mdW5jdGlvbiAoZm9yIGNvbXBvc2l0ZSAnICsgJ2NvbXBvbmVudHMpIGJ1dCBnb3Q6ICVzLiVzJywgdHlwZVN0cmluZywgaW5mbyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IC8vIFRoZSByZXN1bHQgY2FuIGJlIG51bGxpc2ggaWYgYSBtb2NrIG9yIGEgY3VzdG9tIGZ1bmN0aW9uIGlzIHVzZWQuXG4gIC8vIFRPRE86IERyb3AgdGhpcyB3aGVuIHRoZXNlIGFyZSBubyBsb25nZXIgYWxsb3dlZCBhcyB0aGUgdHlwZSBhcmd1bWVudC5cblxuICBpZiAoZWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH0gLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgLy8gZG9lc24ndCBleHBlY3QgYSBub24tc3RyaW5nL2Z1bmN0aW9uIHR5cGUgYW5kIGNhbiB0aHJvdyBjb25mdXNpbmcgZXJyb3JzLlxuICAvLyBXZSBkb24ndCB3YW50IGV4Y2VwdGlvbiBiZWhhdmlvciB0byBkaWZmZXIgYmV0d2VlbiBkZXYgYW5kIHByb2QuXG4gIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gIC8vIGZpeGVkLCB0aGUga2V5IHdhcm5pbmdzIHdpbGwgYXBwZWFyLilcblxuXG4gIGlmICh2YWxpZFR5cGUpIHtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCB0eXBlKTtcbiAgICB9XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkge1xuICAgIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhlbGVtZW50KTtcbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxudmFyIGRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5ID0gZmFsc2U7XG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24odHlwZSkge1xuICB2YXIgdmFsaWRhdGVkRmFjdG9yeSA9IGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbi5iaW5kKG51bGwsIHR5cGUpO1xuICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuXG4gIHtcbiAgICBpZiAoIWRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5KSB7XG4gICAgICBkaWRXYXJuQWJvdXREZXByZWNhdGVkQ3JlYXRlRmFjdG9yeSA9IHRydWU7XG5cbiAgICAgIHdhcm4oJ1JlYWN0LmNyZWF0ZUZhY3RvcnkoKSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gJyArICdhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiBDb25zaWRlciB1c2luZyBKU1ggJyArICdvciB1c2UgUmVhY3QuY3JlYXRlRWxlbWVudCgpIGRpcmVjdGx5IGluc3RlYWQuJyk7XG4gICAgfSAvLyBMZWdhY3kgaG9vazogcmVtb3ZlIGl0XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWxpZGF0ZWRGYWN0b3J5LCAndHlwZScsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdhcm4oJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3R5cGUnLCB7XG4gICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbGlkYXRlZEZhY3Rvcnk7XG59XG5mdW5jdGlvbiBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbihlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBjbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgbmV3RWxlbWVudC50eXBlKTtcbiAgfVxuXG4gIHZhbGlkYXRlUHJvcFR5cGVzKG5ld0VsZW1lbnQpO1xuICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxue1xuXG4gIHRyeSB7XG4gICAgdmFyIGZyb3plbk9iamVjdCA9IE9iamVjdC5mcmVlemUoe30pO1xuICAgIHZhciB0ZXN0TWFwID0gbmV3IE1hcChbW2Zyb3plbk9iamVjdCwgbnVsbF1dKTtcbiAgICB2YXIgdGVzdFNldCA9IG5ldyBTZXQoW2Zyb3plbk9iamVjdF0pOyAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgUm9sbHVwIHRvIG5vdCBjb25zaWRlciB0aGVzZSB1bnVzZWQuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvaXNzdWVzLzE3NzFcbiAgICAvLyBUT0RPOiB3ZSBjYW4gcmVtb3ZlIHRoZXNlIGlmIFJvbGx1cCBmaXhlcyB0aGUgYnVnLlxuXG4gICAgdGVzdE1hcC5zZXQoMCwgMCk7XG4gICAgdGVzdFNldC5hZGQoMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxufVxuXG52YXIgY3JlYXRlRWxlbWVudCQxID0gIGNyZWF0ZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiA7XG52YXIgY2xvbmVFbGVtZW50JDEgPSAgY2xvbmVFbGVtZW50V2l0aFZhbGlkYXRpb24gO1xudmFyIGNyZWF0ZUZhY3RvcnkgPSAgY3JlYXRlRmFjdG9yeVdpdGhWYWxpZGF0aW9uIDtcbnZhciBDaGlsZHJlbiA9IHtcbiAgbWFwOiBtYXBDaGlsZHJlbixcbiAgZm9yRWFjaDogZm9yRWFjaENoaWxkcmVuLFxuICBjb3VudDogY291bnRDaGlsZHJlbixcbiAgdG9BcnJheTogdG9BcnJheSxcbiAgb25seTogb25seUNoaWxkXG59O1xuXG5leHBvcnRzLkNoaWxkcmVuID0gQ2hpbGRyZW47XG5leHBvcnRzLkNvbXBvbmVudCA9IENvbXBvbmVudDtcbmV4cG9ydHMuRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuZXhwb3J0cy5Qcm9maWxlciA9IFJFQUNUX1BST0ZJTEVSX1RZUEU7XG5leHBvcnRzLlB1cmVDb21wb25lbnQgPSBQdXJlQ29tcG9uZW50O1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xuZXhwb3J0cy5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRCA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzO1xuZXhwb3J0cy5jbG9uZUVsZW1lbnQgPSBjbG9uZUVsZW1lbnQkMTtcbmV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ7XG5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50JDE7XG5leHBvcnRzLmNyZWF0ZUZhY3RvcnkgPSBjcmVhdGVGYWN0b3J5O1xuZXhwb3J0cy5jcmVhdGVSZWYgPSBjcmVhdGVSZWY7XG5leHBvcnRzLmZvcndhcmRSZWYgPSBmb3J3YXJkUmVmO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudCA9IGlzVmFsaWRFbGVtZW50O1xuZXhwb3J0cy5sYXp5ID0gbGF6eTtcbmV4cG9ydHMubWVtbyA9IG1lbW87XG5leHBvcnRzLnVzZUNhbGxiYWNrID0gdXNlQ2FsbGJhY2s7XG5leHBvcnRzLnVzZUNvbnRleHQgPSB1c2VDb250ZXh0O1xuZXhwb3J0cy51c2VEZWJ1Z1ZhbHVlID0gdXNlRGVidWdWYWx1ZTtcbmV4cG9ydHMudXNlRWZmZWN0ID0gdXNlRWZmZWN0O1xuZXhwb3J0cy51c2VJbXBlcmF0aXZlSGFuZGxlID0gdXNlSW1wZXJhdGl2ZUhhbmRsZTtcbmV4cG9ydHMudXNlTGF5b3V0RWZmZWN0ID0gdXNlTGF5b3V0RWZmZWN0O1xuZXhwb3J0cy51c2VNZW1vID0gdXNlTWVtbztcbmV4cG9ydHMudXNlUmVkdWNlciA9IHVzZVJlZHVjZXI7XG5leHBvcnRzLnVzZVJlZiA9IHVzZVJlZjtcbmV4cG9ydHMudXNlU3RhdGUgPSB1c2VTdGF0ZTtcbmV4cG9ydHMudmVyc2lvbiA9IFJlYWN0VmVyc2lvbjtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbn07XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBwYXNzaW5nIGZ1bmN0aW9uIGluIG9wdGlvbnMsIHRoZW4gdXNlIGl0IGZvciByZXNvbHZlIFwiaGVhZFwiIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgLy8gVXNlZnVsIGZvciBTaGFkb3cgUm9vdCBzdHlsZSBpLmVcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICBpbnNlcnRJbnRvOiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Zvb1wiKS5zaGFkb3dSb290IH1cbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGdldFRhcmdldC5jYWxsKHRoaXMsIHRhcmdldCk7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gbWVtb1t0YXJnZXRdXG5cdH07XG59KSgpO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09IFwiYm9vbGVhblwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuICAgICAgICBpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRpZihvcHRpb25zLmF0dHJzLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0fVxuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0aWYob3B0aW9ucy5hdHRycy50eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdH1cblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG4iLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcL3xcXHMqJCkvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcbiIsInZhciBCQVNFNjRfQVJSQVkgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCIuc3BsaXQoXCJcIikubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKVxudmFyIEJBU0U2NF9FTkNPREVfVEFCTEUgPSBuZXcgTWFwKEJBU0U2NF9BUlJBWS5tYXAoKG9yZCwgaSkgPT4gW2ksIG9yZF0pKVxudmFyIEJBU0U2NF9ERUNPREVfVEFCTEUgPSBuZXcgTWFwKEJBU0U2NF9BUlJBWS5tYXAoKG9yZCwgaSkgPT4gW29yZCwgaV0pKVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlKGJ1ZmZlcil7XG4gICAgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKS5zbGljZSgpXG4gICAgdmFyIG91dHB1dCA9IG5ldyBVaW50OEFycmF5KE1hdGguY2VpbChNYXRoLmNlaWwoYnVmZmVyLmxlbmd0aCAqIDQgLyAzKSAvIDQpICogNClcbiAgICBsZXQgY29udGludW91cyA9IE1hdGguZmxvb3IoYnVmZmVyLmxlbmd0aCAvIDMpICogM1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250aW51b3VzOyBpKz0zKXtcbiAgICAgICAgbGV0IGsgPSA0ICogaSAvIDNcbiAgICAgICAgb3V0cHV0W2tdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoYnVmZmVyW2ldID4+IDIpXG4gICAgICAgIG91dHB1dFtrKzFdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoKGJ1ZmZlcltpXSAmIDB4MDMpIDw8IDQgfCBidWZmZXJbaSsxXSA+PiA0KVxuICAgICAgICBvdXRwdXRbaysyXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KChidWZmZXJbaSsxXSAmIDB4MEYpIDw8IDIgfCBidWZmZXJbaSsyXSA+PiA2KVxuICAgICAgICBvdXRwdXRbayszXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KGJ1ZmZlcltpKzJdICYgMHgzRilcbiAgICB9XG5cbiAgICBpZiAoYnVmZmVyW2NvbnRpbnVvdXNdICE9IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCBrID0gNCAqIGNvbnRpbnVvdXMgLyAzXG4gICAgICAgIG91dHB1dFtrXSA9IEJBU0U2NF9FTkNPREVfVEFCTEUuZ2V0KGJ1ZmZlcltjb250aW51b3VzXSA+PiAyKVxuICAgICAgICBpZiAoYnVmZmVyW2NvbnRpbnVvdXMrMV0gPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIG91dHB1dFtrKzFdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoKGJ1ZmZlcltjb250aW51b3VzXSAmIDB4MDMpIDw8IDQpIFxuICAgICAgICAgICAgb3V0cHV0W2srMl0gPSBCQVNFNjRfRU5DT0RFX1RBQkxFLmdldCg2NClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dHB1dFtrKzFdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoKGJ1ZmZlcltjb250aW51b3VzXSAmIDB4MDMpIDw8IDQgfCBidWZmZXJbY29udGludW91cysxXSA+PiA0KVxuICAgICAgICAgICAgb3V0cHV0W2srMl0gPSBCQVNFNjRfRU5DT0RFX1RBQkxFLmdldCgoYnVmZmVyW2NvbnRpbnVvdXMrMV0gJiAweDBGKSA8PCAyKVxuICAgICAgICB9XG4gICAgICAgIG91dHB1dFtrKzNdID0gQkFTRTY0X0VOQ09ERV9UQUJMRS5nZXQoNjQpXG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dCBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShidWZmZXIpe1xuICAgIGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcikuc2xpY2UoKVxuICAgIGJ1ZmZlciA9IGJ1ZmZlci5tYXAodiA9PiBCQVNFNjRfREVDT0RFX1RBQkxFLmdldCh2KSlcbiAgICB7IGxldCBwID0gYnVmZmVyLmluZGV4T2YoNjQpOyBidWZmZXIgPSBidWZmZXIuc3ViYXJyYXkoMCwgcCAhPSAtMSA/IHAgOiBidWZmZXIubGVuZ3RoKX1cbiAgICB2YXIgb3V0cHV0ID0gbmV3IFVpbnQ4QXJyYXkoMyAqIGJ1ZmZlci5sZW5ndGggLyA0KSBcbiAgICBsZXQgY29udGludW91cyA9IE1hdGguZmxvb3IoYnVmZmVyLmxlbmd0aCAvIDQpICogNCBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRpbnVvdXM7IGkrPTQpe1xuICAgICAgICBsZXQgayA9IDMgKiBpIC8gNCBcbiAgICAgICAgb3V0cHV0W2tdID0gYnVmZmVyW2ldIDw8IDIgfCBidWZmZXJbaSsxXSA+PiA0XG4gICAgICAgIG91dHB1dFtrKzFdID0gKGJ1ZmZlcltpKzFdICYgMHgwRikgPDwgNCB8IGJ1ZmZlcltpKzJdID4+IDJcbiAgICAgICAgb3V0cHV0W2srMl0gPSAoYnVmZmVyW2krMl0gJiAweDAzKSA8PCA2IHwgYnVmZmVyW2krM10gXG4gICAgfVxuICAgIGlmIChidWZmZXJbY29udGludW91c10gIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbGV0IGsgPSAzICogY29udGludW91cyAvIDQgXG4gICAgICAgIG91dHB1dFtrXSA9IGJ1ZmZlcltjb250aW51b3VzXSA8PCAyIHwgYnVmZmVyW2NvbnRpbnVvdXMrMV0gPj4gNFxuICAgICAgICBpZiAoYnVmZmVyW2NvbnRpbnVvdXMrMl0gIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIG91dHB1dFtrKzFdID0gKGJ1ZmZlcltjb250aW51b3VzKzFdICYgMHgwRikgPDwgNCB8IGJ1ZmZlcltjb250aW51b3VzKzJdID4+IDJcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0XG59IiwiaW1wb3J0IHsgTW9kZU9mT3BlcmF0aW9uIGFzIGFlcyB9IGZyb20gJ2Flcy1qcydcbmltcG9ydCAqIGFzIGJhc2U2NCBmcm9tIFwiLi9iYXNlNjQuanNcIlxuXG5jb25zdCBjU2hhcnBIZWFkZXIgPSBbMCwgMSwgMCwgMCwgMCwgMjU1LCAyNTUsIDI1NSwgMjU1LCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCA2LCAxLCAwLCAwLCAwXVxuY29uc3QgYWVzS2V5ID0gU3RyaW5nVG9CeXRlcygnVUt1NTJlUFVCd2V0Wjl3Tlg4OG81NGRuZktSdTBUMWwnKVxuY29uc3QgZWNiID0gbmV3IGFlcy5lY2IoYWVzS2V5KVxuXG5TdHJpbmcucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnNwbGl0KFwiXCIpLnJldmVyc2UoKS5qb2luKFwiXCIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHJpbmdUb0J5dGVzKHN0cmluZyl7XG4gICAgcmV0dXJuIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShzdHJpbmcpIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gQnl0ZXNUb1N0cmluZyhieXRlcyl7XG4gICAgcmV0dXJuIG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShieXRlcylcbn1cblxuLy8gYWVzIGRlY3J5cHRzIGFuZCByZW1vdmVzIHBrY3M3IHBhZGRpbmcgXG5leHBvcnQgZnVuY3Rpb24gQUVTRGVjcnlwdChieXRlcyl7XG4gICAgbGV0IGRhdGEgPSBlY2IuZGVjcnlwdChieXRlcylcbiAgICBkYXRhID0gZGF0YS5zdWJhcnJheSgwLCAtZGF0YVtkYXRhLmxlbmd0aC0xXSkgXG4gICAgcmV0dXJuIGRhdGFcbn1cblxuLy8gcGtjczcgcGFkcyBhbmQgZW5jcnlwdHMgXG5leHBvcnQgZnVuY3Rpb24gQUVTRW5jcnlwdChieXRlcyl7XG4gICAgbGV0IHBhZFZhbHVlID0gMTYgLSBieXRlcy5sZW5ndGggJSAxNlxuICAgIHZhciBwYWRkZWQgPSBuZXcgVWludDhBcnJheShieXRlcy5sZW5ndGggKyBwYWRWYWx1ZSlcbiAgICBwYWRkZWQuZmlsbChwYWRWYWx1ZSlcbiAgICBwYWRkZWQuc2V0KGJ5dGVzKVxuICAgIHJldHVybiBlY2IuZW5jcnlwdChwYWRkZWQpXG59XG5cbi8vIExlbmd0aFByZWZpeGVkU3RyaW5nIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvY2MyMzY4NDQuYXNweFxuZXhwb3J0IGZ1bmN0aW9uIEdlbmVyYXRlTGVuZ3RoUHJlZml4ZWRTdHJpbmcobGVuZ3RoKXtcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oMHg3RkZGRkZGRiwgbGVuZ3RoKSAvLyBtYXhpbXVtIHZhbHVlXG4gICAgdmFyIGJ5dGVzID0gW10gXG4gICAgZm9yIChsZXQgaT0wOyBpPDQ7IGkrKyl7XG4gICAgICAgIGlmIChsZW5ndGggPj4gNyAhPSAwKXtcbiAgICAgICAgICAgIGJ5dGVzLnB1c2gobGVuZ3RoICYgMHg3RiB8IDB4ODApXG4gICAgICAgICAgICBsZW5ndGggPj49IDcgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlcy5wdXNoKGxlbmd0aCAmIDB4N0YpXG4gICAgICAgICAgICBsZW5ndGggPj49IDdcbiAgICAgICAgICAgIGJyZWFrIFxuICAgICAgICB9XG4gICAgfSBcbiAgICBpZiAobGVuZ3RoICE9IDApe1xuICAgICAgICBieXRlcy5wdXNoKGxlbmd0aClcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXMgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBBZGRIZWFkZXIoYnl0ZXMpe1xuICAgIHZhciBsZW5ndGhEYXRhID0gR2VuZXJhdGVMZW5ndGhQcmVmaXhlZFN0cmluZyhieXRlcy5sZW5ndGgpXG4gICAgdmFyIG5ld0J5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoICsgY1NoYXJwSGVhZGVyLmxlbmd0aCArIGxlbmd0aERhdGEubGVuZ3RoICsgMSlcbiAgICBuZXdCeXRlcy5zZXQoY1NoYXJwSGVhZGVyKSAvLyBmaXhlZCBoZWFkZXIgXG4gICAgbmV3Qnl0ZXMuc3ViYXJyYXkoY1NoYXJwSGVhZGVyLmxlbmd0aCkuc2V0KGxlbmd0aERhdGEpIC8vIHZhcmlhYmxlIExlbmd0aFByZWZpeGVkU3RyaW5nIGhlYWRlciBcbiAgICBuZXdCeXRlcy5zdWJhcnJheShjU2hhcnBIZWFkZXIubGVuZ3RoICsgbGVuZ3RoRGF0YS5sZW5ndGgpLnNldChieXRlcykgLy8gb3VyIGRhdGEgXG4gICAgbmV3Qnl0ZXMuc3ViYXJyYXkoY1NoYXJwSGVhZGVyLmxlbmd0aCArIGxlbmd0aERhdGEubGVuZ3RoICsgYnl0ZXMubGVuZ3RoKS5zZXQoWzExXSkgLy8gZml4ZWQgaGVhZGVyICgxMSkgXG4gICAgcmV0dXJuIG5ld0J5dGVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZW1vdmVIZWFkZXIoYnl0ZXMpe1xuICAgIC8vIHJlbW92ZSBmaXhlZCBjc2hhcnAgaGVhZGVyLCBwbHVzIHRoZSBlbmRpbmcgYnl0ZSAxMS4gXG4gICAgYnl0ZXMgPSBieXRlcy5zdWJhcnJheShjU2hhcnBIZWFkZXIubGVuZ3RoLCBieXRlcy5sZW5ndGggLSAxKSBcbiBcbiAgICBcbiAgICAvLyByZW1vdmUgTGVuZ3RoUHJlZml4ZWRTdHJpbmcgaGVhZGVyIFxuICAgIGxldCBsZW5ndGhDb3VudCA9IDAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspe1xuICAgICAgICBsZW5ndGhDb3VudCsrXG4gICAgICAgIGlmICgoYnl0ZXNbaV0gJiAweDgwKSA9PSAwKXsgXG4gICAgICAgICAgICBicmVhayAgXG4gICAgICAgIH1cbiAgICB9XG4gICAgYnl0ZXMgPSBieXRlcy5zdWJhcnJheShsZW5ndGhDb3VudClcblxuICAgIHJldHVybiBieXRlcyBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERlY29kZShieXRlcyl7XG4gICAgYnl0ZXMgPSBieXRlcy5zbGljZSgpIFxuICAgIGJ5dGVzID0gUmVtb3ZlSGVhZGVyKGJ5dGVzKVxuICAgIGJ5dGVzID0gYmFzZTY0LmRlY29kZShieXRlcylcbiAgICBieXRlcyA9IEFFU0RlY3J5cHQoYnl0ZXMpXG4gICAgcmV0dXJuIEJ5dGVzVG9TdHJpbmcoYnl0ZXMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbmNvZGUoanNvblN0cmluZyl7XG4gICAgdmFyIGJ5dGVzID0gU3RyaW5nVG9CeXRlcyhqc29uU3RyaW5nKVxuICAgIGJ5dGVzID0gQUVTRW5jcnlwdChieXRlcylcbiAgICBieXRlcyA9IGJhc2U2NC5lbmNvZGUoYnl0ZXMpXG4gICAgLy8gYnl0ZXMgPSBieXRlcy5maWx0ZXIodiA9PiB2ICE9IDEwICYmIHYgIT0gMTMpXG4gICAgcmV0dXJuIEFkZEhlYWRlcihieXRlcylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEhhc2goc3RyaW5nKXtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KFwiXCIpLnJlZHVjZSgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gKChhIDw8IDUpIC0gYSkgKyBiLmNoYXJDb2RlQXQoMCkgICBcbiAgICB9LCAwKVxufVxuXG5mdW5jdGlvbiByb3VuZCh2YWx1ZSwgcHJlY2lzaW9uKXtcbiAgICBsZXQgbXVsdGkgPSBNYXRoLnBvdygxMCwgcHJlY2lzaW9uKVxuICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogbXVsdGkpIC8gbXVsdGlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEh1bWFuVGltZShkYXRlKXtcbiAgICB2YXIgbWludXRlcyA9IChuZXcgRGF0ZSgpIC0gZGF0ZSkgLyAxMDAwIC8gNjBcbiAgICB2YXIgaG91cnMgPSBtaW51dGVzIC8gNjAgIFxuICAgIHZhciBkYXlzID0gaG91cnMgLyAyNFxuICAgIHZhciB3ZWVrcyA9IGRheXMgLyA3XG4gICAgdmFyIG1vbnRocyA9IHdlZWtzIC8gNCBcbiAgICB2YXIgeWVhcnMgPSBtb250aHMgLyAxMiBcblxuICAgIGlmIChtaW51dGVzIDwgMSl7XG4gICAgICAgIHJldHVybiBcIm5vd1wiXG4gICAgfSBlbHNlIGlmIChtaW51dGVzIDwgMTIwKXtcbiAgICAgICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKG1pbnV0ZXMsIDApfSBtaW51dGVzIGFnb2BcbiAgICB9IGVsc2UgaWYgKGhvdXJzIDwgNDgpe1xuICAgICAgICByZXR1cm4gYGFib3V0ICR7cm91bmQoaG91cnMsIDApfSBob3VycyBhZ29gXG4gICAgfSBlbHNlIGlmIChkYXlzIDwgMTQpe1xuICAgICAgICByZXR1cm4gYGFib3V0ICR7cm91bmQoZGF5cywgMCl9IGRheXMgYWdvYFxuICAgIH0gZWxzZSBpZiAod2Vla3MgPCA4KXtcbiAgICAgICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKHdlZWtzLCAwKX0gd2Vla3MgYWdvYFxuICAgIH0gZWxzZSBpZiAobW9udGhzIDwgMjQpe1xuICAgICAgICByZXR1cm4gYGFib3V0ICR7cm91bmQobW9udGhzLCAxKX0gbW9udGhzIGFnb2BcbiAgICB9IFxuXG4gICAgcmV0dXJuIGBhYm91dCAke3JvdW5kKHllYXJzLCAxKX0geWVhcnMgYWdvYFxufVxuXG5leHBvcnQgZnVuY3Rpb24gRG93bmxvYWREYXRhKGRhdGEsIGZpbGVOYW1lKXtcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgYS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtkYXRhXSwge3R5cGU6IFwib2N0ZXQvc3RyZWFtXCJ9KSkpO1xuICAgIGEuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVOYW1lKVxuICAgIGEuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBwb3NpdGlvbjogZml4ZWQ7IG9wYWNpdHk6IDA7IGxlZnQ6IDA7IHRvcDogMDtgKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGEpXG4gICAgYS5jbGljaygpXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKVxufVxuIiwiY29uc3QgTE9DQUxfU1RPUkFHRV9OQU1FID0gXCJibG9vZG9yY2FAaG9sbG93XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zeW5jRnJvbUxvY2FsU3RvcmFnZSgpXG4gIH1cbiAgY291bnQoKXtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aCBcbiAgfVxuICBzeW5jRnJvbUxvY2FsU3RvcmFnZSgpe1xuICAgIHZhciByZXMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9TVE9SQUdFX05BTUUpXG4gICAgdGhpcy5oaXN0b3J5ID0gcmVzID8gSlNPTi5wYXJzZShyZXMpLmhpc3RvcnkgOiBbXSBcbiAgICB0aGlzLmhpc3RvcnkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uZGF0ZSA9IG5ldyBEYXRlKGl0ZW0uZGF0ZSlcbiAgICB9KVxuICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB0aGlzLm9uQ2hhbmdlKClcbiAgfVxuICBzeW5jVG9Mb2NhbFN0b3JhZ2UoKXtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oTE9DQUxfU1RPUkFHRV9OQU1FLCBKU09OLnN0cmluZ2lmeSh7aGlzdG9yeTogdGhpcy5oaXN0b3J5fSkpXG4gICAgfSBjYXRjaCAoZXJyKXtcbiAgICAgIHZhciBkZXBhcnRlZCA9IHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoLTFdXG4gICAgICBjb25zb2xlLmVycm9yKGBsb2NhbFN0b3JhZ2UgcXVvdGEgcmVhY2hlZCEgUmVtb3ZpbmcgXCIke2RlcGFydGVkLmhhc2h9XCIsIHRoZSBsZWFzdCByZWNlbnQgZmlsZS5gKVxuICAgICAgdGhpcy5yZW1vdmVMZWFzdFJlY2VudCgpXG4gICAgICB0aGlzLnN5bmNUb0xvY2FsU3RvcmFnZSgpXG4gICAgfVxuICB9XG4gIGFkZFRvSGlzdG9yeShqc29uU3RyaW5nLCBmaWxlTmFtZSwgaGFzaCl7XG4gICAgdGhpcy5oaXN0b3J5LnVuc2hpZnQoe1xuICAgICAgZGF0ZTogbmV3IERhdGUoKSwgXG4gICAgICBmaWxlTmFtZSwgXG4gICAgICBqc29uU3RyaW5nLFxuICAgICAgaGFzaDogaGFzaCBcbiAgICB9KVxuICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB0aGlzLm9uQ2hhbmdlKClcbiAgfVxuICByZW1vdmVGcm9tSGlzdG9yeShoYXNoKXtcbiAgICB0aGlzLmhpc3RvcnkgPSB0aGlzLmhpc3RvcnkuZmlsdGVyKGl0ZW0gPT4gaXRlbS5oYXNoICE9IGhhc2gpXG4gICAgaWYgKHRoaXMub25DaGFuZ2UpIHRoaXMub25DaGFuZ2UoKVxuICB9XG4gIHJlbW92ZUxlYXN0UmVjZW50KCl7XG4gICAgaWYgKHRoaXMuaGlzdG9yeS5sZW5ndGggIT0gMCl7XG4gICAgICB0aGlzLmhpc3RvcnkucG9wKCkgXG4gICAgfVxuICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB0aGlzLm9uQ2hhbmdlKClcbiAgfVxufSIsImltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiXG5pbXBvcnQgeyBFbmNvZGUsIERlY29kZSwgSGFzaCwgRG93bmxvYWREYXRhLCBIdW1hblRpbWUgfSBmcm9tIFwiLi9mdW5jdGlvbnMuanNcIlxuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vaGlzdG9yeS5qc1wiXG5pbXBvcnQgV2luZG93RHJhZyBmcm9tIFwiLi93aW5kb3dEcmFnLmpzXCJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCJcblxudmFyIGhpc3RvcnkgPSBuZXcgSGlzdG9yeSgpXG52YXIgd2luZG93RHJhZyA9IG5ldyBXaW5kb3dEcmFnKClcblxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuZmlsZUlucHV0UmVmID0gUmVhY3QuY3JlYXRlUmVmKClcbiAgICAgICAgd2luZG93RHJhZy5vbkRyb3AgPSBlID0+IHRoaXMuaGFuZGxlRmlsZUNoYW5nZShlLmRhdGFUcmFuc2Zlci5maWxlcykgXG4gICAgICAgIHdpbmRvd0RyYWcub25EcmFnRW50ZXIgPSAoKSA9PiB0aGlzLnNldFN0YXRlKHsgZHJhZ2dpbmc6IHRydWUgfSlcbiAgICAgICAgd2luZG93RHJhZy5vbkRyYWdMZWF2ZSA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBkcmFnZ2luZzogZmFsc2UgfSlcbiAgICB9XG4gICAgc3RhdGUgPSB7XG4gICAgICAgIGdhbWVGaWxlOiBcIlwiLCBcbiAgICAgICAgZ2FtZUZpbGVPcmlnaW5hbDogXCJcIixcbiAgICAgICAgZWRpdGluZzogZmFsc2UsXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgICAgc3dpdGNoTW9kZTogZmFsc2UgXG4gICAgfVxuICAgIGhhbmRsZUZpbGVDbGljayA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5maWxlSW5wdXRSZWYuY3VycmVudC5jbGljaygpXG4gICAgfVxuICAgIGhhbmRsZUZpbGVDaGFuZ2UgPSBmaWxlcyA9PiB7XG5cdFx0aWYgKGZpbGVzLmxlbmd0aCA9PSAwKXtcblx0XHRcdHJldHVybiBcblx0XHR9XG5cdFx0XG5cdFx0bGV0IGZpbGUgPSBmaWxlc1swXVxuXHRcdGxldCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zd2l0Y2hNb2RlKXtcblx0XHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKVxuXHRcdH1cblxuXHRcdHJlYWRlci5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gcmVhZGVyLnJlc3VsdFxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IGRlY3J5cHRlZCA9IFwiXCJcblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUuc3dpdGNoTW9kZSkge1xuXHRcdFx0XHRcdGRlY3J5cHRlZCA9IHJlc3VsdFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlY3J5cHRlZCA9IERlY29kZShuZXcgVWludDhBcnJheShyZXN1bHQpKVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShkZWNyeXB0ZWQpLCB1bmRlZmluZWQsIDIpXG5cdFx0XHRcdGNvbnN0IGhhc2ggPSBIYXNoKGpzb25TdHJpbmcpXG5cdFx0XHRcdGhpc3RvcnkucmVtb3ZlRnJvbUhpc3RvcnkoaGFzaClcblx0XHRcdFx0aGlzdG9yeS5hZGRUb0hpc3RvcnkoanNvblN0cmluZywgZmlsZS5uYW1lLCBoYXNoKVxuXHRcdFx0XHRoaXN0b3J5LnN5bmNUb0xvY2FsU3RvcmFnZSgpXG5cdFx0XHRcdHRoaXMuc2V0R2FtZUZpbGUoanNvblN0cmluZywgZmlsZS5uYW1lKVxuXHRcdFx0fSBjYXRjaCAoZXJyKXtcblx0XHRcdFx0d2luZG93LmFsZXJ0KFwiVGhlIGZpbGUgY291bGQgbm90IGRlY3J5cHRlZC5cIilcblx0XHRcdFx0Y29uc29sZS53YXJuKGVycilcblx0XHRcdH0gXG5cdFx0XHR0aGlzLmZpbGVJbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gbnVsbFxuXHRcdH0pXG4gICAgfVxuICAgIGhhbmRsZUVkaXRvckNoYW5nZSA9IGUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtnYW1lRmlsZTogZS50YXJnZXQudmFsdWV9KVxuICAgIH1cbiAgICBoYW5kbGVSZXNldCA9IGUgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGdhbWVGaWxlOiB0aGlzLnN0YXRlLmdhbWVGaWxlT3JpZ2luYWxcbiAgICAgICAgfSkgXG4gICAgfVxuXHRoYW5kbGVEb3dubG9hZEFzU3dpdGNoU2F2ZSA9IGUgPT4ge1xuXHRcdHRyeSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodGhpcy5zdGF0ZS5nYW1lRmlsZSkpXG4gICAgICAgICAgICBEb3dubG9hZERhdGEoZGF0YSwgXCJwbGFpbi5kYXRcIilcbiAgICAgICAgfSBjYXRjaCAoZXJyKXtcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydChcIkNvdWxkIG5vdCBwYXJzZSB2YWxpZCBKU09OLiBSZXNldCBvciBmaXguXCIpXG4gICAgICAgIH1cbiAgICB9XG4gICAgaGFuZGxlRG93bmxvYWQgPSBlID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh0aGlzLnN0YXRlLmdhbWVGaWxlKSlcbiAgICAgICAgICAgIHZhciBlbmNyeXB0ZWQgPSBFbmNvZGUoZGF0YSlcbiAgICAgICAgICAgIERvd25sb2FkRGF0YShlbmNyeXB0ZWQsIFwidXNlcjEuZGF0XCIpXG4gICAgICAgIH0gY2F0Y2ggKGVycil7XG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoXCJDb3VsZCBub3QgcGFyc2UgdmFsaWQgSlNPTi4gUmVzZXQgb3IgZml4LlwiKVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldEdhbWVGaWxlID0gKGpzb25TdHJpbmcsIG5hbWUpID0+IHtcbiAgICAgICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UoanNvblN0cmluZyksIHVuZGVmaW5lZCwgMilcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBnYW1lRmlsZToganNvblN0cmluZyxcbiAgICAgICAgICAgIGdhbWVGaWxlT3JpZ2luYWw6IGpzb25TdHJpbmcsXG4gICAgICAgICAgICBnYW1lRmlsZU5hbWU6IG5hbWUsIFxuICAgICAgICAgICAgZWRpdGluZzogdHJ1ZSBcbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmVuZGVyKCl7XG4gICAgICAgIHJldHVybiA8ZGl2IGlkPVwid3JhcHBlclwiPlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuZHJhZ2dpbmcgJiYgPGRpdiBpZD1cImNvdmVyXCI+PC9kaXY+fVxuICAgICAgICAgICAgPHAgaWQ9XCJkZXNjcmlwdGlvblwiPlRoaXMgb25saW5lIHRvb2wgYWxsb3dzIHlvdSB0byBtb2RpZnkgYSBIb2xsb3cgS25pZ2h0IHNhdmUgZmlsZS4gWW91IGNhbiBhbHNvIHVzZSB0aGlzIHRvIGNvbnZlcnQgeW91ciBQQyBzYXZlIHRvIGFuZCBmcm9tIGEgU3dpdGNoIHNhdmUuPC9wPlxuICAgICAgICAgICAgPHAgaWQ9XCJzb3VyY2VcIj5Zb3UgY2FuIHZpZXcgdGhlIHNvdXJjZSBjb2RlIGluIHRoZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2Jsb29kb3JjYS9ob2xsb3dcIj5naXRodWIgcmVwbzwvYT4uPC9wPlxuXHRcdFx0PHVsIGlkPVwiaW5zdHJ1Y3Rpb25zXCI+XG4gICAgICAgICAgICAgICAgPGxpPk1ha2UgYSBiYWNrdXAgb2YgeW91ciBvcmlnaW5hbCBmaWxlLjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPlNlbGVjdCBvciBkcmFnIGluIHRoZSBzb3VyY2Ugc2F2ZSBmaWxlIHlvdSB3YW50IHRvIG1vZGlmeS48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5Nb2RpZnkgeW91ciBzYXZlIGZpbGUuIEN0cmwtRiAvIENtZC1GIGlzIHlvdXIgYmVzdCBmcmllbmQuPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+RG93bmxvYWQgeW91ciBuZXcgbW9kaWZlZCBzYXZlIGZpbGUuPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG5cdFx0XHQ8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJmaWxlLWJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRmlsZUNsaWNrfT5TZWxlY3QgRmlsZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2hlY2tlZD17dGhpcy5zdGF0ZS5zd2l0Y2hNb2RlfSBvbkNsaWNrPXtlID0+IHRoaXMuc2V0U3RhdGUoe3N3aXRjaE1vZGU6ICF0aGlzLnN0YXRlLnN3aXRjaE1vZGV9KX0gdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJzd2l0Y2gtc2F2ZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIHN0eWxlPXt7Y29sb3I6IHRoaXMuc3RhdGUuc3dpdGNoTW9kZSA/IFwiaW5oZXJpdFwiIDogXCIjNzc3XCJ9fSBodG1sRm9yPVwic3dpdGNoLXNhdmVcIj5OaW50ZW5kbyBTd2l0Y2ggTW9kZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aW5wdXQgb25DaGFuZ2U9e2UgPT4geyB0aGlzLmhhbmRsZUZpbGVDaGFuZ2UodGhpcy5maWxlSW5wdXRSZWYuY3VycmVudC5maWxlcykgfX0gaWQ9XCJmaWxlLWlucHV0XCIgIHJlZj17dGhpcy5maWxlSW5wdXRSZWZ9IHR5cGU9XCJmaWxlXCIvPlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuZWRpdGluZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImVkaXRvci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiZWRpdG9yLW5hbWVcIj57dGhpcy5zdGF0ZS5nYW1lRmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJlZGl0b3JcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVFZGl0b3JDaGFuZ2V9IHZhbHVlPXt0aGlzLnN0YXRlLmdhbWVGaWxlfSBzcGVsbENoZWNrPXtmYWxzZX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImVkaXRvci1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PnJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRG93bmxvYWRBc1N3aXRjaFNhdmV9PmRvd25sb2FkIHBsYWluIHRleHQgKFN3aXRjaCk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVEb3dubG9hZH0+ZG93bmxvYWQgZW5jcnlwdGVkIChQQyk8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPEhpc3RvcnlDb21wb25lbnQgXG4gICAgICAgICAgICAgICAgaGFuZGxlQ2xpY2s9eyhqc29uU3RyaW5nLCBmaWxlTmFtZSkgPT4gdGhpcy5zZXRHYW1lRmlsZShqc29uU3RyaW5nLCBmaWxlTmFtZSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICB9XG59XG5cbmNsYXNzIEhpc3RvcnlDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgaGlzdG9yeS5vbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpe1xuICAgICAgICBpZiAoaGlzdG9yeS5jb3VudCgpID09IDApIHJldHVybiBudWxsIFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD1cImhpc3RvcnlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2Pkhpc3Rvcnk8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlN0b3JlcyBhIGxpbWl0ZWQgYW1vdW50IG9mIHJlY2VudCBmaWxlcy4gRG8gbm90IHVzZSB0aGlzIGFzIGFuIGFsdGVybmF0aXZlIHRvIG1ha2luZyBiYWNrdXBzLjwvZGl2PlxuICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAge2hpc3RvcnkuaGlzdG9yeS5tYXAoaXRlbSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLmhhc2h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmhhbmRsZUNsaWNrKGl0ZW0uanNvblN0cmluZywgaXRlbS5maWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Db250ZXh0TWVudT17ZSA9PiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnJlbW92ZUZyb21IaXN0b3J5KGl0ZW0uaGFzaCk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnN5bmNUb0xvY2FsU3RvcmFnZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlzdG9yeS1pdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnktbmFtZVwiPkhBU0gge2l0ZW0uaGFzaH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnktZGF0ZVwiPntIdW1hblRpbWUoaXRlbS5kYXRlKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuXG5cblJlYWN0RE9NLnJlbmRlcig8QXBwLz4sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSlcblxuXG5cblxuIiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCIpO1xuXG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcblxudmFyIHRyYW5zZm9ybTtcbnZhciBpbnNlcnRJbnRvO1xuXG5cblxudmFyIG9wdGlvbnMgPSB7XCJobXJcIjp0cnVlfVxuXG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxub3B0aW9ucy5pbnNlcnRJbnRvID0gdW5kZWZpbmVkO1xuXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5cbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59IiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaW5kb3dEcmFnIHtcbiAgZHJhZ0luZGV4ID0gMCBcbiAgY29uc3RydWN0b3IoKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBlID0+IHtcbiAgICAgIHRoaXMuZHJhZ0luZGV4KysgXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGlmICh0aGlzLm9uRHJhZ0VudGVyKSB0aGlzLm9uRHJhZ0VudGVyKGUpXG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBlID0+IHtcbiAgICAgIGlmICgtLXRoaXMuZHJhZ0luZGV4ID09PSAwICYmIHRoaXMub25EcmFnTGVhdmUpIHRoaXMub25EcmFnTGVhdmUoZSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBlID0+IHtcblxuICAgICAgaWYgKHRoaXMuZHJhZ0luZGV4ID4gMCl7XG4gICAgICAgIGlmICgtLXRoaXMuZHJhZ0luZGV4ID09PSAwICYmIHRoaXMub25EcmFnTGVhdmUpe1xuICAgICAgICAgIHRoaXMub25EcmFnTGVhdmUoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9uRHJvcCkgdGhpcy5vbkRyb3AoZSlcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH0pXG4gIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9