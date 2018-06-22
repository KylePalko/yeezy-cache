"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
exports.default = (key, targetArguments) => crypto.createHash('sha256')
    .update(JSON.stringify({ key, targetArguments }))
    .digest('base64');
