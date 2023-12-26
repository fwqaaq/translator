import { ResponseError, TranslatorAPIError } from './error.ts'

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
  source?: string
  /**
   * The language to translate the source text to.
   * Default to `en` if the target is specified incorrectly.
   * @default 'en'
   */
  target?: string
  /**
   * The model to use when translating. 'single' returns more response data.
   * @default 't'
   */
  model?: 't' | 'single'
  /**
   * The client to use when translating. But response data decided by model.
   * @default 'gtx'
   */
  client?: 'gtx' | 'dict-chrome-ex'
  /**
   * URL of the google translate.
   * You can provide others google translate url.
   * For example:
   * https://translate.google.com/translate_a/
   * https://translate.googleapis.com/translate_a/
   * @default 'https://clients5.google.com/translate_a/'
   */
  url?: string
}

export interface ResponseData {
  /**
   * The language of the source text.
   */
  lang: string
  /**
   * The translated text.
   */
  text: string
}

export class Translator {
  static readonly url: string = 'https://clients5.google.com/translate_a/'
  static readonly audioUrl: string =
    'https://translate.google.com/translate_tts'
  static readonly USER_AGENT: string =
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'

  /**
   * The language to translate the source text from.
   * @default 'auto'
   */
  readonly source: string = 'auto'
  /**
   * The language to translate the source text to.
   * @default 'en'
   */
  readonly target: string = 'en'
  /**
   * The source text to be translated.
   */
  readonly text: string
  /**
   * The client to use when translating.
   * @default 'gtx'
   */
  readonly client: 'gtx' | 'dict-chrome-ex' = 'gtx'
  /**
   * The model to use when translating.
   * @default 't'
   */
  readonly model: 't' | 'single' = 't'
  /**
   * URL of the google translate.
   */
  readonly url: string = Translator.url

  /**
   * @param {string} text The source text to be translated.
   * @param {TranslateOptions} options The options to use when translating.
   */
  constructor(text: string, options: TranslateOptions = {}) {
    this.source = options.source ?? this.source
    this.target = options.target ?? this.target
    this.client = options.client ?? this.client
    this.model = options.model ?? this.model
    this.url = options.url ?? this.url
    this.text = text
  }

  /**
   * @returns {string} The params of the google translate.
   */
  #getParams() {
    if (this.source === this.target)
      throw new TranslatorAPIError(
        'Source and target languages cannot be the same.'
      )
    if (this.text.length === 0)
      throw new TranslatorAPIError('Text cannot be empty.')

    return new URLSearchParams({
      q: this.text,
      sl: this.source,
      tl: this.target,
      client: this.client,
      dt: 't',
      ie: 'UTF-8',
      oe: 'UTF-8',
    })
  }

  /**
   * @param isRaw Return raw data when true. Default value is `false`.
   */
  async translate(isRaw = false): Promise<ResponseData | Array<any>> {
    const url = `${Translator.url + this.model}?${this.#getParams()}`
    const res = await fetch(url, {
      headers: { 'User-Agent': Translator.USER_AGENT },
    })
    if (!res.ok)
      throw new ResponseError(`Failed to get Response: ${res.statusText}`)
    const data = await res.json()
    if (isRaw) return data
    switch (this.model) {
      case 't':
        return {
          lang: this.source === 'auto' ? data[0][1] : this.source,
          text: this.source === 'auto' ? data[0][0] : data[0],
        }
      case 'single':
        return {
          lang: data[2] ?? data[8][0][0] ?? data[8][3][0],
          text: data[0][0][0],
        }
    }
  }

  /**
   * @param {boolean} isOriginal Read translated text pronunciation only when `false`.(Dafault)
   */
  async audio(isOriginal = false) {
    const params = this.#getParams()

    /**
     * @link [How to get the Google Translate audio link?](https://stackoverflow.com/questions/35002003/how-to-use-google-translate-tts-with-the-new-v2-api)
     */
    params.set('client', 'tw-ob')

    if (!isOriginal) {
      const { text } = (await this.translate()) as ResponseData
      params.set('q', text)
    }

    const res = await fetch(`${Translator.audioUrl}?${params}`, {
      headers: { 'User-Agent': Translator.USER_AGENT },
    })
    if (!res.ok)
      throw new ResponseError(`Failed to get Response: ${res.statusText}`)
    return res.blob()
  }
}
