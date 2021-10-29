import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

    chartHeight = 50;
    element = null;

    constructor({url = '', range = {}, label = '', link = ''} = {}) {
        this.url = url;
        this.range = range;
        this.label = label;
        this.link = link;


        this.render();
        this.subElements = this.getSubElements();
        this.update(this.range.from, this.range.to);
    }

    getSubElements() {
        const result = {}

        const elements = this.element.querySelectorAll('[data-element]');

        for(const elem of elements) {
            result[elem.dataset.element] = elem;
        }

        return result;
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = this.getTemplate();

        this.element = element.firstElementChild;
    }

    getTemplate() {
        return `
                <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                    <div class="column-chart__title">
                    Total ${this.label}
                    <a class="column-chart__link" href="${this.link}">${this.link ? 'View all' : ''}</a>
                    </div>
                    <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header"></div>
                        <div data-element="body" class="column-chart__chart">${this.createColumnChart(this.data)}</div>
                    </div>
                </div>
        `;
    }

    async update(from, to) {
        this.element.classList.add('column-chart_loading');

        const url = `${BACKEND_URL}/${this.url}?from=${from}&to=${to}`;
        const promise = fetchJson(url);
        
        return promise.then(response => {
            const data = [];
            
            for(const column in response) {
                data.push(response[column]);
            }

            const {header, body} = this.subElements;
            header.innerHTML = this.sum(...data);
            body.innerHTML   = this.createColumnChart(data);
    
            this.element.classList.remove('column-chart_loading');

            
            return response;
        });
    }

    sum(...array) {
        return array.reduce( (sum, item) => sum + item, 0);
    }

    createColumnChart(arrCol = []) {
        let stringColumn = '';

        for( const elem of arrCol) {
            const factor = this.chartHeight / Math.max(...arrCol);

            const sizeColumn = Math.floor(elem * factor);
            stringColumn = stringColumn + `<div style="--value: ${sizeColumn}" data-tooltip="${Math.round(elem * factor / this.chartHeight * 100)}%"></div>`;
        }

        return stringColumn;
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }
}

