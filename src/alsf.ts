import { ByteReader, ByteWriter } from './bytes'
import { Regulus } from './regulus'

export class Version {
    constructor(
        public major: string,
        public minor: string
    ) {}

    public static from(reader: ByteReader) {
        return new Version(reader.readUTF8(), reader.readUTF8())
    }

    public to(writer: ByteWriter) {
        writer.addUTF8(this.major)
        writer.addUTF8(this.minor)
    }
}

export class ALSF {
    constructor(
        public version: Version,
        public content: Regulus
    ) {}

    public static from(reader: ByteReader) {
        const version = Version.from(reader)
        let content

        if (version.major == 'Regulus') content = Regulus.from(reader)

        if (content == undefined) throw new Error(`${version.major} is unsupported.`)

        return new ALSF(version, content)
    }

    public to(writer: ByteWriter) {
        this.version.to(writer)
        this.content.to(writer)
    }
}
