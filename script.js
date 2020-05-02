
// Функция генерации чисел
const generateId = () => `ID${Math.round(Math.random() * 1e8).toString(16)}`;
// Присвоенные селекторы для работы с ними 
const totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.getElementById('form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

let dbOpearation = JSON.parse(localStorage.getItem('calc')) || [];

// let dbOpearation = [
//     {
//         id: '1',
//         description: 'Получил зарплату',
//         amount: 30000,
//     },
//     {
//         id: '2',
//         description: 'Подписка VkMusic',
//         amount: -175,
//     },
//     {
//         id: '3',
//         description: 'Возврата долга',
//         amount: +500,
//     },
//     {
//         id: '4',
//         description: 'Покупка обуви',
//         amount: -11000,
//     },
//     {
//         id: '5',
//         description: 'Сдал проект',
//         amount: 18000,
//     },
//     {
//         id: '6',
//         description: 'Покупка бижютерии',
//         amount: -2900,
//     },
// ];
// typeof - позволяет понять какой тип данных
// console.log(typeof localStorage.getItem('calc'));
//  localStorage - это объект который есть в любом браузере, храилище он может там хранить данные 
// в нем можно хранить только строку и число

// Функция динамичесого заполнения 
const renderOperation = (operation) => {

    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus'; 
    
    const listItem = document.createElement('li');
    
    listItem.classList.add('history__item');
    listItem.classList.add(className);

    // `` - эти ковычки учитывают всю табуляцию которая содержиться в них
    // ${operation.description} = Интерполяция - использование переменных в вызове HTML
    listItem.innerHTML = `${operation.description}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history_delete data—id="${operation.id}">x</button>
    `;
    // Добавляем на страницу 
    historyList.append(listItem);
};
// Функция перебора массива
const updateBalance = () => {
    // Каждый элемент который true запишет в resultIncome создав массив
    // const resultIncome = dbOpearation.filter((item) => {
    //     return item.amount > 0;
    // });

    // console.log(resultIncome);

    // const resultExpenses = dbOpearation.filter((item) => {
    //     return item.amount < 0;
    // });

    // console.log(resultExpenses);
    const resultIncome = dbOpearation
        .filter((item) => item.amount > 0)
        //Первый результат который вернет в result будет ноль, чтобы это произошло пишем через ,0
        .reduce((result, item) => result + item.amount, 0); 

    const resultExpenses = dbOpearation
        .filter((item) => item.amount < 0)
        .reduce((result, item) => result + item.amount, 0);

        totalMoneyIncome.textContent = resultIncome + ' ₽';
        totalMoneyExpenses.textContent = resultExpenses + ' ₽';
        totalBalance.textContent = (resultExpenses + resultIncome) + ' ₽';
};
// Функция добавления
const addOperation = (event) => {
    // event - объект события, слушате, желательно для кроссбраузерности всегда принимать его \
    // preventDefault - этот метод запрещает выполнять стандартное поведение (например запрещает принажатии переходить на ссылки) 
    //или в нашем случае запрещает перезагружаться 
    event.preventDefault();
    
    const operationNameValue = operationName.value, 
        operationAmountValue = operationAmount.value;
    
    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationNameValue && operationAmountValue) {

        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
        };
        dbOpearation.push(operation);
        init();
        console.log(operation);
    }else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    }

    operationName.value = '';
    operationAmount.value = '';
};

// const deleteOperation = (event) => {
//     if (event.target.classList.contains('history__delete')) {
//         console.log(evnet.target);
//     }
const deleteOperation = (event) => {
    const target = event.target;
     // contains() - проверяет выбранные класс на его присутствие
    if (target.classList.contains('history_delete')) {
        console.log(target.dataset.id);
        dbOpearation = dbOpearation.filter(operation => operation.id !== target.id);
        init();
    }
    

    // contains() - проверяет выбранные класс на его присутствие
    // const target = event.target;
    // if (event.target.classList.contains('history_delete')) {
    //     console.log(event.target.dataset.id);
    //     dbOpearation = dbOpearation.filter(operation => operation.id !== target.dataset.id);
    //     init();
    // }
};

// Функция вывода
const init = () => {
    // textcontent использует меньше ресурсов чем innerHTML
    historyList.textContent = '';
    // Обработка вывода массива
    dbOpearation.forEach(renderOperation);
    // Визуализация баланса
    updateBalance();
    // stringify - переводит любой тип данных в сторку
    localStorage.setItem('calc', JSON.stringify(dbOpearation));

    // for (let i = 0; i < dbOpearation.length; i++) 
    // {
    //     renderOperation(dbOpearation[i]);
    // }  
};
// Навешаные события
form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);
init();

