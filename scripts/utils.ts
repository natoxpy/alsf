export function randomStr(length: number = 8) {
    let string = ''
    while (string.length < length) {
        string += Math.random().toString(26).slice(2)
    }

    return string.slice(0, length)
}

export const regenFormatType = () => ({
    color: Math.floor(Math.random() * 15),
    bold: !Math.round(Math.random()),
    italic: !Math.round(Math.random())
})

export type FormatType = ReturnType<typeof regenFormatType>

export const regenTimeunit = () => 1000 * (60 * Math.floor(Math.random() * 100))
