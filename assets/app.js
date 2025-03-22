class AdmissionSystem {
    constructor() {
        this.worker = new Worker('worker.js');
        this.initialize();
    }

    initialize() {
        this.registerEventListeners();
        this.setupWorker();
    }

    registerEventListeners() {
        document.getElementById('fileInput').addEventListener('change', e => this.handleFileUpload(e));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        window.addEventListener('resize', () => this.adjustTableLayout());
    }

    setupWorker() {
        this.worker.onmessage = (e) => {
            const { type, payload } = e.data;
            switch(type) {
                case 'DATA_READY':
                    this.handleDataReady(payload);
                    break;
                case 'PROGRESS_UPDATE':
                    this.updateProgress(payload);
                    break;
                case 'ERROR':
                    this.showError(payload);
                    break;
            }
        };
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading();
        this.worker.postMessage({
            type: 'PROCESS_FILE',
            file
        });
    }

    handleDataReady(data) {
        this.rawData = data;
        this.generateFilters();
        this.setupSorting();
        this.renderTable();
        this.hideLoading();
    }

    generateFilters() {
        const fields = Object.keys(this.rawData[0]);
        const filterContainer = document.getElementById('dynamicFilters');
        
        fields.forEach(field => {
            const filter = this.createFilterComponent(field);
            filterContainer.appendChild(filter);
        });
    }

    createFilterComponent(field) {
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-item';
        wrapper.innerHTML = `
            <label>${this.getFieldLabel(field)}</label>
            <input type="text" 
                   class="dynamic-filter" 
                   data-field="${field}"
                   placeholder="筛选${this.getFieldLabel(field)}">
        `;
        return wrapper;
    }

    // 其他方法保持类似结构...
}

// 初始化系统
const system = new AdmissionSystem();