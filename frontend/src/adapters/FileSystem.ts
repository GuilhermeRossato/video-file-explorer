const endpoint = `http://[::1]:65367/`;

type ClientFileInfo = {
    path: string,
    name: string,
    mtime: Date
}

type ServerFileInfo = {
    path: string,
    name: string,
    mtime: string
}

export async function readFolderContents(path: string) {
    const response = await fetch(endpoint + "api/read/", {
        method: "POST",
        body: path
    });
    if (!response.ok) {
        const result = await response.json();
        if (result && result.error) {
            throw new Error("Server returned error message: " + result.error);
        }
        throw new Error("Server returned status code " + response.status + ": " + response.statusText);
    }
    const result = await response.json();
    if (result && result.error) {
        throw new Error("Server returned error message: " + result.error);
    }
    if (!(result.files instanceof Array)) {
        throw new Error("Server returned unexpected object: Invalid 'files' array");
    }

    const files: ClientFileInfo[] = result.files.map(
        (file: ServerFileInfo) => ({
            path: file.path,
            name: file.name,
            mtime: new Date(file.mtime)
        })
    )

    return files;
}