import * as crypto from "crypto";

export default (key: string, targetArguments: object) => crypto.createHash('sha256')
    .update(JSON.stringify({key,targetArguments}))
    .digest('base64')