import { describe, expect, it } from 'vitest'
import { AlbumInfo, ALSF, RegulusFlags, Meta, ReleaseTime, Version } from '../src'
import { ByteReader, ByteWriter } from '../src/bytes'
import { Regulus } from '../src/regulus'

describe('ALSF', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const content = new Regulus(
            new RegulusFlags(),
            new Meta(0, 'Name', new ReleaseTime(0n), new AlbumInfo('Hello', 0), [], [], []),
            []
        )

        const alsf = new ALSF(new Version('Regulus', 'Suzuki'), content)

        const writer = new ByteWriter()
        alsf.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedAlsf = ALSF.from(reader)

        expect(recreatedAlsf).toStrictEqual(alsf)
    })
})

describe('Version', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const version = new Version('Regulus', 'Maeko')

        const writer = new ByteWriter()
        version.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedVersion = Version.from(reader)

        expect(version).toStrictEqual(recreatedVersion)
    })
})
