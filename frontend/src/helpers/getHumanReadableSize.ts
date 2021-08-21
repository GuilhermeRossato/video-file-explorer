export function getHumanReadableSize(bytes: number) {
    if (bytes < 1024) {
        return bytes + " Bytes";
    } else if (bytes < (1024 * 1024)) {
        return (bytes / 1024).toFixed(1) + " KB";
    } else if (bytes < (1024 * 1024 * 1024)) {
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    } else if (bytes < (1024 * 1024 * 1024 * 1024)) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    } else {
        return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(1) + " TB";
    }
}