export class ByteWriter {
    private bytes: ArrayBuffer[] = []

    public add(byte: ArrayBuffer) {
        this.bytes.push(byte)
    }

    public addU8(int: number) {
        const uint8 = new Uint8Array(1)
        new DataView(uint8.buffer).setUint8(0, int)
        this.bytes.push(uint8)
    }

    public addU16(int: number) {
        const uint8 = new Uint8Array(2)
        new DataView(uint8.buffer).setUint16(0, int)
        this.bytes.push(uint8)
    }

    public addU32(int: number) {
        const uint8 = new Uint8Array(4)
        new DataView(uint8.buffer).setUint32(0, int)
        this.bytes.push(uint8)
    }

    public addBigU64(bigInt: bigint) {
        const uint8 = new Uint8Array(8)
        new DataView(uint8.buffer).setBigUint64(0, bigInt)
        this.bytes.push(uint8)
    }

    public addUTF8(content: string, lengthBytes: 'u8' | 'u16' | 'u32' = 'u32') {
        const data = new TextEncoder().encode(content)

        if (lengthBytes == 'u8') this.addU8(data.length)
        else if (lengthBytes == 'u16') this.addU16(data.length)
        else this.addU32(data.length)

        this.bytes.push(data)
    }

    public getBytes() {
        let length = 0

        for (const buffer of this.bytes) {
            length += buffer.byteLength
        }

        const buffer = new ArrayBuffer(length)
        const view = new Uint8Array(buffer)

        let cursor = 0
        for (const buffer of this.bytes) {
            const bufferView = new Uint8Array(buffer)

            for (const data of bufferView) {
                view[cursor] = data
                cursor++
            }
        }

        return buffer
    }
}
