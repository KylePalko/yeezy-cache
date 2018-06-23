"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPromise = (object) => Promise.resolve(object) === object;
exports.default = isPromise;
