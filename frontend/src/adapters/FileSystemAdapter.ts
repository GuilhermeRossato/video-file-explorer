const endpoint = `http://[::1]:8081/`;

export type ClientFileInfo = {
    path: string,
    name: string,
    mtime: Date,
    type: string,
    message?: string,
    size: number
}

type ServerFileInfo = {
    path: string,
    name: string,
    mtime: string,
    type: string,
    message?: string,
    size: number,
}

function generateClientFileInfo(file: ServerFileInfo) {
    return {
        path: file.path,
        name: file.name,
        mtime: new Date(file.mtime),
        type: file.type,
        message: file.message,
        size: file.size
    };
}

export async function readCwd() {
    const response = await fetch(endpoint + "api/cwd/");
    if (!response.ok) {
        const result = await response.json();
        if (result && result.error) {
            throw new Error("Server returned error message: " + result.error);
        }
        throw new Error("Server returned status code " + response.status + ": " + response.statusText);
    }
    const result: ({error: string} | {cwd: string}) = await response.json();
    if (result && "error" in result) {
        throw new Error("Server returned error message: " + result.error);
    }
    if (typeof result.cwd !== "string") {
        throw new Error("Server returned unexpected object: Invalid 'cwd' property");
    }
    return result.cwd;
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

    const files: ClientFileInfo[] = result.files.map(generateClientFileInfo);

    return files;
}