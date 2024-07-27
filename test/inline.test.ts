import { describe, expect, it } from 'vitest'
import {
    InLine,
    InLineContent,
    InLineContentFlags,
    InLineContentTypes
} from '../src/regulus/inline'
import { ByteReader, ByteWriter, toBitArray } from '../src/bytes'
import { FormatInfo, Lyric, TimeUnit } from '../src'
import data from './data/inline.data.json'
import manualData from './data/inline.manual.data.json'

describe('InLine Content Flags', () => {
    it('should be of type TimeUnit', () => {
        const flags = new InLineContentFlags(InLineContentTypes.TimeUnit)
        expect(flags.isTimeUnit()).true
        expect(flags.isLyric()).false

        const writer = new ByteWriter()
        flags.to(writer)
        const bits = toBitArray(new Uint8Array(writer.getBytes())[0])

        expect(bits).toStrictEqual([0, 0, 0, 0, 0, 0, 1, 0])
        expect(Boolean(bits[6])).true
    })

    it('should be of type Lyric', () => {
        const flags = new InLineContentFlags(InLineContentTypes.Lyric)
        expect(flags.isLyric()).true
        expect(flags.isTimeUnit()).false

        const writer = new ByteWriter()
        flags.to(writer)
        const bits = toBitArray(new Uint8Array(writer.getBytes())[0])

        expect(bits).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 1])
        expect(Boolean(bits[7])).true
    })
})

describe('InLine Content', () => {
    it('should convert to bytes and recreated from bytes with TimeUnit content', () => {
        const tests = data.inlineContentWithTimeunit.tests

        for (const test of tests) {
            const flags = new InLineContentFlags(InLineContentTypes.TimeUnit)
            const formatInfo = new FormatInfo(
                test.formatInfo.color,
                test.formatInfo.bold,
                test.formatInfo.italic
            )

            const content = new TimeUnit(test.timeunit)

            const inlineContent = new InLineContent(flags, formatInfo, content)

            const writer = new ByteWriter()
            inlineContent.to(writer)

            const reader = new ByteReader(writer.getBytes())
            const recreatedInLine = InLineContent.from(reader)

            expect(recreatedInLine.flags).toStrictEqual(flags)
            expect(recreatedInLine.formatInfo).toStrictEqual(formatInfo)
            expect(recreatedInLine.content).toStrictEqual(content)
            expect(recreatedInLine).toStrictEqual(inlineContent)
        }
    })

    it('should convert to bytes and recreated from bytes with Lyric content', () => {
        const tests = data.inlineContentWithLyric.tests.concat(
            manualData.inlineContentWithLyric.tests
        )

        for (const test of tests) {
            const flags = new InLineContentFlags(InLineContentTypes.Lyric)
            const formatInfo = new FormatInfo(
                test.inlineFormat.color,
                test.inlineFormat.bold,
                test.inlineFormat.italic
            )

            const lyricFormat = new FormatInfo(
                test.lyricFormat.color,
                test.lyricFormat.bold,
                test.lyricFormat.italic
            )

            const content = new Lyric(lyricFormat, test.content)

            const inlineContent = new InLineContent(flags, formatInfo, content)

            const writer = new ByteWriter()
            inlineContent.to(writer)

            const reader = new ByteReader(writer.getBytes())
            const recreatedInLineContent = InLineContent.from(reader)

            expect(recreatedInLineContent.flags).toStrictEqual(flags)
            expect(recreatedInLineContent.formatInfo).toStrictEqual(formatInfo)
            expect(recreatedInLineContent.content).toStrictEqual(content)
            expect(recreatedInLineContent).toStrictEqual(inlineContent)
        }
    })
})

describe('InLine', () => {
    it('should convert to bytes and be recreated from bytes', () => {
        for (const test of data.inline.tests) {
            const inlineContent = []

            for (const testContent of test.content) {
                const formatInfo = new FormatInfo(
                    testContent.inlineContentFormat.color,
                    testContent.inlineContentFormat.bold,
                    testContent.inlineContentFormat.italic
                )

                let content, flags

                if (testContent.type == 'lyric' && testContent.contentFormat != undefined) {
                    flags = new InLineContentFlags(InLineContentTypes.Lyric)
                    const lyricFormat = new FormatInfo(
                        testContent.contentFormat.color,
                        testContent.contentFormat.bold,
                        testContent.contentFormat.italic
                    )

                    content = new Lyric(lyricFormat, testContent.content as string)
                } else if (testContent.type == 'timeunit') {
                    flags = new InLineContentFlags(InLineContentTypes.TimeUnit)

                    content = new TimeUnit(testContent.content as number)
                }

                expect(['lyric', 'timeunit'].includes(testContent.type)).true

                inlineContent.push(new InLineContent(flags!, formatInfo, content!))
            }

            const inlineFormat = new FormatInfo(
                test.inlineFormat.color,
                test.inlineFormat.bold,
                test.inlineFormat.italic
            )

            const inline = new InLine(
                inlineFormat,
                new TimeUnit(test.startTime),
                inlineContent,
                new TimeUnit(test.endTime)
            )

            const writer = new ByteWriter()
            inline.to(writer)
            const reader = new ByteReader(writer.getBytes())
            const recreatedInLine = InLine.from(reader)

            expect(recreatedInLine.content).toStrictEqual(inline.content)
            expect(recreatedInLine.formatInfo).toStrictEqual(inline.formatInfo)
            expect(recreatedInLine.startTime).toStrictEqual(inline.startTime)
            expect(recreatedInLine.endTime).toStrictEqual(inline.endTime)
            expect(recreatedInLine).toStrictEqual(inline)
        }
    })
})
