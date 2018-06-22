"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("./core/Core");
const InMemoryStorage_1 = require("./storage/InMemoryStorage");
exports.InMemoryStorage = InMemoryStorage_1.InMemoryStorage;
const { cache, configure } = Core_1.default;
exports.cache = cache;
exports.configure = configure;
