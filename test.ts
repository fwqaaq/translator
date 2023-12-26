import { Translator } from './mod.ts'
import { assertEquals, assertInstanceOf } from 'assert'
Deno.test({
  name: 'Testing Hello World',
  async fn() {
    const t = new Translator('你好')
    const res = await t.translate()
    assertEquals(res, { lang: 'zh-CN', text: 'Hello' })
  },
})

Deno.test({
  name: 'Testing for client and model options',
  async fn() {
    const t1 = new Translator('你好', { client: 'gtx', model: 'single' })
    const res1 = await t1.translate()
    const t2 = new Translator('你好', { client: 'dict-chrome-ex', model: 't' })
    const res2 = await t2.translate()
    assertEquals(res1, res2)
  },
})

Deno.test({
  name: 'Return raw data when true.',
  async fn() {
    const t = new Translator('你好')
    const res = await t.translate(true)
    assertInstanceOf(res, Array)
  },
})

Deno.test({
  name: 'Testing others url link',
  async fn() {
    const t1 = new Translator('你好', {
      url: 'https://translate.google.com/translate_a/',
    })
    const res1 = await t1.translate()
    const t2 = new Translator('你好', {
      url: 'https://translate.googleapis.com/translate_a/',
    })
    const res2 = await t2.translate()
    assertEquals(res1, { lang: 'zh-CN', text: 'Hello' })
    assertEquals(res2, { lang: 'zh-CN', text: 'Hello' })
  },
})

Deno.test({
  name: 'Testing source and target options',
  async fn() {
    const translator = new Translator('Hello world', {
      source: 'en',
      target: 'zh-CN',
      model: 't',
      client: 'gtx',
    })
    const response = await translator.translate()
    assertEquals(response, { lang: 'en', text: '你好世界' })
  },
})
