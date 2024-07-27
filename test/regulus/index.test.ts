import { describe, expect, it } from 'vitest'
import {
    FormatInfo,
    Line,
    LineFlags,
    RegulusFlags,
    Section,
    TimeUnit,
    Variant,
    LineFlagTypes,
    Meta,
    AlbumInfo,
    ReleaseTime
} from '../../src'
import { ByteReader, ByteWriter } from '../../src/bytes'
import { Regulus } from '../../src/regulus'

describe('section', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const line = new Line(
            new LineFlags(LineFlagTypes.Line),
            new FormatInfo(15, true, true),
            new TimeUnit(1000),
            [],
            new TimeUnit(1000)
        )
        const section = new Section('Section Hello', [line, line])

        const writer = new ByteWriter()
        section.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedSection = Section.from(reader)

        expect(recreatedSection).toStrictEqual(section)
    })
})

describe('variant', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const variant = new Variant('Variant Hello', [])

        const writer = new ByteWriter()
        variant.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedVariant = Variant.from(reader)

        expect(recreatedVariant).toStrictEqual(variant)
    })
})

describe('RegulusFlags', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const regulusFlags = new RegulusFlags()

        const writer = new ByteWriter()
        regulusFlags.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedAlsfflags = RegulusFlags.from(reader)

        expect(regulusFlags).toStrictEqual(recreatedAlsfflags)
    })
})

describe('Regulus', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const regulus = new Regulus(
            new RegulusFlags(),
            new Meta(
                0,
                'hello',
                new ReleaseTime(0n),
                new AlbumInfo('In Hell We Live', 1),
                [],
                [],
                []
            ),
            []
        )

        const writer = new ByteWriter()
        regulus.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedRegulus = Regulus.from(reader)

        expect(recreatedRegulus).toStrictEqual(regulus)
    })
})
