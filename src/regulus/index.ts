import { ByteReader, ByteWriter } from '../bytes'
import { Line } from './line'
import { Meta } from './meta'

export class RegulusFlags {
    constructor() {}

    public static from(reader: ByteReader) {
        reader.viewCursor(4)
        return new RegulusFlags()
    }

    public to(writer: ByteWriter) {
        writer.add(new ArrayBuffer(4))
    }
}

export class Regulus {
    constructor(
        public flags: RegulusFlags,
        public meta: Meta,
        public variants: Variant[]
    ) {}

    public static from(reader: ByteReader) {
        const flags = RegulusFlags.from(reader)
        const meta = Meta.from(reader)
        const variants = Array.from({ length: reader.readU16() }).map(() => Variant.from(reader))

        return new Regulus(flags, meta, variants)
    }

    public to(writer: ByteWriter) {
        this.flags.to(writer)
        this.meta.to(writer)
        writer.addU16(this.variants.length)
        this.variants.map((variant) => variant.to(writer))
    }
}

export class Variant {
    constructor(
        public name: string,
        public sections: Section[]
    ) {}

    public static from(reader: ByteReader) {
        const name = reader.readUTF8('u16')
        const sections = Array.from({ length: reader.readU16() }).map(() => Section.from(reader))

        return new Variant(name, sections)
    }

    public to(writer: ByteWriter) {
        writer.addUTF8(this.name, 'u16')
        writer.addU16(this.sections.length)

        this.sections.map((section) => section.to(writer))
    }
}

export class Section {
    constructor(
        public name: string,
        public lines: Line[]
    ) {}

    public static from(reader: ByteReader) {
        const name = reader.readUTF8('u16')
        const lines = Array.from({ length: reader.readU16() }).map(() => Line.from(reader))

        return new Section(name, lines)
    }

    public to(writer: ByteWriter) {
        writer.addUTF8(this.name, 'u16')
        writer.addU16(this.lines.length)
        this.lines.map((line) => line.to(writer))
    }
}
