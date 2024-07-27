export class ByteReader {
    private cursor = 0
    private bytes: Uint8Array

    constructor(buffer: ArrayBuffer) {
        this.bytes = new Uint8Array(buffer)
    }

    public viewCursor(offset: number) {
        const data = new DataView(this.bytes.slice(this.cursor, this.cursor + offset).buffer)
        this.cursor += offset
        return data
    }

    public readU8(): number {
        return this.viewCursor(1).getUint8(0)
    }

    public readU16(): number {
        return this.viewCursor(2).getUint16(0)
    }

    public readU32(): number {
        return this.viewCursor(4).getUint32(0)
    }

    public readU64(): bigint {
        return this.viewCursor(8).getBigUint64(0)
    }

    public readUTF8(lengthBytes: 'u8' | 'u16' | 'u32' = 'u32'): string {
        const data = []
        const length =
            lengthBytes == 'u8'
                ? this.readU8()
                : lengthBytes == 'u16'
                  ? this.readU16()
                  : this.readU32()

        for (let i = 0; i < length; i++) {
            data.push(this.viewCursor(1).getUint8(0))
        }

        const bytes = new Uint8Array(data)

        return new TextDecoder().decode(bytes)
    }

    public readUTF8Length(length: number) {
        const data = []

        for (let i = 0; i < length; i++) {
            data.push(this.viewCursor(1).getUint8(0))
        }

        const bytes = new Uint8Array(data)

        return new TextDecoder().decode(bytes)
    }
}
