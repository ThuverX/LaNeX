import { LaNeXEngine } from "../lanexEngine"
import { Command } from "./Command"
import { AuthorCommand } from "./core/document/AuthorCommand"
import { DateCommand } from "./core/document/DateCommand"
import { DocumentclassCommand } from "./core/document/DocumentclassCommand"
import { MakeTitleCommand } from "./core/document/MakeTitleCommand"
import { TitleCommand } from "./core/document/TitleCommand"
import { UsepackageCommand } from "./core/polyfill/UsepackageCommand"
import { NewLineCommand } from "./core/text/NewlineCommand"
import { SectionCommand } from "./core/section/SectionCommand"
import { TextBfCommand } from "./core/text/TextBfCommand"
import { TextItCommand } from "./core/text/TextItCommand"
import { SubSectionCommand } from "./core/section/SubSectionCommand"
import { SubSubSectionCommand } from "./core/section/SubSubSectionCommand"
import { ItemCommand } from "./core/list/ItemCommand"
import { TextUnderscoreCommand } from "./core/text/TextunderscoreCommand"

export class CommandRegistery {
    private commands: Map<string, Command> = new Map()
    private aliases: Map<string, string> = new Map()

    private parent: LaNeXEngine<any>

    constructor(parent: LaNeXEngine<any>) {
        this.parent = parent
        
        this.registerCommand('\\', NewLineCommand)
        this.registerCommand('newline', NewLineCommand)
        this.registerCommand('documentclass', DocumentclassCommand)
        this.registerCommand('usepackage', UsepackageCommand)

        this.registerCommand('textbf', TextBfCommand)
        this.registerCommand('textit', TextItCommand)
        this.registerCommand('textunderscore', TextUnderscoreCommand)

        this.registerCommand('title', TitleCommand)
        this.registerCommand('author', AuthorCommand)
        this.registerCommand('date', DateCommand)

        this.registerCommand('maketitle', MakeTitleCommand)

        this.registerCommand('section', SectionCommand)
        this.registerCommand('subsection', SubSectionCommand)
        this.registerCommand('subsubsection', SubSubSectionCommand)

        this.registerCommand('item', ItemCommand)
    }

    public registerCommand(name: string, command: typeof Command) {
        this.commands.set(name, new (command as any)(this.parent))
    }

    public registerAlias(name: string, alias: string) {
        this.aliases.set(alias, name)
    }

    public get(name: string): Command | undefined {
        return this.commands.get(this.aliases.get(name) || name)
    }

    public getCommandList(): string[] {
        return [...Array.from(this.commands.keys()), ...Array.from(this.aliases.keys())]
    }
}