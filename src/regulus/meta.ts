import { Language, iso6392 } from 'iso-639-2'
import { ByteReader, ByteWriter } from '../bytes'

export class ReleaseTime {
    constructor(private time: bigint) {}

    public static from(reader: ByteReader) {
        return new ReleaseTime(reader.readU64())
    }

    public to(writer: ByteWriter) {
        writer.addBigU64(this.time)
    }
}

export class AlbumInfo {
    constructor(
        public name: string,
        public numberInAlbum: number
    ) {}

    public static from(reader: ByteReader) {
        return new AlbumInfo(reader.readUTF8('u16'), reader.readU16())
    }

    public to(writer: ByteWriter) {
        writer.addUTF8(this.name, 'u16')
        writer.addU16(this.numberInAlbum)
    }
}

export const CreditFor = {
    MainArtist: 2 ** 4,
    FeaturedArtist: 2 ** 3,
    Composer: 2 ** 2,
    Lyricist: 2 ** 1,
    Remixer: 2 ** 0
}

export class Credit {
    constructor(
        public role: number,
        public name: string
    ) {}

    public is(creditType: number): boolean {
        return (this.role & creditType) == creditType
    }

    public static from(reader: ByteReader) {
        return new Credit(reader.readU8(), reader.readUTF8('u16'))
    }

    public to(writer: ByteWriter) {
        writer.add(new Uint8Array([this.role]))
        writer.addUTF8(this.name, 'u16')
    }
}

export class Meta {
    constructor(
        public length: number,
        public name: string,
        public release: ReleaseTime,
        public album: AlbumInfo,
        public genres: string[],
        public credits: Credit[],
        public languages: Language[]
    ) {}

    public static from(reader: ByteReader) {
        const length = reader.readU32()
        const name = reader.readUTF8('u16')

        const release = ReleaseTime.from(reader)
        const album = AlbumInfo.from(reader)

        const genres = Array.from({ length: reader.readU16() }).map(() => reader.readUTF8('u8'))

        const credits = Array.from({ length: reader.readU8() }).map(() => Credit.from(reader))

        const languages = Array.from({ length: reader.readU8() }).map(() => {
            const lang = reader.readUTF8('u8')
            return iso6392.filter((n) => n.iso6392B == lang)[0]
        })

        return new Meta(length, name, release, album, genres, credits, languages)
    }

    public to(writer: ByteWriter) {
        writer.addU32(this.length)
        writer.addUTF8(this.name, 'u16')

        this.release.to(writer)
        this.album.to(writer)

        writer.addU16(this.genres.length)
        this.genres.map((genre) => writer.addUTF8(genre, 'u8'))

        writer.addU8(this.credits.length)
        this.credits.map((credit) => credit.to(writer))

        writer.addU8(this.languages.length)
        this.languages.map((l) => writer.addUTF8(l.iso6392B, 'u8'))
    }
}
