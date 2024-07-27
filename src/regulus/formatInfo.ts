import { ByteReader, ByteWriter, toBitArray, fromBitArray } from '../bytes'

export class FormatInfo {
    public color: number
    constructor(
        /// must fit in 4 bits (2 ** 4 - 1)
        color: number,
        public bold: boolean,
        public italic: boolean
    ) {
        if (color > 2 ** 4 - 1 || color < 0)
            throw new Error(
                'Colors are stored with unsigned 4-bit can cannot store anything below 0 or above 15'
            )
        this.color = color
    }

    public static from(reader: ByteReader) {
        const bits = toBitArray(new Uint8Array(reader.viewCursor(1).buffer)[0])
        const color = fromBitArray([0, 0, 0, 0, bits[1], bits[2], bits[3], bits[4]])

        return new FormatInfo(color, Boolean(bits[5]), Boolean(bits[6]))
    }

    public to(writer: ByteWriter) {
        const colorBits = toBitArray(new Uint8Array([this.color])[0])

        const byte = fromBitArray([
            0,
            colorBits[4],
            colorBits[5],
            colorBits[6],
            colorBits[7],
            this.bold ? 1 : 0,
            this.italic ? 1 : 0,
            0
        ])

        writer.add(new Uint8Array([byte]))
    }
}
