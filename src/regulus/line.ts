import { ByteReader, ByteWriter, toBitArray } from '../bytes'
import { FormatInfo } from './formatInfo'
import { InLine } from './inline'

export class Lyric {
    public content: string
    constructor(
        public formatInfo: FormatInfo,
        content: string
    ) {
        if (content.length > 2 ** 16 - 1)
            throw new Error('Content length must fit within an unsigned 16-bit integer')
        this.content = content
    }

    public static from(reader: ByteReader) {
        return new Lyric(FormatInfo.from(reader), reader.readUTF8('u16'))
    }

    public to(writer: ByteWriter) {
        this.formatInfo.to(writer)
        writer.addUTF8(this.content, 'u16')
    }
}

export class TimeUnit {
    constructor(public milliseconds: number) {}

    public static from(reader: ByteReader) {
        return new TimeUnit(reader.readU32())
    }

    public to(writer: ByteWriter) {
        writer.addU32(this.milliseconds)
    }
}

export const LineFlagTypes = {
    Line: 0,
    PreLine: (2 ** 0) | (2 ** 1),
    PostLine: 2 ** 1
}

export class LineFlags {
    private byte: Uint8Array

    constructor(u8: number) {
        this.byte = new Uint8Array([u8])
    }

    public isLine() {
        return !Boolean(toBitArray(this.byte[0])[6])
    }

    public isPreLine() {
        if (this.isLine()) return false
        return Boolean(toBitArray(this.byte[0])[7])
    }

    public isPostLine() {
        if (this.isLine()) return false
        return !Boolean(toBitArray(this.byte[0])[7])
    }

    public static from(reader: ByteReader) {
        return new LineFlags(reader.viewCursor(1).getUint8(0))
    }

    public to(writer: ByteWriter) {
        writer.add(this.byte.buffer)
    }
}

export const LineContentFlagTypes = {
    InLine: 2 ** 2,
    TimeUnit: 2 ** 1,
    Lyric: 2 ** 0
}

export class LineContentFlags {
    private byte: Uint8Array
    constructor(u8: number) {
        this.byte = new Uint8Array([u8])
    }

    public isTimeUnit() {
        return Boolean(toBitArray(this.byte[0])[6])
    }

    public isLyric() {
        return Boolean(toBitArray(this.byte[0])[7])
    }

    public isInLine() {
        return Boolean(toBitArray(this.byte[0])[5])
    }

    public static from(reader: ByteReader) {
        return new LineContentFlags(reader.viewCursor(1).getUint8(0))
    }

    public to(writer: ByteWriter) {
        writer.add(this.byte)
    }
}

export class LineContent {
    constructor(
        public flags: LineContentFlags,
        public formatInfo: FormatInfo,
        public content: TimeUnit | Lyric | InLine
    ) {}

    public static from(reader: ByteReader) {
        const flags = LineContentFlags.from(reader)
        const formatInfo = FormatInfo.from(reader)

        const content = flags.isTimeUnit()
            ? TimeUnit.from(reader)
            : flags.isLyric()
              ? Lyric.from(reader)
              : flags.isInLine()
                ? InLine.from(reader)
                : (() => {
                      throw new Error('LLD not of type TimeUnit, RLS, or ILL')
                  })()

        return new LineContent(flags, formatInfo, content)
    }

    public to(writer: ByteWriter) {
        this.flags.to(writer)
        this.formatInfo.to(writer)
        this.content.to(writer)
    }
}

export class Line {
    constructor(
        public flags: LineFlags,
        public formatInfo: FormatInfo,
        public startTime: TimeUnit,
        public content: LineContent[],
        public endTime: TimeUnit
    ) {}

    public static from(reader: ByteReader) {
        const flags = LineFlags.from(reader)
        const formatInfo = FormatInfo.from(reader)
        const startTime = TimeUnit.from(reader)
        const content = Array.from({ length: reader.readU16() }).map(() => LineContent.from(reader))
        const endTime = TimeUnit.from(reader)

        return new Line(flags, formatInfo, startTime, content, endTime)
    }

    public to(writer: ByteWriter) {
        this.flags.to(writer)
        this.formatInfo.to(writer)
        this.startTime.to(writer)
        writer.addU16(this.content.length)
        this.content.map((lld) => lld.to(writer))
        this.endTime.to(writer)
    }
}
