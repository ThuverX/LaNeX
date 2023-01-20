import { NormalizedNode } from "../nast/NormalizedNode";

export abstract class Renderer<T> {
    public abstract render(ast: NormalizedNode): T
}