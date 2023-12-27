declare class TranslatorError extends Error {
}
export declare class ResponseError extends TranslatorError {
    constructor(message: string);
}
export declare class TranslatorAPIError extends TranslatorError {
    constructor(message: string);
}
export {};
/**
 * Translate text using Google Translate.
 * @link [These params are from StackOverflow.](https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params/29537590#29537590)
 * @link [Difference between the google translate API.](https://stackoverflow.com/questions/57397073/difference-between-the-google-translate-api)
 */
export interface TranslateOptions {
    /**
     * The language to translate the source text from.
     * @default 'auto'
     */
    source?: string;
    /**
     * The language to translate the source text to.
     * Default to `en` if the target is specified incorrectly.
     * @default 'en'
     */
    target?: string;
    /**
     * The model to use when translating. 'single' returns more response data.
     * @default 't'
     */
    model?: 't' | 'single';
    /**
     * The client to use when translating. But response data decided by model.
     * @default 'gtx'
     */
    client?: 'gtx' | 'dict-chrome-ex';
    /**
     * URL of the google translate.
     * You can provide others google translate url.
     * For example:
     * https://translate.google.com/translate_a/
     * https://translate.googleapis.com/translate_a/
     * @default 'https://clients5.google.com/translate_a/'
     */
    url?: string;
}
export interface ResponseData {
    /**
     * The language of the source text.
     */
    lang: string;
    /**
     * The translated text.
     */
    text: string;
}
export declare class Translator {
    #private;
    static readonly url: string;
    static readonly audioUrl: string;
    static readonly USER_AGENT: string;
    /**
     * The language to translate the source text from.
     * @default 'auto'
     */
    readonly source: string;
    /**
     * The language to translate the source text to.
     * @default 'en'
     */
    readonly target: string;
    /**
     * The client to use when translating.
     * @default 'gtx'
     */
    readonly client: 'gtx' | 'dict-chrome-ex';
    /**
     * The model to use when translating.
     * @default 't'
     */
    readonly model: 't' | 'single';
    /**
     * URL of the google translate.
     */
    readonly url: string;
    /**
     * @param {string} text The source text to be translated.
     * @param {TranslateOptions} options The options to use when translating.
     */
    constructor(options?: TranslateOptions);
    /**
     * @param {string} _text The source text to be translated.
     * @param isRaw Return raw data when true. Default value is `false`.
     */
    translate(_text: string, isRaw?: boolean): Promise<ResponseData | Array<any>>;
    /**
     * @param {string} _text The source text to be translated.
     * @param {boolean} isOriginal Read translated text pronunciation only when `false`.(Default)
     */
    audio(_text: string, isOriginal?: boolean): Promise<Blob>;
}
