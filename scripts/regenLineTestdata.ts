import * as fs from 'fs'
import { FormatType, randomStr, regenFormatType } from './utils'

function regenLyrics() {
    type Test = { lyricFormat: FormatType; content: string }
    const tests: Array<Test> = []

    for (let i = 0; i < 10; i++) {
        tests.push({
            lyricFormat: regenFormatType(),
            content: randomStr(Math.floor(Math.random() * (2 ** 16 - 1)))
        })
    }

    return { tests }
}

function regenTimeUnit() {
    type Test = {}
    const tests: Array<Test> = []

    return { tests }
}

function regenLineContent() {
    type Test = {}
    const tests: Array<Test> = []

    return { tests }
}

export function regen() {
    const data = {
        lyrics: regenLyrics()
    }

    fs.writeFileSync('test/data/line.data.json', JSON.stringify(data, null, 4))
}
