"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AzureBlobTransport = exports.DEFAULT_SYNC_DELAY = exports.DEFAULT_NAME_FORMAT = void 0;

var _async = _interopRequireDefault(require("async"));

var _azureStorage = _interopRequireDefault(require("azure-storage"));

var _tripleBeam = require("triple-beam");

var _winstonTransport = _interopRequireDefault(require("winston-transport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_NAME_FORMAT = "{yyyy}/{MM}/{dd}/{hh}/node.log";
exports.DEFAULT_NAME_FORMAT = DEFAULT_NAME_FORMAT;
var DEFAULT_SYNC_DELAY = 1000;
exports.DEFAULT_SYNC_DELAY = DEFAULT_SYNC_DELAY;
var MS_IN_DAY = 24 * 60 * 60 * 1000;

var AzureBlobTransport = /*#__PURE__*/function (_TransportStream) {
  _inherits(AzureBlobTransport, _TransportStream);

  var _super = _createSuper(AzureBlobTransport);

  function AzureBlobTransport(opts) {
    var _this;

    _classCallCheck(this, AzureBlobTransport);

    _this = _super.call(this, opts);

    _defineProperty(_assertThisInitialized(_this), "name", void 0);

    _defineProperty(_assertThisInitialized(_this), "trace", void 0);

    _defineProperty(_assertThisInitialized(_this), "syncDelay", void 0);

    _defineProperty(_assertThisInitialized(_this), "cargo", void 0);

    _defineProperty(_assertThisInitialized(_this), "containerName", void 0);

    _defineProperty(_assertThisInitialized(_this), "nameFormat", void 0);

    _defineProperty(_assertThisInitialized(_this), "retention", void 0);

    _defineProperty(_assertThisInitialized(_this), "blobService", void 0);

    _defineProperty(_assertThisInitialized(_this), "nextClean", void 0);

    _defineProperty(_assertThisInitialized(_this), "cleanOldLogs", function () {
      // only once per day
      var now = Date.now();

      if (_this.nextClean && now < _this.nextClean) {
        setTimeout(_this.cleanOldLogs, _this.nextClean - now);
        return;
      }

      var nowDate = new Date(now);
      _this.nextClean = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime() + 86400000;

      var prefixIndex = _this.nameFormat.indexOf('{');

      if (prefixIndex < 0) {
        // we can't clean if we can't get a date out of the file!
        _this.debug("unable to find a date in the name format " + "".concat(_this.nameFormat, " - unable to clean logs"));

        return;
      }

      var prefix = _this.nameFormat.substr(0, prefixIndex);

      _this.listBlobs({
        now: now,
        prefix: prefix,
        entries: []
      }, null);

      setTimeout(_this.cleanOldLogs, _this.nextClean - now);

      _this.debug("next clean at ".concat(new Date(_this.nextClean), ", ") + "retention is ".concat(_this.retention, " day").concat(_this.retention > 1 ? "s" : ""));
    });

    if (!opts.containerUrl) {
      throw new Error("The containerUrl property must be specified");
    }

    _this.name = opts.name || "AzureBlobTransport";
    _this.trace = opts.trace === true;
    _this.syncDelay = opts.syncDelay == undefined ? DEFAULT_SYNC_DELAY : opts.syncDelay;

    _this.buildCargo();

    _this.createSas(opts.containerUrl);

    _this.nameFormat = opts.nameFormat || DEFAULT_NAME_FORMAT, _this.retention = opts.retention;

    if (_this.retention) {
      setTimeout(_this.cleanOldLogs, 1);
    }

    return _this;
  }

  _createClass(AzureBlobTransport, [{
    key: "debug",
    value: function debug(msg) {
      if (this.trace) {
        console.log(msg);
      }
    }
  }, {
    key: "createSas",
    value: function createSas(containerUrl) {
      var url = new URL(containerUrl);
      var sas = url.search;

      if (sas.startsWith("?")) {
        sas = sas.substr(1);
      }

      this.debug("create SAS for ".concat(url.protocol, "//").concat(url.host, ", sasToken=").concat(sas));
      this.blobService = _azureStorage["default"].createBlobServiceWithSas("".concat(url.protocol, "//").concat(url.host), sas);
      this.containerName = url.pathname;

      if (this.containerName.startsWith("/")) {
        this.containerName = this.containerName.substr(1);
      } // console.log(`create blob container ${url.protocol}//${url.host}/${this.containerName}`);
      // this.blobService.createContainerIfNotExists(this.containerName, (error, result, response) => {
      //     if (error) {
      //         console.error(`creating the blob container ${this.containerName} ` +
      //             `failed with ${JSON.stringify(error, null, 2)}`);
      //     }
      // });

    }
  }, {
    key: "log",
    value: function log(info, callback) {
      this.cargo.push({
        line: info[_tripleBeam.MESSAGE],
        callback: callback
      });
    }
  }, {
    key: "getBlobName",
    value: function getBlobName() {
      var now = new Date();
      var M = "" + (now.getMonth() + 1);
      var d = "" + now.getDate();
      var h = "" + now.getHours();
      var m = "" + now.getMinutes();
      var name = this.nameFormat.replace(/\{yyyy\}/g, "" + now.getFullYear()).replace(/\{MM\}/g, M.padStart(2, "0")).replace(/\{M\}/g, M).replace(/\{dd\}/g, d.padStart(2, "0")).replace(/\{d\}/g, d).replace(/\{hh\}/g, h.padStart(2, "0")).replace(/\{h\}/g, h).replace(/\{mm\}/g, m.padStart(2, "0")).replace(/\{m\}/g, m);
      this.debug("using log name ".concat(name, " based on format ").concat(this.nameFormat));
      return name;
    }
  }, {
    key: "parseName",
    value: function parseName(name) {
      // tslint:disable-next-line:one-variable-per-declaration
      var y = -1,
          M = 1,
          d = 1,
          h = 0,
          m = 0; // tslint:disable-next-line:one-variable-per-declaration

      var formatPos = 0,
          namePos = 0;
      var ok = true;

      while (namePos < name.length && formatPos < this.nameFormat.length) {
        var formatChar = this.nameFormat.charAt(formatPos++);

        if (formatChar !== '{') {
          var nameChar = name.charAt(namePos++);

          if (nameChar !== formatChar) {
            ok = false;
            break;
          }

          continue;
        }

        var num = "";

        for (; namePos < name.length; ++namePos) {
          var numChar = name.charAt(namePos);

          if (numChar < '0' || numChar > '9') {
            break;
          }

          num += numChar;
        }

        if (num.length === 0) {
          ok = false;
          break;
        }

        var format = "";

        while (formatPos < this.nameFormat.length) {
          formatChar = this.nameFormat.charAt(formatPos++);

          if (formatChar === '}') {
            break;
          }

          format += formatChar;
        }

        if (formatChar !== '}') {
          ok = false;
          break;
        }

        var inum = parseInt(num, 10);

        if (format === "yyyy" || format === "y") {
          y = inum;
        } else if (format === "MM" || format === "M") {
          M = inum;
        } else if (format === "dd" || format === "d") {
          d = inum;
        } else if (format === "hh" || format === "h") {
          h = inum;
        } else if (format === "mm" || format === "m") {
          m = inum;
        } else {
          ok = false;
          break;
        }
      }

      if (!ok || y === -1) {
        this.debug("the blob name ".concat(name, " does not match the name format ").concat(this.nameFormat) + "- parsed y = ".concat(y, ", M = ").concat(m, ", d = ").concat(d, ", h = ").concat(h, ", m = ").concat(m, "."));
        return -1;
      }

      return new Date(y, M - 1, d, h, m).getTime();
    }
  }, {
    key: "listBlobsCallback",
    value: function listBlobsCallback(state, error, result, response) {
      if (error) {
        console.error("listing storage blobs failed with ".concat(JSON.stringify(error, null, 2)));
        return;
      }

      var retention = this.retention * MS_IN_DAY;

      var _iterator = _createForOfIteratorHelper(result.entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var timestamp = this.parseName(entry.name);

          if (timestamp > 0) {
            this.debug("parsed name ".concat(entry.name, " giving timestamp ").concat(new Date(timestamp).toISOString()) + " (ms = ".concat(timestamp, ", retention = ").concat(retention, ",") + " expires = ".concat(timestamp + retention, ", now = ").concat(state.now, ")"));
          }

          if (timestamp + retention < state.now) {
            this.debug("clean old blob ".concat(entry.name));
            state.entries.push(entry.name);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (result.continuationToken) {
        this.listBlobs(state, result.continuationToken);
      } else {
        this.listBlobsComplete(state);
      }
    }
  }, {
    key: "listBlobs",
    value: function listBlobs(state, token) {
      var _this2 = this;

      this.blobService.listBlobsSegmentedWithPrefix(this.containerName, state.prefix, token, function (err, res, resp) {
        return _this2.listBlobsCallback(state, err, res, resp);
      });
    }
  }, {
    key: "deleteBlobComplete",
    value: function deleteBlobComplete(name, err, result) {
      if (err) {
        console.error("deleting old log {name} failed with ".concat(JSON.stringify(err, null, 2)));
      } else {
        this.debug("deleting old log ".concat(name, " ").concat(result ? "succeeded" : "failed"));
      }
    }
  }, {
    key: "listBlobsComplete",
    value: function listBlobsComplete(state) {
      var _this3 = this;

      var _iterator2 = _createForOfIteratorHelper(state.entries),
          _step2;

      try {
        var _loop = function _loop() {
          var entry = _step2.value;

          _this3.debug("deleting old log ".concat(entry));

          _this3.blobService.deleteBlobIfExists(_this3.containerName, entry, function (err, result) {
            return _this3.deleteBlobComplete(entry, err, result);
          });
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "createBlockComplete",
    value: function createBlockComplete(err, blobName, blockDone) {
      if (err) {
        console.error("BlobService.createAppendBlobFromText(" + "".concat(this.containerName, "/").concat(blobName, ") failed with = ") + "".concat(JSON.stringify(err, null, 2)));
      }

      blockDone();
    }
  }, {
    key: "writeBlockComplete",
    value: function writeBlockComplete(err, blobName, block, blockDone) {
      var _this4 = this;

      if (err) {
        if (err.code === "BlobNotFound") {
          // The cast here is because the docs differ from the typescript
          // bindings (there are other TS bugs, so go with the docs)
          var blobRequestOptions = {
            absorbConditionalErrorsOnRetry: true
          };
          this.debug("creating new blob ".concat(this.containerName, "/").concat(blobName));
          this.blobService.createAppendBlobFromText(this.containerName, blobName, block, blobRequestOptions, function (cerr) {
            return _this4.createBlockComplete(cerr, blobName, blockDone);
          });
          return;
        }

        console.error("BlobService.appendBlockFromText(" + "".concat(this.containerName, "/").concat(blobName, ") failed with ") + "error = ".concat(JSON.stringify(err, null, 2)));
      }

      blockDone();
    }
  }, {
    key: "writeBlock",
    value: function writeBlock(blobName, block, blockDone) {
      var _this5 = this;

      this.debug("writing block of size ".concat(block.length, " = ").concat(block));
      var blobRequestOptions = {
        absorbConditionalErrorsOnRetry: true
      };
      this.blobService.appendBlockFromText(this.containerName, blobName, block, blobRequestOptions, function (err) {
        return _this5.writeBlockComplete(err, blobName, block, blockDone);
      });
    }
  }, {
    key: "buildCargo",
    value: function buildCargo() {
      var _this6 = this;

      this.cargo = _async["default"].cargo(function (tasks, completed) {
        var t0 = Date.now();

        _this6.debug("logging ".concat(tasks.length, " line").concat(tasks.length > 1 ? "s" : ""));

        var lines = tasks.reduce(function (pv, v) {
          return pv + v.line + "\n";
        }, ""); // The cast is because the typescript typings are wrong
        // UTF-8 chars can be 4 bytes so divide by 4

        var blockSize = _azureStorage["default"].Constants.BlobConstants.MAX_APPEND_BLOB_BLOCK_SIZE / 4;

        var blocks = _this6.chunk(lines, blockSize);

        var blobName = _this6.getBlobName();

        var completeTasks = function completeTasks(err) {
          var _iterator3 = _createForOfIteratorHelper(tasks),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var task = _step3.value;

              if (task.callback) {
                task.callback();
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          completed();
        };

        var completeTasksDelayed = function completeTasksDelayed(err) {
          var spentTime = Math.max(Date.now() - t0, 0);
          var delay = _this6.syncDelay - spentTime;

          if (delay > 0) {
            setTimeout(function () {
              return completeTasks(err);
            }, delay);
          } else {
            completeTasks(err);
          }
        };

        var writeBlock = function writeBlock(block, blockDone) {
          return _this6.writeBlock(blobName, block, blockDone);
        };

        _async["default"].eachSeries(blocks, writeBlock, completeTasksDelayed);
      });
    }
  }, {
    key: "chunk",
    value: function chunk(str, size) {
      var numChunks = Math.ceil(str.length / size);
      var chunks = new Array(numChunks);

      for (var i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
      }

      return chunks;
    }
  }]);

  return AzureBlobTransport;
}(_winstonTransport["default"]);

exports.AzureBlobTransport = AzureBlobTransport;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BenVyZUJsb2JUcmFuc3BvcnQudHMiXSwibmFtZXMiOlsiREVGQVVMVF9OQU1FX0ZPUk1BVCIsIkRFRkFVTFRfU1lOQ19ERUxBWSIsIk1TX0lOX0RBWSIsIkF6dXJlQmxvYlRyYW5zcG9ydCIsIm9wdHMiLCJub3ciLCJEYXRlIiwibmV4dENsZWFuIiwic2V0VGltZW91dCIsImNsZWFuT2xkTG9ncyIsIm5vd0RhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldFRpbWUiLCJwcmVmaXhJbmRleCIsIm5hbWVGb3JtYXQiLCJpbmRleE9mIiwiZGVidWciLCJwcmVmaXgiLCJzdWJzdHIiLCJsaXN0QmxvYnMiLCJlbnRyaWVzIiwicmV0ZW50aW9uIiwiY29udGFpbmVyVXJsIiwiRXJyb3IiLCJuYW1lIiwidHJhY2UiLCJzeW5jRGVsYXkiLCJ1bmRlZmluZWQiLCJidWlsZENhcmdvIiwiY3JlYXRlU2FzIiwibXNnIiwiY29uc29sZSIsImxvZyIsInVybCIsIlVSTCIsInNhcyIsInNlYXJjaCIsInN0YXJ0c1dpdGgiLCJwcm90b2NvbCIsImhvc3QiLCJibG9iU2VydmljZSIsImF6dXJlIiwiY3JlYXRlQmxvYlNlcnZpY2VXaXRoU2FzIiwiY29udGFpbmVyTmFtZSIsInBhdGhuYW1lIiwiaW5mbyIsImNhbGxiYWNrIiwiY2FyZ28iLCJwdXNoIiwibGluZSIsIk1FU1NBR0UiLCJNIiwiZCIsImgiLCJnZXRIb3VycyIsIm0iLCJnZXRNaW51dGVzIiwicmVwbGFjZSIsInBhZFN0YXJ0IiwieSIsImZvcm1hdFBvcyIsIm5hbWVQb3MiLCJvayIsImxlbmd0aCIsImZvcm1hdENoYXIiLCJjaGFyQXQiLCJuYW1lQ2hhciIsIm51bSIsIm51bUNoYXIiLCJmb3JtYXQiLCJpbnVtIiwicGFyc2VJbnQiLCJzdGF0ZSIsImVycm9yIiwicmVzdWx0IiwicmVzcG9uc2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZW50cnkiLCJ0aW1lc3RhbXAiLCJwYXJzZU5hbWUiLCJ0b0lTT1N0cmluZyIsImNvbnRpbnVhdGlvblRva2VuIiwibGlzdEJsb2JzQ29tcGxldGUiLCJ0b2tlbiIsImxpc3RCbG9ic1NlZ21lbnRlZFdpdGhQcmVmaXgiLCJlcnIiLCJyZXMiLCJyZXNwIiwibGlzdEJsb2JzQ2FsbGJhY2siLCJkZWxldGVCbG9iSWZFeGlzdHMiLCJkZWxldGVCbG9iQ29tcGxldGUiLCJibG9iTmFtZSIsImJsb2NrRG9uZSIsImJsb2NrIiwiY29kZSIsImJsb2JSZXF1ZXN0T3B0aW9ucyIsImFic29yYkNvbmRpdGlvbmFsRXJyb3JzT25SZXRyeSIsImNyZWF0ZUFwcGVuZEJsb2JGcm9tVGV4dCIsImNlcnIiLCJjcmVhdGVCbG9ja0NvbXBsZXRlIiwiYXBwZW5kQmxvY2tGcm9tVGV4dCIsIndyaXRlQmxvY2tDb21wbGV0ZSIsImFzeW5jIiwidGFza3MiLCJjb21wbGV0ZWQiLCJ0MCIsImxpbmVzIiwicmVkdWNlIiwicHYiLCJ2IiwiYmxvY2tTaXplIiwiQ29uc3RhbnRzIiwiQmxvYkNvbnN0YW50cyIsIk1BWF9BUFBFTkRfQkxPQl9CTE9DS19TSVpFIiwiYmxvY2tzIiwiY2h1bmsiLCJnZXRCbG9iTmFtZSIsImNvbXBsZXRlVGFza3MiLCJ0YXNrIiwiY29tcGxldGVUYXNrc0RlbGF5ZWQiLCJzcGVudFRpbWUiLCJNYXRoIiwibWF4IiwiZGVsYXkiLCJ3cml0ZUJsb2NrIiwiZWFjaFNlcmllcyIsInN0ciIsInNpemUiLCJudW1DaHVua3MiLCJjZWlsIiwiY2h1bmtzIiwiQXJyYXkiLCJpIiwibyIsIlRyYW5zcG9ydFN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJPLElBQU1BLG1CQUFtQixHQUFHLGdDQUE1Qjs7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxJQUEzQjs7QUFDUCxJQUFNQyxTQUFTLEdBQUcsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLElB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VSxVQUF6QixFQUFxQ0wsb0JBQXJDO0FBQ0gsT0FoQ1ksQ0FBYjtBQWlDSDs7OzBCQUVhTyxHLEVBQWFDLEksRUFBYztBQUNyQyxVQUFNQyxTQUFTLEdBQUdQLElBQUksQ0FBQ1EsSUFBTCxDQUFVSCxHQUFHLENBQUNoRSxNQUFKLEdBQWFpRSxJQUF2QixDQUFsQjtBQUNBLFVBQU1HLE1BQU0sR0FBRyxJQUFJQyxLQUFKLENBQVVILFNBQVYsQ0FBZjs7QUFDQSxXQUFLLElBQUlJLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBRyxDQUFwQixFQUF1QkQsQ0FBQyxHQUFHSixTQUEzQixFQUFzQyxFQUFFSSxDQUFGLEVBQUtDLENBQUMsSUFBSU4sSUFBaEQsRUFBc0Q7QUFDcERHLFFBQUFBLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFOLEdBQVlOLEdBQUcsQ0FBQzdHLE1BQUosQ0FBV29ILENBQVgsRUFBY04sSUFBZCxDQUFaO0FBQ0Q7O0FBQ0QsYUFBT0csTUFBUDtBQUNEOzs7O0VBM1VpQ0ksNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXN5bmMsIHsgQXN5bmNDYXJnbyB9IGZyb20gXCJhc3luY1wiO1xuaW1wb3J0IGF6dXJlLCB7IFNlcnZpY2VSZXNwb25zZSwgU3RvcmFnZUVycm9yIH0gZnJvbSBcImF6dXJlLXN0b3JhZ2VcIjtcbmltcG9ydCB7IFRyYW5zZm9ybWFibGVJbmZvIH0gZnJvbSBcImxvZ2Zvcm1cIjtcbmltcG9ydCB7IE1FU1NBR0UgfSBmcm9tIFwidHJpcGxlLWJlYW1cIjtcbmltcG9ydCBUcmFuc3BvcnRTdHJlYW0gZnJvbSBcIndpbnN0b24tdHJhbnNwb3J0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUF6dXJlQmxvYlRyYW5zcG9ydE9wdGlvbnMgZXh0ZW5kcyBUcmFuc3BvcnRTdHJlYW0uVHJhbnNwb3J0U3RyZWFtT3B0aW9ucyB7XG4gICAgY29udGFpbmVyVXJsOiBzdHJpbmdcbiAgICBuYW1lPzogc3RyaW5nXG4gICAgbmFtZUZvcm1hdD86IHN0cmluZ1xuICAgIHN5bmNEZWxheT86IG51bWJlclxuICAgIHJldGVudGlvbj86IG51bWJlclxuICAgIHRyYWNlPzogYm9vbGVhblxufVxuXG5pbnRlcmZhY2UgSUNsZWFuU3RhdGUge1xuICAgIHByZWZpeDogc3RyaW5nXG4gICAgbm93OiBudW1iZXJcbiAgICBlbnRyaWVzOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9OQU1FX0ZPUk1BVCA9IFwie3l5eXl9L3tNTX0ve2RkfS97aGh9L25vZGUubG9nXCI7XG5leHBvcnQgY29uc3QgREVGQVVMVF9TWU5DX0RFTEFZID0gMTAwMDtcbmNvbnN0IE1TX0lOX0RBWSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBjbGFzcyBBenVyZUJsb2JUcmFuc3BvcnQgZXh0ZW5kcyBUcmFuc3BvcnRTdHJlYW0ge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmdcbiAgICBwcml2YXRlIHRyYWNlOiBib29sZWFuXG4gICAgcHJpdmF0ZSBzeW5jRGVsYXk6IG51bWJlclxuICAgIHByaXZhdGUgY2FyZ286IEFzeW5jQ2FyZ29cbiAgICBwcml2YXRlIGNvbnRhaW5lck5hbWU6IHN0cmluZ1xuICAgIHByaXZhdGUgbmFtZUZvcm1hdDogc3RyaW5nXG4gICAgcHJpdmF0ZSByZXRlbnRpb24/OiBudW1iZXJcbiAgICBwcml2YXRlIGJsb2JTZXJ2aWNlOiBhenVyZS5CbG9iU2VydmljZVxuXG4gICAgY29uc3RydWN0b3Iob3B0czogSUF6dXJlQmxvYlRyYW5zcG9ydE9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG5cbiAgICAgICAgaWYgKCFvcHRzLmNvbnRhaW5lclVybCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbnRhaW5lclVybCBwcm9wZXJ0eSBtdXN0IGJlIHNwZWNpZmllZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmFtZSA9IG9wdHMubmFtZSB8fCBcIkF6dXJlQmxvYlRyYW5zcG9ydFwiO1xuICAgICAgICB0aGlzLnRyYWNlID0gb3B0cy50cmFjZSA9PT0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zeW5jRGVsYXkgPSBvcHRzLnN5bmNEZWxheSA9PSB1bmRlZmluZWQgPyBERUZBVUxUX1NZTkNfREVMQVkgOiBvcHRzLnN5bmNEZWxheTtcbiAgICAgICAgdGhpcy5idWlsZENhcmdvKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU2FzKG9wdHMuY29udGFpbmVyVXJsKTtcbiAgICAgICAgdGhpcy5uYW1lRm9ybWF0ID0gb3B0cy5uYW1lRm9ybWF0IHx8IERFRkFVTFRfTkFNRV9GT1JNQVQsXG4gICAgICAgIHRoaXMucmV0ZW50aW9uID0gb3B0cy5yZXRlbnRpb247XG5cbiAgICAgICAgaWYgKHRoaXMucmV0ZW50aW9uKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuY2xlYW5PbGRMb2dzLCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVidWcobXNnOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNhcyhjb250YWluZXJVcmw6IHN0cmluZykge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGNvbnRhaW5lclVybCk7XG5cbiAgICAgICAgbGV0IHNhcyA9IHVybC5zZWFyY2g7XG4gICAgICAgIGlmIChzYXMuc3RhcnRzV2l0aChcIj9cIikpIHtcbiAgICAgICAgICAgIHNhcyA9IHNhcy5zdWJzdHIoMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlYnVnKGBjcmVhdGUgU0FTIGZvciAke3VybC5wcm90b2NvbH0vLyR7dXJsLmhvc3R9LCBzYXNUb2tlbj0ke3Nhc31gKTtcbiAgICAgICAgdGhpcy5ibG9iU2VydmljZSA9IGF6dXJlLmNyZWF0ZUJsb2JTZXJ2aWNlV2l0aFNhcyhcbiAgICAgICAgICAgIGAke3VybC5wcm90b2NvbH0vLyR7dXJsLmhvc3R9YCxcbiAgICAgICAgICAgIHNhcyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyTmFtZSA9IHVybC5wYXRobmFtZTtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyTmFtZS5zdGFydHNXaXRoKFwiL1wiKSkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJOYW1lID0gdGhpcy5jb250YWluZXJOYW1lLnN1YnN0cigxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBjcmVhdGUgYmxvYiBjb250YWluZXIgJHt1cmwucHJvdG9jb2x9Ly8ke3VybC5ob3N0fS8ke3RoaXMuY29udGFpbmVyTmFtZX1gKTtcbiAgICAgICAgLy8gdGhpcy5ibG9iU2VydmljZS5jcmVhdGVDb250YWluZXJJZk5vdEV4aXN0cyh0aGlzLmNvbnRhaW5lck5hbWUsIChlcnJvciwgcmVzdWx0LCByZXNwb25zZSkgPT4ge1xuICAgICAgICAvLyAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5lcnJvcihgY3JlYXRpbmcgdGhlIGJsb2IgY29udGFpbmVyICR7dGhpcy5jb250YWluZXJOYW1lfSBgICtcbiAgICAgICAgLy8gICAgICAgICAgICAgYGZhaWxlZCB3aXRoICR7SlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDIpfWApO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9nKGluZm86IFRyYW5zZm9ybWFibGVJbmZvLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmNhcmdvLnB1c2goe1xuICAgICAgICAgICAgbGluZTogaW5mb1tNRVNTQUdFXSxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QmxvYk5hbWUoKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgY29uc3QgTSA9IFwiXCIgKyAobm93LmdldE1vbnRoKCkgKyAxKTtcbiAgICAgICAgY29uc3QgZCA9IFwiXCIgKyBub3cuZ2V0RGF0ZSgpO1xuICAgICAgICBjb25zdCBoID0gXCJcIiArIG5vdy5nZXRIb3VycygpO1xuICAgICAgICBjb25zdCBtID0gXCJcIiArIG5vdy5nZXRNaW51dGVzKCk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMubmFtZUZvcm1hdFxuICAgICAgICAgICAgLnJlcGxhY2UoL1xce3l5eXlcXH0vZywgXCJcIiArIG5vdy5nZXRGdWxsWWVhcigpKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xce01NXFx9L2csIE0ucGFkU3RhcnQoMiwgXCIwXCIpKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xce01cXH0vZywgTSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHtkZFxcfS9nLCBkLnBhZFN0YXJ0KDIsIFwiMFwiKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHtkXFx9L2csIGQpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx7aGhcXH0vZywgaC5wYWRTdGFydCgyLCBcIjBcIikpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx7aFxcfS9nLCBoKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xce21tXFx9L2csIG0ucGFkU3RhcnQoMiwgXCIwXCIpKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xce21cXH0vZywgbSk7XG4gICAgICAgIHRoaXMuZGVidWcoYHVzaW5nIGxvZyBuYW1lICR7bmFtZX0gYmFzZWQgb24gZm9ybWF0ICR7dGhpcy5uYW1lRm9ybWF0fWApO1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5leHRDbGVhbj86IG51bWJlclxuXG4gICAgcHJpdmF0ZSBwYXJzZU5hbWUobmFtZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm9uZS12YXJpYWJsZS1wZXItZGVjbGFyYXRpb25cbiAgICAgICAgbGV0IHkgPSAtMSwgTSA9IDEsIGQgPSAxLCBoID0gMCwgbSA9IDA7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpvbmUtdmFyaWFibGUtcGVyLWRlY2xhcmF0aW9uXG4gICAgICAgIGxldCBmb3JtYXRQb3MgPSAwLCBuYW1lUG9zID0gMDtcbiAgICAgICAgbGV0IG9rID0gdHJ1ZTtcblxuICAgICAgICB3aGlsZSAobmFtZVBvcyA8IG5hbWUubGVuZ3RoICYmXG4gICAgICAgICAgICAgICBmb3JtYXRQb3MgPCB0aGlzLm5hbWVGb3JtYXQubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIGxldCBmb3JtYXRDaGFyID0gdGhpcy5uYW1lRm9ybWF0LmNoYXJBdChmb3JtYXRQb3MrKyk7XG4gICAgICAgICAgICBpZiAoZm9ybWF0Q2hhciAhPT0gJ3snKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZUNoYXIgPSBuYW1lLmNoYXJBdChuYW1lUG9zKyspO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lQ2hhciAhPT0gZm9ybWF0Q2hhcikge1xuICAgICAgICAgICAgICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbnVtID0gXCJcIjtcbiAgICAgICAgICAgIGZvciAoOyBuYW1lUG9zIDwgbmFtZS5sZW5ndGg7ICsrbmFtZVBvcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bUNoYXIgPSBuYW1lLmNoYXJBdChuYW1lUG9zKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtQ2hhciA8ICcwJyB8fCBudW1DaGFyID4gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBudW0gKz0gbnVtQ2hhcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChudW0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmb3JtYXQgPSBcIlwiO1xuICAgICAgICAgICAgd2hpbGUgKGZvcm1hdFBvcyA8IHRoaXMubmFtZUZvcm1hdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRDaGFyID0gdGhpcy5uYW1lRm9ybWF0LmNoYXJBdChmb3JtYXRQb3MrKyk7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdENoYXIgPT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9ybWF0ICs9IGZvcm1hdENoYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZm9ybWF0Q2hhciAhPT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGludW0gPSBwYXJzZUludChudW0sIDEwKTtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09IFwieXl5eVwiIHx8IGZvcm1hdCA9PT0gXCJ5XCIpIHtcbiAgICAgICAgICAgICAgICB5ID0gaW51bTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSBcIk1NXCIgfHwgZm9ybWF0ID09PSBcIk1cIikge1xuICAgICAgICAgICAgICAgIE0gPSBpbnVtO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQgPT09IFwiZGRcIiB8fCBmb3JtYXQgPT09IFwiZFwiKSB7XG4gICAgICAgICAgICAgICAgZCA9IGludW07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gXCJoaFwiIHx8IGZvcm1hdCA9PT0gXCJoXCIpIHtcbiAgICAgICAgICAgICAgICBoID0gaW51bTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSBcIm1tXCIgfHwgZm9ybWF0ID09PSBcIm1cIikge1xuICAgICAgICAgICAgICAgIG0gPSBpbnVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvayB8fCB5ID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgdGhlIGJsb2IgbmFtZSAke25hbWV9IGRvZXMgbm90IG1hdGNoIHRoZSBuYW1lIGZvcm1hdCAke3RoaXMubmFtZUZvcm1hdH1gICtcbiAgICAgICAgICAgICAgICBgLSBwYXJzZWQgeSA9ICR7eX0sIE0gPSAke219LCBkID0gJHtkfSwgaCA9ICR7aH0sIG0gPSAke219LmApO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh5LCBNIC0gMSwgZCwgaCwgbSkuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbGlzdEJsb2JzQ2FsbGJhY2soXG4gICAgICAgIHN0YXRlOiBJQ2xlYW5TdGF0ZSxcbiAgICAgICAgZXJyb3I6IFN0b3JhZ2VFcnJvcixcbiAgICAgICAgcmVzdWx0OiBhenVyZS5CbG9iU2VydmljZS5MaXN0QmxvYkRpcmVjdG9yaWVzUmVzdWx0LFxuICAgICAgICByZXNwb25zZTogU2VydmljZVJlc3BvbnNlXG4gICAgKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgbGlzdGluZyBzdG9yYWdlIGJsb2JzIGZhaWxlZCB3aXRoICR7SlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDIpfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmV0ZW50aW9uID0gdGhpcy5yZXRlbnRpb24hICogTVNfSU5fREFZO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgcmVzdWx0LmVudHJpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IHRoaXMucGFyc2VOYW1lKGVudHJ5Lm5hbWUpO1xuICAgICAgICAgICAgaWYgKHRpbWVzdGFtcCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYnVnKGBwYXJzZWQgbmFtZSAke2VudHJ5Lm5hbWV9IGdpdmluZyB0aW1lc3RhbXAgJHtuZXcgRGF0ZSh0aW1lc3RhbXApLnRvSVNPU3RyaW5nKCl9YCArXG4gICAgICAgICAgICAgICAgICAgIGAgKG1zID0gJHt0aW1lc3RhbXB9LCByZXRlbnRpb24gPSAke3JldGVudGlvbn0sYCArXG4gICAgICAgICAgICAgICAgICAgIGAgZXhwaXJlcyA9ICR7dGltZXN0YW1wICsgcmV0ZW50aW9ufSwgbm93ID0gJHtzdGF0ZS5ub3d9KWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRpbWVzdGFtcCArIHJldGVudGlvbiA8IHN0YXRlLm5vdykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYGNsZWFuIG9sZCBibG9iICR7ZW50cnkubmFtZX1gKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5lbnRyaWVzLnB1c2goZW50cnkubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0LmNvbnRpbnVhdGlvblRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RCbG9icyhzdGF0ZSwgcmVzdWx0LmNvbnRpbnVhdGlvblRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGlzdEJsb2JzQ29tcGxldGUoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsaXN0QmxvYnMoc3RhdGU6IElDbGVhblN0YXRlLCB0b2tlbjogYXp1cmUuY29tbW9uLkNvbnRpbnVhdGlvblRva2VuIHwgbnVsbCkge1xuICAgICAgICB0aGlzLmJsb2JTZXJ2aWNlLmxpc3RCbG9ic1NlZ21lbnRlZFdpdGhQcmVmaXgodGhpcy5jb250YWluZXJOYW1lLCBzdGF0ZS5wcmVmaXgsIHRva2VuISxcbiAgICAgICAgICAgIChlcnI6IFN0b3JhZ2VFcnJvciwgcmVzOiBhenVyZS5CbG9iU2VydmljZS5MaXN0QmxvYkRpcmVjdG9yaWVzUmVzdWx0LFxuICAgICAgICAgICAgIHJlc3A6IFNlcnZpY2VSZXNwb25zZSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RCbG9ic0NhbGxiYWNrKHN0YXRlLCBlcnIsIHJlcywgcmVzcCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVsZXRlQmxvYkNvbXBsZXRlKG5hbWU6IHN0cmluZywgZXJyOiBTdG9yYWdlRXJyb3IsIHJlc3VsdDogYm9vbGVhbikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBkZWxldGluZyBvbGQgbG9nIHtuYW1lfSBmYWlsZWQgd2l0aCAke0pTT04uc3RyaW5naWZ5KGVyciwgbnVsbCwgMil9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlYnVnKGBkZWxldGluZyBvbGQgbG9nICR7bmFtZX0gJHtyZXN1bHQgPyBcInN1Y2NlZWRlZFwiIDogXCJmYWlsZWRcIn1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbGlzdEJsb2JzQ29tcGxldGUoc3RhdGU6IElDbGVhblN0YXRlKSB7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2Ygc3RhdGUuZW50cmllcykge1xuICAgICAgICAgICAgdGhpcy5kZWJ1ZyhgZGVsZXRpbmcgb2xkIGxvZyAke2VudHJ5fWApO1xuICAgICAgICAgICAgdGhpcy5ibG9iU2VydmljZS5kZWxldGVCbG9iSWZFeGlzdHModGhpcy5jb250YWluZXJOYW1lLCBlbnRyeSxcbiAgICAgICAgICAgICAgICAoZXJyOiBTdG9yYWdlRXJyb3IsIHJlc3VsdDogYm9vbGVhbikgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVCbG9iQ29tcGxldGUoZW50cnksIGVyciwgcmVzdWx0KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFuT2xkTG9ncyA9ICgpID0+IHtcbiAgICAgICAgLy8gb25seSBvbmNlIHBlciBkYXlcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgaWYgKHRoaXMubmV4dENsZWFuICYmIG5vdyA8IHRoaXMubmV4dENsZWFuKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuY2xlYW5PbGRMb2dzLCB0aGlzLm5leHRDbGVhbiAtIG5vdyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3dEYXRlID0gbmV3IERhdGUobm93KTtcbiAgICAgICAgdGhpcy5uZXh0Q2xlYW4gPSBuZXcgRGF0ZShub3dEYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgICBub3dEYXRlLmdldE1vbnRoKCksIG5vd0RhdGUuZ2V0RGF0ZSgpKS5nZXRUaW1lKCkgKyA4NjQwMDAwMDtcblxuICAgICAgICBjb25zdCBwcmVmaXhJbmRleCA9IHRoaXMubmFtZUZvcm1hdC5pbmRleE9mKCd7Jyk7XG4gICAgICAgIGlmIChwcmVmaXhJbmRleCA8IDApIHsgLy8gd2UgY2FuJ3QgY2xlYW4gaWYgd2UgY2FuJ3QgZ2V0IGEgZGF0ZSBvdXQgb2YgdGhlIGZpbGUhXG4gICAgICAgICAgICB0aGlzLmRlYnVnKGB1bmFibGUgdG8gZmluZCBhIGRhdGUgaW4gdGhlIG5hbWUgZm9ybWF0IGAgK1xuICAgICAgICAgICAgICAgIGAke3RoaXMubmFtZUZvcm1hdH0gLSB1bmFibGUgdG8gY2xlYW4gbG9nc2ApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHRoaXMubmFtZUZvcm1hdC5zdWJzdHIoMCwgcHJlZml4SW5kZXgpO1xuICAgICAgICB0aGlzLmxpc3RCbG9icyh7IG5vdywgcHJlZml4LCBlbnRyaWVzOiBbXSB9LCBudWxsKTtcblxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuY2xlYW5PbGRMb2dzLCB0aGlzLm5leHRDbGVhbiAtIG5vdyk7XG4gICAgICAgIHRoaXMuZGVidWcoYG5leHQgY2xlYW4gYXQgJHtuZXcgRGF0ZSh0aGlzLm5leHRDbGVhbil9LCBgK1xuICAgICAgICAgICAgYHJldGVudGlvbiBpcyAke3RoaXMucmV0ZW50aW9ufSBkYXkke3RoaXMucmV0ZW50aW9uISA+IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVCbG9ja0NvbXBsZXRlKGVycjogYXp1cmUuU3RvcmFnZUVycm9yLCBibG9iTmFtZTogc3RyaW5nLCBibG9ja0RvbmU6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgQmxvYlNlcnZpY2UuY3JlYXRlQXBwZW5kQmxvYkZyb21UZXh0KGAgK1xuICAgICAgICAgICAgICAgIGAke3RoaXMuY29udGFpbmVyTmFtZX0vJHtibG9iTmFtZX0pIGZhaWxlZCB3aXRoID0gYCArXG4gICAgICAgICAgICAgICAgYCR7SlNPTi5zdHJpbmdpZnkoZXJyLG51bGwsMil9YCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tEb25lKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3cml0ZUJsb2NrQ29tcGxldGUoZXJyOiBhenVyZS5TdG9yYWdlRXJyb3IsIGJsb2JOYW1lOiBzdHJpbmcsXG4gICAgICAgIGJsb2NrOiBzdHJpbmcsIGJsb2NrRG9uZTogKCkgPT4gdm9pZCkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09IFwiQmxvYk5vdEZvdW5kXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY2FzdCBoZXJlIGlzIGJlY2F1c2UgdGhlIGRvY3MgZGlmZmVyIGZyb20gdGhlIHR5cGVzY3JpcHRcbiAgICAgICAgICAgICAgICAvLyBiaW5kaW5ncyAodGhlcmUgYXJlIG90aGVyIFRTIGJ1Z3MsIHNvIGdvIHdpdGggdGhlIGRvY3MpXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYlJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBhYnNvcmJDb25kaXRpb25hbEVycm9yc09uUmV0cnk6IHRydWVcbiAgICAgICAgICAgICAgICB9IGFzIGF6dXJlLkJsb2JTZXJ2aWNlLkNyZWF0ZUJsb2JSZXF1ZXN0T3B0aW9ucztcblxuICAgICAgICAgICAgICAgIHRoaXMuZGVidWcoYGNyZWF0aW5nIG5ldyBibG9iICR7dGhpcy5jb250YWluZXJOYW1lfS8ke2Jsb2JOYW1lfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuYmxvYlNlcnZpY2UuY3JlYXRlQXBwZW5kQmxvYkZyb21UZXh0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lck5hbWUsIGJsb2JOYW1lLCBibG9jaywgYmxvYlJlcXVlc3RPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAoY2VycjogYXp1cmUuU3RvcmFnZUVycm9yKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVCbG9ja0NvbXBsZXRlKGNlcnIsIGJsb2JOYW1lLCBibG9ja0RvbmUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBCbG9iU2VydmljZS5hcHBlbmRCbG9ja0Zyb21UZXh0KGAgK1xuICAgICAgICAgICAgICAgIGAke3RoaXMuY29udGFpbmVyTmFtZX0vJHtibG9iTmFtZX0pIGZhaWxlZCB3aXRoIGAgK1xuICAgICAgICAgICAgICAgIGBlcnJvciA9ICR7SlNPTi5zdHJpbmdpZnkoZXJyLG51bGwsMil9YCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tEb25lKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3cml0ZUJsb2NrKGJsb2JOYW1lOiBzdHJpbmcsIGJsb2NrOiBzdHJpbmcsIGJsb2NrRG9uZTogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmRlYnVnKGB3cml0aW5nIGJsb2NrIG9mIHNpemUgJHtibG9jay5sZW5ndGh9ID0gJHtibG9ja31gKTtcbiAgICAgICAgY29uc3QgYmxvYlJlcXVlc3RPcHRpb25zID0geyBhYnNvcmJDb25kaXRpb25hbEVycm9yc09uUmV0cnk6IHRydWUgfTtcbiAgICAgICAgdGhpcy5ibG9iU2VydmljZS5hcHBlbmRCbG9ja0Zyb21UZXh0KFxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJOYW1lLCBibG9iTmFtZSwgYmxvY2ssIGJsb2JSZXF1ZXN0T3B0aW9ucyxcbiAgICAgICAgICAgIChlcnI6IGF6dXJlLlN0b3JhZ2VFcnJvcikgPT5cbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlQmxvY2tDb21wbGV0ZShlcnIsIGJsb2JOYW1lLCBibG9jaywgYmxvY2tEb25lKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRDYXJnbygpIHtcbiAgICAgICAgdGhpcy5jYXJnbyA9IGFzeW5jLmNhcmdvKCh0YXNrczogYW55W10sIGNvbXBsZXRlZDogYXN5bmMuRXJyb3JDYWxsYmFjazxFcnJvcj4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHQwID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMuZGVidWcoYGxvZ2dpbmcgJHt0YXNrcy5sZW5ndGh9IGxpbmUke3Rhc2tzLmxlbmd0aCA+IDEgPyBcInNcIiA6IFwiXCJ9YCk7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IHRhc2tzLnJlZHVjZSgocHYsIHYpID0+IHB2ICsgdi5saW5lICsgXCJcXG5cIiwgXCJcIik7XG4gICAgICAgICAgICAvLyBUaGUgY2FzdCBpcyBiZWNhdXNlIHRoZSB0eXBlc2NyaXB0IHR5cGluZ3MgYXJlIHdyb25nXG4gICAgICAgICAgICAvLyBVVEYtOCBjaGFycyBjYW4gYmUgNCBieXRlcyBzbyBkaXZpZGUgYnkgNFxuICAgICAgICAgICAgY29uc3QgYmxvY2tTaXplID0gKGF6dXJlLkNvbnN0YW50cy5CbG9iQ29uc3RhbnRzIGFzIGFueSkuTUFYX0FQUEVORF9CTE9CX0JMT0NLX1NJWkUgLyA0O1xuICAgICAgICAgICAgY29uc3QgYmxvY2tzID0gdGhpcy5jaHVuayhsaW5lcywgYmxvY2tTaXplKTtcbiAgICAgICAgICAgIGNvbnN0IGJsb2JOYW1lID0gdGhpcy5nZXRCbG9iTmFtZSgpO1xuXG4gICAgICAgICAgICBjb25zdCBjb21wbGV0ZVRhc2tzID0gKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2suY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNvbXBsZXRlVGFza3NEZWxheWVkID0gKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcGVudFRpbWUgPSBNYXRoLm1heChEYXRlLm5vdygpIC0gdDAsIDApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gdGhpcy5zeW5jRGVsYXkgLSBzcGVudFRpbWU7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNvbXBsZXRlVGFza3MoZXJyKSwgZGVsYXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlVGFza3MoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHdyaXRlQmxvY2sgPSAoYmxvY2s6IHN0cmluZywgYmxvY2tEb25lOiAoKSA9PiB2b2lkKSA9PlxuICAgICAgICAgICAgICAgIHRoaXMud3JpdGVCbG9jayhibG9iTmFtZSwgYmxvY2ssIGJsb2NrRG9uZSk7XG5cbiAgICAgICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoYmxvY2tzLCB3cml0ZUJsb2NrLCBjb21wbGV0ZVRhc2tzRGVsYXllZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2h1bmsoc3RyOiBzdHJpbmcsIHNpemU6IG51bWJlcikge1xuICAgICAgICBjb25zdCBudW1DaHVua3MgPSBNYXRoLmNlaWwoc3RyLmxlbmd0aCAvIHNpemUpO1xuICAgICAgICBjb25zdCBjaHVua3MgPSBuZXcgQXJyYXkobnVtQ2h1bmtzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG8gPSAwOyBpIDwgbnVtQ2h1bmtzOyArK2ksIG8gKz0gc2l6ZSkge1xuICAgICAgICAgIGNodW5rc1tpXSA9IHN0ci5zdWJzdHIobywgc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNodW5rcztcbiAgICAgIH1cbn1cbiJdfQ==