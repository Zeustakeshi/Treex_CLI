#! /usr/bin/env node

import { Command } from "commander";
import TreeDir, { ShowOptions } from "./treeDir";
// console.log(figlet.textSync("MINH HIEU TREE DIR"));

const program = new Command();

program
    .version("1.0.0", "-V, --version", "Hiển thị phiên bản hiện tại")
    .description("Một command dùng để quản lý thư mục")
    .option("-a, --all", "Hiên thị cả thư mục ẩn")
    .option("-L, --Level [deep]", "Độ sâu hiển thị tối đa của cây thư mục")
    .option("-d, --dir", "Chỉ hiển thị thư mục")
    .option(
        "-p, --path [path]",
        "Hiển thị cây thư mục tại đường dẫn truyền vào"
    )
    .parse(process.argv);

const options = program.opts();

const tree = new TreeDir();

const defaultShowOption: ShowOptions = {
    deep: 1,
    hiddenFile: false,
    path: ".",
    onlyDir: false,
};

tree.show({
    ...defaultShowOption,
    deep: options.Level,
    hiddenFile: options.all,
    onlyDir: options.dir,
    path: options.path || ".",
});
