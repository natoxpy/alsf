import { test } from 'vitest'

import { ByteReader, ByteWriter } from '../src/bytes'
import { expect } from 'chai'
import { iso6392 } from 'iso-639-2'
import {
    Meta,
    ReleaseTime,
    AlbumInfo,
    CreditFor,
    Credit,
    ALSF,
    RegulusFlags,
    Section,
    Variant,
    Version,
    Line,
    LineFlags,
    LineContent,
    LineContentFlags,
    LineContentFlagTypes,
    InLine,
    InLineContent,
    InLineContentFlags,
    InLineContentTypes,
    Lyric,
    TimeUnit,
    FormatInfo,
    LineFlagTypes
} from '../src'
import { Regulus } from '../src/regulus'

test('test reader and writer', () => {
    const byteWriter = new ByteWriter()

    byteWriter.addU8(123)
    byteWriter.addU16(12345)
    byteWriter.addU32(1234567)
    byteWriter.addUTF8('Hello World', 'u8')

    const reader = new ByteReader(byteWriter.getBytes())

    expect(reader.readU8()).eq(123)
    expect(reader.readU16()).eq(12345)
    expect(reader.readU32()).eq(1234567)
    expect(reader.readUTF8('u8')).eq('Hello World')
})

test('metadata', () => {
    const englishLang = iso6392.filter((l) => l.iso6392B == 'eng')[0]
    const meta = new Meta(
        1000 * 60 * 4,
        'In Hell We Live',
        new ReleaseTime(100n),
        new AlbumInfo('In Hell We Live', 1),
        ['Anime', 'Awa'],
        [
            new Credit(CreditFor.MainArtist | CreditFor.Lyricist, 'Mili'),
            new Credit(CreditFor.Composer | CreditFor.Remixer, 'Mili2')
        ],
        [englishLang]
    )

    const writer = new ByteWriter()
    meta.to(writer)
    const reader = new ByteReader(writer.getBytes())
    Meta.from(reader)
})

test('awa', () => {
    const release = new ReleaseTime(1720406274758n)
    const writer = new ByteWriter()

    release.to(writer)
    // console.log(new Uint8Array(writer.getBytes()))
})

function TestThing(a: any, b: any) {
    const writer = new ByteWriter()
    a.to(writer)
    // console.dir(new Uint8Array(writer.getBytes()), { depth: null })
    const reader = new ByteReader(writer.getBytes())
    // console.dir(b.from(reader), { depth: null })
}

test('Ultimate test', () => {
    const englishLang = iso6392.filter((l) => l.iso6392B == 'eng')[0]

    const meta = new Meta(
        1000 * 60 * 4,
        'In Hell We Live',
        new ReleaseTime(100n),
        new AlbumInfo('In Hell We Live', 1),
        ['Anime', 'Awa'],
        [
            new Credit(CreditFor.MainArtist | CreditFor.Lyricist, 'Mili'),
            new Credit(CreditFor.Composer | CreditFor.Remixer, 'Mili2')
        ],
        [englishLang]
    )

    const lyric = new Lyric(new FormatInfo(0, false, false), 'Hello')

    const lld0 = new LineContent(
        new LineContentFlags(LineContentFlagTypes.Lyric),
        new FormatInfo(0, false, false),
        lyric
    )

    const lld1 = new LineContent(
        new LineContentFlags(LineContentFlagTypes.TimeUnit),
        new FormatInfo(0, false, false),
        new TimeUnit(0)
    )

    const illd0 = new InLineContent(
        new InLineContentFlags(LineContentFlagTypes.TimeUnit),
        new FormatInfo(0, false, false),
        new TimeUnit(0)
    )

    const inline = new InLine(
        new FormatInfo(0, false, false),
        new TimeUnit(0),
        [illd0],
        new TimeUnit(0)
    )

    const lld2 = new LineContent(
        new LineContentFlags(LineContentFlagTypes.InLine),
        new FormatInfo(0, false, false),
        inline
    )

    const line = new Line(
        new LineFlags(LineFlagTypes.Line),
        new FormatInfo(0, false, false),
        new TimeUnit(0),
        [lld0, lld1, lld2],
        new TimeUnit(0)
    )

    const section = new Section('Verse 1', [line])
    const variant = new Variant('Quedamos', [section])

    const alsf = new ALSF(
        new Version('Regulus', 'Corneas'),
        new Regulus(new RegulusFlags(), meta, [variant])
    )

    TestThing(alsf, ALSF)
})
