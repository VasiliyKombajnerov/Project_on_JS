import { DateFilter } from "../config/data-filter";
import { HttpUtils } from "../utils/http-utils";

export class MainChart {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeChart = null; // Инициализация переменных для графиков
        this.expensesChart = null;

        // Вызов метода для загрузки операций при создании экземпляра
        this.init();
    }

    async init() {
        await this.getOperations('all'); // Получаем все операции
  
        new DateFilter(this.getOperations.bind(this)); // Инициализируем DateFilter
    }

    async getOperations(period, dateFrom = '', dateTo = '') {
        let url = '/operations?period=all';
        if (period !== 'all') {
            url = `/operations?period=interval&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        try {
            const result = await HttpUtils.request(url);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                throw new Error('Возникла ошибка при запросе операций');
            }
            console.log(result.response)
            this.loadOperationsIntoChart(result.response);
        } catch (error) {
            console.log(error.message);
        }
    }

    loadOperationsIntoChart(operations) {
        const incomeData = this.getDataByType(operations, 'income');
        const expensesData = this.getDataByType(operations, 'expense');
        this.renderCharts(incomeData, expensesData);
    }

    getDataByType(operations, type) {
        const filteredOperations = operations.filter(operation => operation.type === type);
        const categoriesSum = {};

        filteredOperations.forEach(operation => {
            categoriesSum[operation.category] = (categoriesSum[operation.category] || 0) + parseFloat(operation.amount);
        });

        const labels = Object.keys(categoriesSum);
        const data = Object.values(categoriesSum);
        const backgroundColor = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'];

        return { labels, data, backgroundColor };
    }

    renderCharts(incomeData, expensesData) {
        this.destroyCharts(); // Уничтожаем старые графики

        // Создаем новые графики
        this.incomeChart = this.createChart('income-diagramma', incomeData);
        this.expensesChart = this.createChart('expenses-diagramma', expensesData);
    }

    destroyCharts() {
        if (this.incomeChart) {
            this.incomeChart.destroy();
            this.incomeChart = null; // Сбрасываем переменную
        }
        if (this.expensesChart) {
            this.expensesChart.destroy();
            this.expensesChart = null; // Сбрасываем переменную
        }
    }

    createChart(canvasId, chartData) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    backgroundColor: chartData.backgroundColor,
                    data: chartData.data
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#000',
                            boxWidth: 35,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                    },
                    title: {
                        display: false,
                    }
                }
            }
        });
    }
}

