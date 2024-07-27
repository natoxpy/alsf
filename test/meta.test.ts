import { describe, expect, it } from 'vitest'
import { AlbumInfo, Credit, CreditFor, ReleaseTime } from '../src'
import { ByteReader, ByteWriter } from '../src/bytes'

describe('release time', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const releaseTime = new ReleaseTime(1000n)

        const writer = new ByteWriter()
        releaseTime.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedReleaseTime = ReleaseTime.from(reader)

        expect(recreatedReleaseTime).toStrictEqual(releaseTime)
    })
})

describe('AlbumInfo', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const albumInfo = new AlbumInfo('Album Name', 9)

        const writer = new ByteWriter()
        albumInfo.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedAlbumInfo = AlbumInfo.from(reader)

        expect(recreatedAlbumInfo).toStrictEqual(albumInfo)
    })
})

describe('Credit', () => {
    it('should convert to bytes and recreated from bytes', () => {
        const credit = new Credit(CreditFor.Lyricist | CreditFor.MainArtist, 'Cassie wei')

        const writer = new ByteWriter()
        credit.to(writer)
        const reader = new ByteReader(writer.getBytes())

        const recreatedCredit = Credit.from(reader)

        expect(recreatedCredit).toStrictEqual(recreatedCredit)
    })

    it('check if CreditFor and .is method are consistant', () => {
        const data = [
            {
                roles: CreditFor.MainArtist | CreditFor.Composer,
                expected: false,
                isRoles: CreditFor.Composer | CreditFor.Lyricist
            },
            {
                roles: CreditFor.FeaturedArtist | CreditFor.Lyricist,
                expected: true,
                isRoles: CreditFor.FeaturedArtist | CreditFor.Lyricist
            },
            {
                roles: CreditFor.Remixer,
                expected: false,
                isRoles: CreditFor.Composer | CreditFor.Lyricist
            },
            {
                roles: CreditFor.MainArtist | CreditFor.Remixer,
                expected: true,
                isRoles: CreditFor.MainArtist
            }
        ]

        for (const test of data) {
            const credit = new Credit(test.roles, 'test credit')
            expect(credit.is(test.isRoles)).toBe(test.expected)
        }
    })
})
