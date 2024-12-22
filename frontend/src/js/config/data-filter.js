export class DateFilter {
    constructor(getOperations) {
        this.getOperations = getOperations;
        this.periodButtons = document.querySelectorAll('.select-interval');
        this.startDatePicker = document.getElementById('start-date');
        this.endDatePicker = document.getElementById('end-date');
        if (this.periodButtons && this.startDatePicker && this.endDatePicker) {
            this.initButtonsListeners();
        } else {
            console.error('One or more elements are missing.');
        }
    }
      
    

    initButtonsListeners() {
        this.periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // считываем атрибут
                let period = button.getAttribute('data-period');
                // вызов функции с парметром значения атрибута 
                this.filterChange(period);
            });
        });

        this.startDatePicker.addEventListener('change', () => {
            let activeButton = document.querySelector('.select-interval.active');
            if (activeButton && activeButton.getAttribute('data-period') === 'interval') {
                this.filterChange('interval');
            }
        });

        this.endDatePicker.addEventListener('change', () => {
            let activeButton = document.querySelector('.select-interval.active');
            if (activeButton && activeButton.getAttribute('data-period') === 'interval') {
                this.filterChange('interval');
            }
        });
    }

    filterChange(period) {
        const { dateFrom, dateTo } = this.calculateDates(period); // это деструктуризация одномоментное пртсвоение значение двум переменным значение вернет функция this.calculateDates(period)
        this.getOperations(period, dateFrom, dateTo);
    }

    calculateDates(period) { //вычисляем периоды для фильтра
        let dateFrom = '';
        let dateTo = '';
        let today = new Date();

        switch (period) {
            case 'today':
                dateFrom = dateTo = today.toISOString().split('T')[0];
                break;
            case 'week':
                let dayOfWeek = today.getDay();
                let diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                let startOfWeek = new Date(today.setDate(diff));
                dateFrom = startOfWeek.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'month':
                let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                dateFrom = startOfMonth.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'year':
                let startOfYear = new Date(today.getFullYear(), 0, 1);
                dateFrom = startOfYear.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'all':
                dateFrom = '';
                dateTo = '';
                break;
            case 'interval':
                dateFrom = this.startDatePicker.value;
                dateTo = this.endDatePicker.value;
                break;
        }

        return { dateFrom, dateTo };
    }
}