// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class TranslatorError extends Error {
}
class ResponseError extends TranslatorError {
    constructor(message){
        super(`ResponseError: ${message}`);
        this.name = 'ResponseError';
    }
}
class TranslatorAPIError extends TranslatorError {
    constructor(message){
        super(`TranslatorAPIError: ${message}`);
        this.name = 'TranslatorAPIError';
    }
}
class Translator {
    static url = 'https://clients5.google.com/translate_a/';
    static audioUrl = 'https://translate.google.com/translate_tts';
    static USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
    source = 'auto';
    target = 'en';
    text;
    client = 'gtx';
    model = 't';
    url = Translator.url;
    constructor(text, options = {}){
        this.source = options.source ?? this.source;
        this.target = options.target ?? this.target;
        this.client = options.client ?? this.client;
        this.model = options.model ?? this.model;
        this.url = options.url ?? this.url;
        this.text = text;
    }
    #getParams() {
        if (this.source === this.target) throw new TranslatorAPIError('Source and target languages cannot be the same.');
        if (this.text.length === 0) throw new TranslatorAPIError('Text cannot be empty.');
        return new URLSearchParams({
            q: this.text,
            sl: this.source,
            tl: this.target,
            client: this.client,
            dt: 't',
            ie: 'UTF-8',
            oe: 'UTF-8'
        });
    }
    async translate(isRaw = false) {
        const url = `${Translator.url + this.model}?${this.#getParams()}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': Translator.USER_AGENT
            }
        });
        if (!res.ok) throw new ResponseError(`Failed to get Response: ${res.statusText}`);
        const data = await res.json();
        if (isRaw) return data;
        switch(this.model){
            case 't':
                return {
                    lang: this.source === 'auto' ? data[0][1] : this.source,
                    text: this.source === 'auto' ? data[0][0] : data[0]
                };
            case 'single':
                return {
                    lang: data[2] ?? data[8][0][0] ?? data[8][3][0],
                    text: data[0][0][0]
                };
        }
    }
    async audio(isOriginal = false) {
        const params = this.#getParams();
        const { text, lang } = await this.translate();
        params.set('client', 'tw-ob');
        if (!isOriginal) {
            params.set('q', text);
            params.set('tl', this.target);
        } else {
            params.set('tl', lang);
        }
        const res = await fetch(`${Translator.audioUrl}?${params}`, {
            headers: {
                'User-Agent': Translator.USER_AGENT
            }
        });
        if (!res.ok) throw new ResponseError(`Failed to get Response: ${res.statusText}`);
        return res.blob();
    }
}
export { Translator as Translator };

