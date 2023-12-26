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
  name: 'Testing for model options',
  async fn() {
    const t1 = new Translator('你好', { client: 'gtx', model: 'single' })
    const res1 = await t1.translate()
    const t2 = new Translator('你好', { client: 'gtx', model: 't' })
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
    const translator = new Translator('Hello World', {
      source: 'en',
      target: 'zh-CN',
      model: 't',
      client: 'gtx',
    })
    const response = await translator.translate()
    assertEquals(response, { lang: 'en', text: '你好世界' })
  },
})

Deno.test({
  name: 'Testing client options',
  async fn() {
    const translator1 = new Translator('Hello World', {
      source: 'en',
      target: 'zh-CN',
      client: 'dict-chrome-ex',
    })
    const response1 = await translator1.translate()
    assertEquals(response1, { lang: 'en', text: '你好世界' })
    const translator2 = new Translator('Hello World', {
      source: 'en',
      target: 'zh-CN',
      client: 'gtx',
      model: 'single',
    })
    const response2 = await translator2.translate()
    assertEquals(response2, { lang: 'en', text: '你好世界' })
  },
})
