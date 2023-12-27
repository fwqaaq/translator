// error.ts
var TranslatorError = class extends Error {
};
var ResponseError = class extends TranslatorError {
  constructor(message) {
    super(`ResponseError: ${message}`);
    this.name = "ResponseError";
  }
};
var TranslatorAPIError = class extends TranslatorError {
  constructor(message) {
    super(`TranslatorAPIError: ${message}`);
    this.name = "TranslatorAPIError";
  }
};

// translator.ts
var Translator = class _Translator {
  /**
   * @param {string} text The source text to be translated.
   * @param {TranslateOptions} options The options to use when translating.
   */
  constructor(options = {}) {
    /**
     * The language to translate the source text from.
     * @default 'auto'
     */
    this.source = "auto";
    /**
     * The language to translate the source text to.
     * @default 'en'
     */
    this.target = "en";
    /**
     * The client to use when translating.
     * @default 'gtx'
     */
    this.client = "gtx";
    /**
     * The model to use when translating.
     * @default 't'
     */
    this.model = "t";
    /**
     * URL of the google translate.
     */
    this.url = _Translator.url;
    this.source = options.source ?? this.source;
    this.target = options.target ?? this.target;
    this.client = options.client ?? this.client;
    this.model = options.model ?? this.model;
    this.url = options.url ?? this.url;
  }
  static {
    this.url = "https://clients5.google.com/translate_a/";
  }
  static {
    this.audioUrl = "https://translate.google.com/translate_tts";
  }
  static {
    this.USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";
  }
  /**
   * @returns {string} The params of the google translate.
   */
  #getParams() {
    if (this.source === this.target)
      throw new TranslatorAPIError(
        "Source and target languages cannot be the same."
      );
    return new URLSearchParams({
      sl: this.source,
      tl: this.target,
      client: this.client,
      dt: "t",
      ie: "UTF-8",
      oe: "UTF-8"
    });
  }
  /**
   * @param {string} _text The source text to be translated.
   * @param isRaw Return raw data when true. Default value is `false`.
   */
  async translate(_text, isRaw = false) {
    if (_text.length === 0)
      throw new TranslatorAPIError("Text cannot be empty.");
    const params = this.#getParams();
    params.append("q", _text);
    const res = await fetch(`${_Translator.url + this.model}?${params}`, {
      headers: { "User-Agent": _Translator.USER_AGENT }
    });
    if (!res.ok)
      throw new ResponseError(`Failed to get Response: ${res.statusText}`);
    const data = await res.json();
    if (isRaw)
      return data;
    switch (this.model) {
      case "t":
        return {
          lang: this.source === "auto" ? data[0][1] : this.source,
          text: this.source === "auto" ? data[0][0] : data[0]
        };
      case "single":
        return {
          lang: data[2] ?? data[8][0][0] ?? data[8][3][0],
          text: data[0][0][0]
        };
    }
  }
  /**
   * @param {string} _text The source text to be translated.
   * @param {boolean} isOriginal Read translated text pronunciation only when `false`.(Default)
   */
  async audio(_text, isOriginal = false) {
    if (_text.length === 0)
      throw new TranslatorAPIError("Text cannot be empty.");
    const params = this.#getParams();
    params.set("client", "tw-ob");
    if (isOriginal) {
      if (this.source === "auto")
        throw new TranslatorAPIError("Source language cannot be auto.");
      params.set("tl", this.source);
      params.set("q", _text);
    }
    if (!isOriginal) {
      const { text } = await this.translate(_text);
      params.set("q", text);
    }
    const res = await fetch(`${_Translator.audioUrl}?${params}`, {
      headers: { "User-Agent": _Translator.USER_AGENT }
    });
    if (!res.ok)
      throw new ResponseError(`Failed to get Response: ${res.statusText}`);
    return res.blob();
  }
};
export {
  ResponseError,
  Translator,
  TranslatorAPIError
};
