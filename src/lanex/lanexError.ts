export class LanexError extends Error {

    public range: { start: number, end: number, line: number }

    public constructor(message: string, object: { range: { start: number, end: number, line: number }}) {
        super(message)
        this.range = object.range
    }
}