const isPromise = (object: any) => Promise.resolve(object) === object
export default isPromise