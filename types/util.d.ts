/**
 * segment path or properties string
 * @private
 * @param {string} char separator char
 * @return {(string) => string}
 */
export function _segment(char: string): (string: any) => string;
/**
 * split dot separated String or Array into a property path
 * @private
 * @param {string|string[]} keys
 * @return {object} obj for comparison
 */
export function _splitPath(keys: string | string[]): object;
/**
 * split comma separated String or Array into a test hash
 * @private
 * @param {string|string[]} props
 * @return {object} obj for comparison
 */
export function _splitProps(props: string | string[]): object;
export function isArray<T>(arg: unknown): arg is Array<T>;
export function isBoolean(arg: unknown): arg is boolean;
export function isNull(arg: unknown): arg is null;
export function isNullOrUndefined(arg: unknown): arg is null | undefined;
export function isNumber(arg: unknown): arg is number;
export function isString(arg: unknown): arg is string;
export function isSymbol(arg: unknown): arg is Symbol;
export function isUndefined(arg: unknown): arg is undefined;
export function isRegExp(arg: unknown): arg is RegExp;
export function isObject(arg: unknown): arg is NonNullable<object>;
export function isDate(arg: unknown): arg is Date;
export function isFunction(arg: unknown): arg is Function;
export function isBuffer(arg: unknown): arg is Buffer;
export function isMap(arg: unknown): arg is Map<any, any>;
export function isSet(arg: unknown): arg is Set<any>;
export function isBigInt(arg: unknown): arg is BigInt;
export function objectToString(arg: any): string;
