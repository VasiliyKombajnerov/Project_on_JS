import { HttpUtils } from "../utils/http-utils";



export class CategoryDeleter {
    static async deleteCategory(categoryType, id, categoryTitle, openNewRoute) {
        const categoryRoute = categoryType === 'income' ? '/categories/income/' : '/categories/expense/';
        const redirectRoute = categoryType === 'income' ? '/incomes' : '/expenses';
        // получить категорию на удаление по id
        // получить все операции перебрать и если ы операция.категория === категория.title удалить операцию
      
        const result2 = await HttpUtils.request('/operations?period=all');
        let allOperations = result2.response;
        // console.log(allOperations);
            let operationsWithCategoryTitle = allOperations.filter( operation => operation.category?.toLowerCase().trim() === categoryTitle.toLowerCase().trim());
        // console.log(operationsWithCategoryTitle);
        const result = await HttpUtils.request(categoryRoute + id, 'DELETE', true);
        for ( let operation of operationsWithCategoryTitle) {
                        const deleteResult = await HttpUtils.request('/operations/' + operation.id, 'DELETE', true);

                        if (deleteResult.redirect) {
                            return openNewRoute(deleteResult.redirect);
                        }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return console.log('Возникла ошибка при удалении операции');
            }
        }
        // console.log(result.response)
        if (result.redirect) {
            return openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении категории');
        }

        return openNewRoute(redirectRoute);
    }
}
