<div align=center>
   <h1>Google Translation API for Deno🛠️</h1>
</div>

## Features

* Automatic language detection with default options.
* Option to specify source and target languages.
* Choice of translation models and clients for different response data.
* Customizable Google Translate URL.
* Error handling for common translation issues.
* Modern ESM module instead of CommonJS.

## Usage

> [!NOTE]
> Only ESM module is supported.

### Import

Deno:

```js
import { Translator } from "https://deno.land/x/translator/mod.ts";
```

ESM:

```js
import { Translator } from 'https://esm.sh/@fwqaaq/translator'
```

or:

```sh
pnpm add @fwqaaq/translator
```

### Example

```js
const options = {
  source: "zh-CN",
  model: 't',
  client: 'gtx',
  url: 'https://translate.googleapis.com/translate_a/'
};

async function main() {
  const translator = new Translator(options);
  const response = await translator.translate("你好");
  console.log(response) // { lang: 'zh-CN', text: 'Hello' }
}

main()
```

## API Reference

* **Constructor**
  * `options`: `TranslateOptions` - (Optional) The options to use when translating.
* **Methods**
  * `translate(_text: string, isRaw: boolean)`: `Promise<ResponseData | Array<any>>` - Translates the text. If `isRaw` is true, returns raw response data. **Default is false.**
  * `audio(_text: string, isOriginal: boolean)`: `Promise<blob>` - Returns the blob. If `isOriginal` is true, using the original text to generate the audio, and set `source` to your target language. **Default is false**, read the translated text.
* **TranslateOptions** Interface
  * `source`: `string` - Source language (default: `'auto'`).
  * `target`: `string` - Target language (default: `'en'`).
  * `model`: `'t' | 'single'` - Translation model (default: `'t'`).
  * `client`: `'gtx' | 'dict-chrome-ex'` - Client for translation (default: `'gtx'`).
  * `url`: `string` - Google Translate URL (default: '<https://clients5.google.com/translate_a/>').
* **ResponseData** Interface
  * `lang`: `string` - The language of the source text.
  * `text`: `string` - The translated text.

## Links

* [Google Translate Query Params Explanation](https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params/29537590#29537590)
* [Difference between the Google Translate API versions](https://stackoverflow.com/questions/57397073/difference-between-the-google-translate-api)
