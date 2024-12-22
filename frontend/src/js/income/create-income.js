import { HttpUtils } from "../utils/http-utils";


export class CreateIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.inputElement = document.getElementById('createIncomesCategory');
        this.createIncomeBtn =  document.getElementById('createIncomesCategoryBtn');
        console.log(this.createIncomeBtn)
 
        this.createIncomeBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            this.addCategory()
        })
     
    }

    validateForm(){
        let isValid = true;
        if(this.inputElement.value){
            this.inputElement.classList.remove('is-invalid');
        } else {
            this.inputElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async addCategory(){
        
        if(this.validateForm()){
            const result = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.inputElement.value
            });


            if(result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка добавлении категории расхода');
            }
            return this.openNewRoute('/incomes');
        }
    }


}
