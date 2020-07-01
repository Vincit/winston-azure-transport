"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAzureBlobTransport = getAzureBlobTransport;

var _AzureBlobTransport = require("./AzureBlobTransport");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getAzureBlobTransport(config, appSettings) {
  var containerUrl = process && process.env && process.env.DIAGNOSTICS_AZUREBLOBCONTAINERSASURL || appSettings && appSettings.azureBlobContainerSasUrl; // console.log(`containerUrl=${containerUrl}`);

  if (typeof containerUrl !== "string" || !containerUrl) {
    return null;
  }

  var retention;
  var retentionVal = process.env && process.env.DIAGNOSTICS_AZUREBLOBRETENTIONINDAYS || appSettings && appSettings.azureBlobRetentionInDays;

  if (retentionVal && typeof retentionVal !== "number") {
    retention = parseInt(retentionVal, 10);
  }

  var nameFormat;
  var namePrefix = process.env.WEBSITE_SITE_NAME;

  if (namePrefix) {
    nameFormat = "".concat(namePrefix, "/").concat(_AzureBlobTransport.DEFAULT_NAME_FORMAT);
  } //console.log(`nameFormat=${nameFormat}`);


  return new _AzureBlobTransport.AzureBlobTransport(_objectSpread(_objectSpread({}, config), {}, {
    containerUrl: containerUrl,
    nameFormat: nameFormat,
    retention: retention
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRBenVyZUJsb2JUcmFuc3BvcnQudHMiXSwibmFtZXMiOlsiZ2V0QXp1cmVCbG9iVHJhbnNwb3J0IiwiY29uZmlnIiwiYXBwU2V0dGluZ3MiLCJjb250YWluZXJVcmwiLCJwcm9jZXNzIiwiZW52IiwiRElBR05PU1RJQ1NfQVpVUkVCTE9CQ09OVEFJTkVSU0FTVVJMIiwiYXp1cmVCbG9iQ29udGFpbmVyU2FzVXJsIiwicmV0ZW50aW9uIiwicmV0ZW50aW9uVmFsIiwiRElBR05PU1RJQ1NfQVpVUkVCTE9CUkVURU5USU9OSU5EQVlTIiwiYXp1cmVCbG9iUmV0ZW50aW9uSW5EYXlzIiwicGFyc2VJbnQiLCJuYW1lRm9ybWF0IiwibmFtZVByZWZpeCIsIldFQlNJVEVfU0lURV9OQU1FIiwiREVGQVVMVF9OQU1FX0ZPUk1BVCIsIkF6dXJlQmxvYlRyYW5zcG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQVFPLFNBQVNBLHFCQUFULENBQ0hDLE1BREcsRUFFSEMsV0FGRyxFQUdzQjtBQUN6QixNQUFNQyxZQUFZLEdBQ2RDLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxHQUFuQixJQUEwQkQsT0FBTyxDQUFDQyxHQUFSLENBQVlDLG9DQUF0QyxJQUNBSixXQUFXLElBQUlBLFdBQVcsQ0FBQ0ssd0JBRi9CLENBRHlCLENBSXpCOztBQUNBLE1BQUksT0FBT0osWUFBUCxLQUF5QixRQUF6QixJQUFxQyxDQUFDQSxZQUExQyxFQUF3RDtBQUNwRCxXQUFPLElBQVA7QUFDSDs7QUFFRCxNQUFJSyxTQUFKO0FBQ0EsTUFBTUMsWUFBWSxHQUNkTCxPQUFPLENBQUNDLEdBQVIsSUFBZUQsT0FBTyxDQUFDQyxHQUFSLENBQVlLLG9DQUEzQixJQUNBUixXQUFXLElBQUlBLFdBQVcsQ0FBQ1Msd0JBRi9COztBQUdBLE1BQUlGLFlBQVksSUFBSSxPQUFPQSxZQUFQLEtBQXlCLFFBQTdDLEVBQXVEO0FBQ25ERCxJQUFBQSxTQUFTLEdBQUdJLFFBQVEsQ0FBQ0gsWUFBRCxFQUFlLEVBQWYsQ0FBcEI7QUFDSDs7QUFFRCxNQUFJSSxVQUFKO0FBQ0EsTUFBTUMsVUFBVSxHQUFHVixPQUFPLENBQUNDLEdBQVIsQ0FBWVUsaUJBQS9COztBQUNBLE1BQUlELFVBQUosRUFBZ0I7QUFDWkQsSUFBQUEsVUFBVSxhQUFNQyxVQUFOLGNBQW9CRSx1Q0FBcEIsQ0FBVjtBQUNILEdBckJ3QixDQXNCekI7OztBQUNBLFNBQU8sSUFBSUMsc0NBQUosaUNBQ0FoQixNQURBO0FBRUhFLElBQUFBLFlBQVksRUFBWkEsWUFGRztBQUdIVSxJQUFBQSxVQUFVLEVBQVZBLFVBSEc7QUFJSEwsSUFBQUEsU0FBUyxFQUFUQTtBQUpHLEtBQVA7QUFNSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXp1cmVCbG9iVHJhbnNwb3J0LCBERUZBVUxUX05BTUVfRk9STUFULCBJQXp1cmVCbG9iVHJhbnNwb3J0T3B0aW9uc1xufSBmcm9tIFwiLi9BenVyZUJsb2JUcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQXp1cmVCbG9iVHJhbnNwb3J0QXBwU2V0dGluZ3Mge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlclxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXp1cmVCbG9iVHJhbnNwb3J0KFxuICAgIGNvbmZpZz86IFBhcnRpYWw8SUF6dXJlQmxvYlRyYW5zcG9ydE9wdGlvbnM+LFxuICAgIGFwcFNldHRpbmdzPzogSUF6dXJlQmxvYlRyYW5zcG9ydEFwcFNldHRpbmdzXG4pOiBBenVyZUJsb2JUcmFuc3BvcnQgfCBudWxsIHtcbiAgICBjb25zdCBjb250YWluZXJVcmwgPVxuICAgICAgICBwcm9jZXNzICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52LkRJQUdOT1NUSUNTX0FaVVJFQkxPQkNPTlRBSU5FUlNBU1VSTCB8fFxuICAgICAgICBhcHBTZXR0aW5ncyAmJiBhcHBTZXR0aW5ncy5henVyZUJsb2JDb250YWluZXJTYXNVcmw7XG4gICAgLy8gY29uc29sZS5sb2coYGNvbnRhaW5lclVybD0ke2NvbnRhaW5lclVybH1gKTtcbiAgICBpZiAodHlwZW9mKGNvbnRhaW5lclVybCkgIT09IFwic3RyaW5nXCIgfHwgIWNvbnRhaW5lclVybCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgcmV0ZW50aW9uOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmV0ZW50aW9uVmFsID1cbiAgICAgICAgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuRElBR05PU1RJQ1NfQVpVUkVCTE9CUkVURU5USU9OSU5EQVlTIHx8XG4gICAgICAgIGFwcFNldHRpbmdzICYmIGFwcFNldHRpbmdzLmF6dXJlQmxvYlJldGVudGlvbkluRGF5cztcbiAgICBpZiAocmV0ZW50aW9uVmFsICYmIHR5cGVvZihyZXRlbnRpb25WYWwpICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldGVudGlvbiA9IHBhcnNlSW50KHJldGVudGlvblZhbCwgMTApO1xuICAgIH1cblxuICAgIGxldCBuYW1lRm9ybWF0OiBzdHJpbmd8dW5kZWZpbmVkO1xuICAgIGNvbnN0IG5hbWVQcmVmaXggPSBwcm9jZXNzLmVudi5XRUJTSVRFX1NJVEVfTkFNRTtcbiAgICBpZiAobmFtZVByZWZpeCkge1xuICAgICAgICBuYW1lRm9ybWF0ID0gYCR7bmFtZVByZWZpeH0vJHtERUZBVUxUX05BTUVfRk9STUFUfWA7XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coYG5hbWVGb3JtYXQ9JHtuYW1lRm9ybWF0fWApO1xuICAgIHJldHVybiBuZXcgQXp1cmVCbG9iVHJhbnNwb3J0KHtcbiAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICBjb250YWluZXJVcmwsXG4gICAgICAgIG5hbWVGb3JtYXQsXG4gICAgICAgIHJldGVudGlvblxuICAgIH0pO1xufVxuIl19