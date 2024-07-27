export type BitType = 1 | 0

export const Maxu8 = 2 ** 8 - 1

export function toBit(num: number): BitType {
    return num ? 1 : 0
}

export function toBitArray(u8: number) {
    return [
        toBit(u8 & (2 ** 7)),
        toBit(u8 & (2 ** 6)),
        toBit(u8 & (2 ** 5)),
        toBit(u8 & (2 ** 4)),
        toBit(u8 & (2 ** 3)),
        toBit(u8 & (2 ** 2)),
        toBit(u8 & (2 ** 1)),
        toBit(u8 & (2 ** 0))
    ]
}

export function fromBitArray(bitArray: BitType[]): number {
    if (bitArray.length !== 8) throw Error('Array must have 8 BitType values.')
    return (bitArray as number[])
        .slice()
        .reverse()
        .reduce((sum, bit, i) => sum + (bit << i))
}

// export function byteEncoder(bytes: Array<Array<BitType>>): Uint8Array {
//     const buffer = new ArrayBuffer(bytes.length)
//     const uint8 = new Uint8Array(buffer)
//
//     // for (const [byteIndex, bitList] of bytes.entries()) {
//     //     if (bitList.length !== 8)
//     //         throw Error(
//     //             'Array must have at least 8, either Truthy or Falsy (' + bitList.length + ')'
//     //         )
//
//     //     const bits = []
//
//     //     for (const [bitIndex, bitItem] of bitList.entries()) {
//     //         bits.push(toBit(bitItem) << bitIndex)
//     //     }
//
//     //     uint8[byteIndex] = bits.reduce((v, c) => v + c)
//     // }
//
//     return uint8
// }

// export function byteDecoder(bytes: Uint8Array): Array<Array<BitType>> {
//     const bits: BitType[][] = []
//
//     for (const byte of bytes) {
//         bits.push(toBitArray(byte))
//     }
//
//     return bits
// }
