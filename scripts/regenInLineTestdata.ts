import * as fs from 'fs'
import { FormatType, randomStr, regenFormatType, regenTimeunit } from './utils'

function inlineContentWTimeunitRegen() {
    const total = 3
    type testType = {
        formatInfo: FormatType
        timeunit: number
    }

    const inlineContent: {
        tests: Array<testType>
    } = { tests: [] }

    for (let i = 0; i < total; i++) {
        inlineContent.tests.push({
            formatInfo: regenFormatType(),
            timeunit: regenTimeunit()
        })
    }

    return inlineContent
}

function inlineContentwLyricRegen() {
    const total = 3

    type TestType = {
        inlineFormat: FormatType
        lyricFormat: FormatType
        content: string
    }

    const tests: Array<TestType> = []

    for (let i = 0; i < total; i++) {
        tests.push({
            inlineFormat: regenFormatType(),
            lyricFormat: regenFormatType(),
            content: randomStr(Math.floor(Math.random() * (2 ** 16 - 1)))
        })
    }

    return { tests }
}

function inline() {
    const total = 3
    const subtotal = 5

    type TestType = {
        startTime: number
        endTime: number
        inlineFormat: FormatType
        content: Array<{
            inlineContentFormat: FormatType
            type: 'lyric' | 'timeunit'
            contentFormat?: FormatType
            content: number | string
        }>
    }

    const tests: Array<TestType> = []

    for (let i = 0; i < total; i++) {
        const content: TestType['content'] = []
        for (let y = 0; y < subtotal; y++) {
            const type: 'lyric' | 'timeunit' = ['lyric', 'timeunit'][
                Math.floor(Math.random() * 2)
            ] as never

            if (type == 'lyric')
                content.push({
                    inlineContentFormat: regenFormatType(),
                    type,
                    contentFormat: regenFormatType(),
                    content: randomStr(Math.floor(Math.random() * (2 ** 16 - 1)))
                })
            else
                content.push({
                    inlineContentFormat: regenFormatType(),
                    type,
                    content: regenTimeunit()
                })
        }

        tests.push({
            startTime: regenTimeunit(),
            endTime: regenTimeunit(),
            inlineFormat: regenFormatType(),
            content
        })
    }

    return { tests }
}

export function regen() {
    const data: any = {}
    data.inlineContentWithTimeunit = inlineContentWTimeunitRegen()
    data.inlineContentWithLyric = inlineContentwLyricRegen()
    data.inline = inline()

    fs.writeFileSync('test/data/inline.data.json', JSON.stringify(data, null, 4))
}
