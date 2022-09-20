const writeObject = async (obj, name) => {
    let file = new Blob([JSON.stringify(obj)], { type: JSON });
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = name + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

const readObject = async () => {
    [fileHandle] = await window.showOpenFilePicker();
    let file = await fileHandle.getFile();
    let contents = await file.text();
    return JSON.parse(contents);
}