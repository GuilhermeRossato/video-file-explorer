export function removeTrailingSlash(path: string) {
    if (!path) {
        throw new Error("Invalid path");
    }
    if (path === "/") {
        return path;
    }
    if (path[path.length - 1] === "/" || path[path.length - 1] === "\\") {
        // Check to avoid removing trailing when its root url on Windows
        if (path.length === 3 && path[1] === ":") {
            return path;
        }
        return path.substring(0, path.length - 1);
    }
    return path;
}
