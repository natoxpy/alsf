import { describe, expect, it } from 'vitest'
import { ByteReader, ByteWriter } from '../src/bytes'
import { FormatInfo } from '../src'

describe('FormatInfo', () => {
    it('should convert be converted and recreated perfectly', () => {
        const maxColors = 15
        for (let i = 0; i <= maxColors; i++) {
            const formatInfo = new FormatInfo(i, Boolean(i % 3), Boolean((i % 2) - (i % 6)))
            const writer = new ByteWriter()
            formatInfo.to(writer)

            const reader = new ByteReader(writer.getBytes())
            const recreated = FormatInfo.from(reader)

            expect(recreated.color).toStrictEqual(formatInfo.color)
            expect(recreated.bold).toStrictEqual(formatInfo.bold)
            expect(recreated.italic).toStrictEqual(formatInfo.italic)
        }
    })

    it('should fail to make sure safeguard in-place', () => {
        expect(() => new FormatInfo(-1, false, false)).toThrowError('Colors')

        expect(() => new FormatInfo(16, false, false)).toThrowError('Colors')
    })
})
