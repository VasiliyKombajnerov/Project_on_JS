import { HttpUtils } from "../utils/http-utils";

export class EditIncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        this.init(id).then();
        this.typeSelectElement = document.getElementById('type-select');
        this.categorySelectElement = document.getElementById('category');
        this.sumElement = document.getElementById('sum');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.operationOriginalData = null;
        this.typeOperation = null;

        document.getElementById('update-button').addEventListener('click', this.updateIncomeExpense.bind(this))

    }

    async init(id) {
        const operationData = await this.getOperation(id).then();
        console.log(operationData);
        if (operationData) {
            this.showOption(operationData);
        }


    }
    //получит обект с опциями операции по id
    async getOperation(id) {
        try {
            const result = await HttpUtils.request(`/operations/${id}`);

            if (result.error || !result.response) {
                throw new Error('Не удалось загрузить операцию. Попробуйте еще раз.');
            }

            this.operationOriginalData = result.response;
            return result.response;

        } catch (error) {
            console.error('Ошибка при получении операции:', error);
            return alert(error.message || 'Произошла ошибка при загрузке операции. Обратитесь в поддержку.');
        }
    }

    showOption(operation) {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', operation.type);
        optionElement.selected = true;
        optionElement.innerText = operation.type === 'income' ? 'Доход' : 'Расход';
        this.typeSelectElement.appendChild(optionElement);
        this.typeSelectElement.disabled = true
        this.showCategories(operation.type, operation.category).then();
        this.sumElement.value = operation.amount
        this.dateElement.value = operation.date
        this.commentElement.value = operation.comment
        if (this.categorySelectElement) {
            for (let i = 0; i < this.categorySelectElement.options.length; i++) {
                if (this.categorySelectElement.options[i].value === operation.category) {
                    this.categorySelectElement.selectedIndex = i
                }

            }
        }
    }


    async showCategories(type, selectedCategory) {
        try {
            const categories = await this.getCategories(type);

            // Очищаем предыдущие опции
            this.categorySelectElement.innerHTML = '';

            // Добавляем новые опции
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", category.id);
                optionElement.innerText = category.title;
                this.categorySelectElement.appendChild(optionElement);

                // Устанавливаем выбранную категорию
                if (category.title === selectedCategory) {
                    optionElement.selected = true; // Устанавливаем флаг selected
                }
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            alert('Не удалось загрузить категории. Попробуйте еще раз.');
        }
    }
    //этот код вынести в отдельный файл можно 
    async getCategories(type) {
        try {
            const result = await HttpUtils.request(`/categories/${type}`);

            // Проверка на ошибки в результате
            if (result.error || !result.response) {
                throw new Error('Не удалось загрузить категории. Попробуйте еще раз.');
            }

            return result.response;

        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            alert(error.message || 'Произошла ошибка при загрузке категорий. Обратитесь в поддержку.');
        }
    }


    validateForm() {
        let isValid = true;
        let textInputArray = [
            this.typeSelectElement,
            this.categorySelectElement,
            this.sumElement,
            this.dateElement,
            this.commentElement
        ]
        for (let i = 0; i < textInputArray.length; i++) {

            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false
            }
        }

        return isValid;
    }


    async updateIncomeExpense(e) {
        e.preventDefault()
        if (this.validateForm()) {
            const changedData = {}
            if (this.sumElement.value !== this.operationOriginalData.amount) {
                changedData.amount = this.sumElement.value
            }
            if (this.typeSelectElement.value !== this.operationOriginalData.type) {
                changedData.type = this.sumElement.value
            }
            if (this.categorySelectElement.value !== this.operationOriginalData.category) {
                changedData.category = this.categorySelectElement.value
            }
            if (this.dateElement.value !== this.operationOriginalData.date) {
                changedData.date = this.dateElement.value
            }
            if (this.commentElement.value !== this.operationOriginalData.comment) {
                changedData.comment = this.commentElement.value
            }

            if (Object.keys(changedData).length > 0) {

                const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, {
                    type: this.typeSelectElement.value,
                    amount: this.sumElement.value,
                    date: this.dateElement.value,
                    comment: this.commentElement.value,
                    category_id: Number(this.categorySelectElement.value)
                }, changedData)

                if (result.redirect) {
                    return this.openNewRoute(result.redirect)
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return console.log('Возникла ошибка при Редактирование. Обратитесь в поддержку')
                }
                return this.openNewRoute('/incomes-expenses')
            }
        }
    }
}


