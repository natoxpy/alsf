import { describe, expect, it } from 'vitest'
import {
    FormatInfo,
    InLine,
    InLineContent,
    InLineContentFlags,
    InLineContentTypes,
    LineFlags,
    Lyric,
    Line,
    LineContent,
    LineContentFlags,
    LineContentFlagTypes,
    LineFlagTypes,
    TimeUnit
} from '../src'
import { randomStr } from '../scripts/utils'
import data from './data/line.data.json'
import { ByteReader, ByteWriter, toBitArray } from '../src/bytes'

describe('lyric', () => {
    it('should fail on overflow content size limit', () => {
        const formatInfo = new FormatInfo(0, false, false)
        expect(() => new Lyric(formatInfo, randomStr(2 ** 16))).toThrowError()
    })

    it('should convert to bytes and be recreated from bytes', () => {
        for (const test of data.lyrics.tests) {
            const lyric = new Lyric(
                new FormatInfo(
                    test.lyricFormat.color,
                    test.lyricFormat.bold,
                    test.lyricFormat.italic
                ),
                test.content
            )

            const writer = new ByteWriter()
            lyric.to(writer)

            const reader = new ByteReader(writer.getBytes())
            const recreatedLyric = Lyric.from(reader)

            expect(recreatedLyric.content).toStrictEqual(lyric.content)
            expect(recreatedLyric.formatInfo).toStrictEqual(lyric.formatInfo)
            expect(recreatedLyric).toStrictEqual(lyric)
        }
    })
})

describe('Line Flags', () => {
    it('returns isLine as true and others as false', () => {
        const lineFlag = new LineFlags(LineFlagTypes.Line)
        expect(lineFlag.isLine()).true
        expect(lineFlag.isPostLine() && lineFlag.isPreLine()).false
    })

    it('returns isPreLine as true and others as false', () => {
        const preLineFlag = new LineFlags(LineFlagTypes.PreLine)
        expect(preLineFlag.isPreLine()).true
        expect(preLineFlag.isPostLine() && preLineFlag.isLine()).false
    })

    it('returns isPostLine as true and others as false', () => {
        const postLineFlag = new LineFlags(LineFlagTypes.PostLine)
        expect(postLineFlag.isPostLine()).true
        expect(postLineFlag.isLine() && postLineFlag.isPreLine()).false
    })
})

describe('Line Content Flags', () => {
    it('returns isLyric as true and others as false', () => {
        const lineContentFlag = new LineContentFlags(LineContentFlagTypes.Lyric)

        expect(lineContentFlag.isLyric()).true
        expect(lineContentFlag.isInLine() || lineContentFlag.isTimeUnit()).false
    })

    it('returns isInLine as true and others as false', () => {
        const lineContentFlag = new LineContentFlags(LineContentFlagTypes.InLine)

        expect(lineContentFlag.isInLine()).true
        expect(lineContentFlag.isLyric() || lineContentFlag.isTimeUnit()).false
    })

    it('returns isTimeUnit as true and others as false', () => {
        const lineContentFlag = new LineContentFlags(LineContentFlagTypes.TimeUnit)

        expect(lineContentFlag.isTimeUnit()).true
        expect(lineContentFlag.isInLine() || lineContentFlag.isLyric()).false
    })
})

describe('Line', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const lineFlags = new LineFlags(LineFlagTypes.Line)
        const lineFormat = new FormatInfo(15, true, true)
        const content: LineContent[] = []

        for (let i = 0; i < 3; i++) {
            const lineContentFlags = new LineContentFlags(LineContentFlagTypes.Lyric)
            const lyric = new Lyric(new FormatInfo(15, true, true), 'Hello World')
            content.push(new LineContent(lineContentFlags, new FormatInfo(15, true, true), lyric))
        }

        for (let i = 0; i < 5; i++) {
            const lineContentFlags = new LineContentFlags(LineContentFlagTypes.TimeUnit)
            const timeunit = new TimeUnit(1000)
            content.push(
                new LineContent(lineContentFlags, new FormatInfo(15, true, true), timeunit)
            )
        }

        for (let i = 0; i < 2; i++) {
            const lineContentFlags = new LineContentFlags(LineContentFlagTypes.InLine)

            const inlineContent: InLineContent[] = []

            for (let y = 0; y < 3; y++) {
                const inlineContentFlag = new InLineContentFlags(InLineContentTypes.Lyric)
                inlineContent.push(
                    new InLineContent(
                        inlineContentFlag,
                        new FormatInfo(15, true, true),
                        new Lyric(new FormatInfo(15, true, true), 'Hello inLine')
                    )
                )
            }

            for (let y = 0; y < 3; y++) {
                const inlineContentFlag = new InLineContentFlags(InLineContentTypes.TimeUnit)
                inlineContent.push(
                    new InLineContent(
                        inlineContentFlag,
                        new FormatInfo(15, true, true),
                        new TimeUnit(1255)
                    )
                )
            }

            const inline = new InLine(
                new FormatInfo(15, true, true),
                new TimeUnit(1500),
                inlineContent,
                new TimeUnit(1500)
            )

            content.push(new LineContent(lineContentFlags, new FormatInfo(15, true, true), inline))
        }

        const line = new Line(
            lineFlags,
            lineFormat,
            new TimeUnit(1000),
            content,
            new TimeUnit(1000)
        )

        const writer = new ByteWriter()
        line.to(writer)

        const reader = new ByteReader(writer.getBytes())
        const recreatedLine = Line.from(reader)

        expect(line.flags).toStrictEqual(recreatedLine.flags)
        expect(line.formatInfo).toStrictEqual(recreatedLine.formatInfo)
        expect(line.startTime).toStrictEqual(recreatedLine.startTime)
        expect(line.content).toStrictEqual(recreatedLine.content)
        expect(line.endTime).toStrictEqual(recreatedLine.endTime)
        expect(line).toStrictEqual(recreatedLine)
    })
})
