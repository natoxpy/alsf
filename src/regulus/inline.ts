import { ByteReader, ByteWriter, toBitArray } from '../bytes'
import { FormatInfo } from './formatInfo'
import { Lyric, TimeUnit } from './line'

export const InLineContentTypes = {
    TimeUnit: 2 ** 1,
    Lyric: 2 ** 0
}

export class InLineContentFlags {
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

    public static from(reader: ByteReader) {
        return new InLineContentFlags(reader.viewCursor(1).getUint8(0))
    }

    public to(writer: ByteWriter) {
        writer.add(this.byte.buffer)
    }
}

export class InLineContent {
    constructor(
        public flags: InLineContentFlags,
        public formatInfo: FormatInfo,
        public content: TimeUnit | Lyric
    ) {}

    public static from(reader: ByteReader) {
        const flags = InLineContentFlags.from(reader)
        const formatInfo = FormatInfo.from(reader)
        const content = flags.isTimeUnit() ? TimeUnit.from(reader) : Lyric.from(reader)
        return new InLineContent(flags, formatInfo, content)
    }

    public to(writer: ByteWriter) {
        this.flags.to(writer)
        this.formatInfo.to(writer)
        this.content.to(writer)
    }
}

/// InLine Lyrics
export class InLine {
    constructor(
        public formatInfo: FormatInfo,
        public startTime: TimeUnit,
        public content: InLineContent[],
        public endTime: TimeUnit
    ) {}

    public static from(reader: ByteReader) {
        const formatInfo = FormatInfo.from(reader)
        const startTime = TimeUnit.from(reader)
        const content = Array.from({ length: reader.readU16() }).map(() =>
            InLineContent.from(reader)
        )
        const endTime = TimeUnit.from(reader)
        return new InLine(formatInfo, startTime, content, endTime)
    }

    public to(writer: ByteWriter) {
        this.formatInfo.to(writer)
        this.startTime.to(writer)
        writer.addU16(this.content.length)
        this.content.map((content) => content.to(writer))
        this.endTime.to(writer)
    }
}
