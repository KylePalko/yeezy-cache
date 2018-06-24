import * as crypto from "crypto";

export default (targetRef: string, targetArgs: object) => crypto.createHash('sha256')
    .update(JSON.stringify({targetRef,targetArgs}))
    .digest('base64')