import { describe, expect, it } from 'vitest'
import { BitType, fromBitArray, Maxu8, toBitArray } from '../src/bytes/bits'

describe('bits functions', () => {
    it('should turn number into bits and back to the original', () => {
        const testNumbers = Array.from({ length: Maxu8 + 1 }).map((_, i) => i)

        const bits = testNumbers.map((num) => toBitArray(num))
        const recreatedNumbers = bits.map((bitArr) => fromBitArray(bitArr))

        expect(recreatedNumbers).toStrictEqual(testNumbers)
    })

    it('should turn number to bits manual setup', () => {
        const expectedNumbers = [120, 30, 70, 215]
        const inputBits: BitType[][] = [
            [0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 1, 0],
            [1, 1, 0, 1, 0, 1, 1, 1]
        ]

        const numbers = inputBits.map((bitArray) => fromBitArray(bitArray))
        expect(numbers).toStrictEqual(expectedNumbers)

        const inputNumbers = expectedNumbers
        const expectedBits = inputBits

        const bits = inputNumbers.map((u8) => toBitArray(u8))
        expect(bits).toStrictEqual(expectedBits)
    })
})
