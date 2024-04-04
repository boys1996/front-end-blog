import path from "node:path";
import fs from "node:fs";

// 文件根目录
const DIR_PATH = path.resolve();
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST = [
    "vueBasics.md",
    ".vitepress",
    "node_modules",
    ".idea",
    "assets",
];

// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

// 取差值
const intersections = (arr1, arr2) =>
    Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

// 把方法导出直接使用
function getList(params, path1, pathname) {
    // 先进行排序根据文件前面的数字经行排序
    params = params.sort((a, b) =>{
        if(!a.match(/\d+/g)) {
            return -1;
        }
        const aNum = a.match(/\d+/)[0];
        const bNum = b.match(/\d+/)[0];
        return aNum - bNum;
    });

    // 存放结果
    const res = [];
    // 开始遍历params
    for (let file in params) {
        // 拼接目录
        const dir = path.join(path1, params[file]);
        // 判断是否是文件夹
        const isDir = isDirectory(dir);
        if (isDir) {
            // 如果是文件夹,读取之后作为下一次递归参数
            const files = fs.readdirSync(dir);
            res.push({
                text: params[file].replace(/^\d+_/, ''),
                collapsed: false,
                items: getList(files, dir, `${pathname}/${params[file]}`),
            });
        } else {
            // 获取名字
            const name = path.basename(params[file]);
            // 排除非 md 文件
            const suffix = path.extname(params[file]);
            if (suffix !== ".md") {
                continue;
            }
            // 截取
            const fileName = name.slice(0, -3);

            res.push({
                text: fileName === 'index' ? '介绍' : fileName.replace(/^\d+_/, ''),
                link: `${pathname}/${fileName}`,
            });
        }
    }
    return res;
}

export const set_sidebar = (pathname) => {
    // 获取pathname的路径
    const dirPath = path.join(DIR_PATH, pathname);
    // 读取pathname下的所有文件或者文件夹
    const files = fs.readdirSync(dirPath);
    // 过滤掉
    const items = intersections(files, WHITE_LIST);
    // getList 函数后面会讲到
    return getList(items, dirPath, pathname);
};
