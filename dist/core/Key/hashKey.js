"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
exports.default = (function (key, args) { return crypto.createHash('sha256')
    .update(JSON.stringify({ key: key, args: args }))
    .digest('base64'); });
