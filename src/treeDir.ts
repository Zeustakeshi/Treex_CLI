import fs from "fs";
import * as path from "path";

export interface ShowOptions {
    deep: number;
    hiddenFile: boolean;
    onlyDir: boolean;
    path: string;
}

interface TreeDirType {
    show(option?: ShowOptions): void;
}

interface FileDetail {
    name: string;
    type: "dir" | "file";
    children?: FileDetail[];
}

enum ConsoleColor {
    RESET = "\u001B[0m",
    RED = "\u001B[31m",
    PURPLE = "\u001B[34m",
    GREEN = "\u001B[32m",
}

export default class TreeDir implements TreeDirType {
    constructor() {}

    private listDirectionContents(
        filePath: string,
        initialDeep: number
    ): FileDetail[] | undefined {
        if (initialDeep === 0) return;
        // get string array list all content of filepath
        const files = fs.readdirSync(filePath);

        // get file details
        const details = files.map((file): FileDetail => {
            const detail = fs.lstatSync(path.resolve(filePath, file));
            const isDir = detail.isDirectory();
            return {
                name: file,
                type: isDir ? "dir" : "file",
                children: isDir
                    ? this.listDirectionContents(
                          `${filePath}/${file}`,
                          initialDeep - 1
                      )
                    : undefined,
            };
        });

        return details;
    }

    private tree(
        dirContents: FileDetail[],
        initPath: string,
        options: ShowOptions
    ) {
        for (let index = 0; index < dirContents.length; ++index) {
            const content = dirContents[index];

            if (options.onlyDir && content.type !== "dir") continue;
            //
            if (content.name.startsWith(".") && !options.hiddenFile) continue;

            const textColor =
                content.type === "dir"
                    ? ConsoleColor.PURPLE
                    : ConsoleColor.GREEN;
            const pathType =
                index === dirContents.length - 1 ||
                (content.type === "dir" && index === dirContents.length - 1)
                    ? "└── "
                    : "├── ";
            console.log(
                `${textColor}${initPath}${pathType}${content.name}${ConsoleColor.RESET}`
            );

            if (content.children) {
                this.tree(content.children, `${initPath}│\t`, options);
            }
        }
    }

    show(options: ShowOptions): void {
        const dirContents = this.listDirectionContents(
            options.path,
            options.deep
        );
        if (!dirContents) {
            console.log("This empty");
            return;
        }

        this.tree(dirContents, "", options);
    }
}
