import Core from "./core/Core"
import { InMemoryStorage } from "./storage/InMemoryStorage"
import { IStorage } from "./core/Storage/IStorage"

const { cache, configure } = Core

export { cache, configure, InMemoryStorage }