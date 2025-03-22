self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');

self.onmessage = function(e) {
    const { type, file } = e.data;
    if (type === 'PROCESS_FILE') {
        processExcelFile(file);
    }
};

async function processExcelFile(file) {
    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        self.postMessage({
            type: 'DATA_READY',
            payload: data
        });
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            payload: '文件处理失败: ' + error.message
        });
    }
}