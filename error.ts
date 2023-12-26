class TranslatorError extends Error {}

export class ResponseError extends TranslatorError {
  constructor(message: string) {
    super(`ResponseError: ${message}`)
    this.name = 'ResponseError'
  }
}

export class TranslatorAPIError extends TranslatorError {
  constructor(message: string) {
    super(`TranslatorAPIError: ${message}`)
    this.name = 'TranslatorAPIError'
  }
}
