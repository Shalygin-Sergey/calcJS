
const generateId = () => `serjJS${Math.round(Math.random() * 1e8).toString(16)}`

const totalBalance = document.querySelector('.total__balance'),
totalMoneyIncome = document.querySelector('.total__money-income'),
totalMoneyExpenses = document.querySelector('.total__money-expenses'),
historyList = document.querySelector('.history__list'),
form = document.querySelector('#form'),
operationName = document.querySelector('.operation__name'),
operationAmount = document.querySelector('.operation__amount');



let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];



// Получаем данные из локал стораж, распарсим и сохраним в dbOperation


const renderOperation = (operation) => { // operation дает нам все объекты массива 

  const className = operation.amount < 0 ? // создаем класс по проверке через больше или меньше нуля
  'history__item-minus' :
  'history__item-plus';

  const listItem = document.createElement('li');

  listItem.classList.add('history__item');
  listItem.classList.add(className); // добавляем класс

  listItem.innerHTML = `${operation.description}
  <span class="history__money">${operation.amount} ₽</span>
  <button class="history_delete" data-id="${operation.id}">x</button>
  `;                                                                           // с помощью Интерполяции получаем значение ключи и значения и работаем с ними

  historyList.append(listItem); // в список добавляем li элемент

}

const updateBalance = () => {                           // все что функция вернет и будет true - будет каждый элемент который вернул нам filter будет возвращен в resultIncome собиратся бдет новый массив
  const resultIncome = dbOperation  // filter перебирает текущий массив, достает элементы и сохраняет в новую переменную
  .filter((item) => item.amount > 0)                                      // метод filter возвращает условие true или false
  .reduce((result, item) => result + item.amount, 0); // 0 заходит при первой итерации в result а потом складывается
  
  

  const resultExpenses = dbOperation // filter перебирает текущий массив, достает элементы и сохраняет в новую переменную
  .filter((item) => item.amount < 0)                 // метод filter возвращает условие true или false 
  .reduce((result, item) => result + item.amount, 0);

  totalMoneyIncome.textContent = resultIncome + ' ₽';
  totalMoneyExpenses.textContent = resultExpenses + ' ₽';
  totalBalance.textContent = (resultIncome + resultExpenses) + ' ₽';
};

// добавляем дело на страницу
const addOperation = (event) => {
  event.preventDefault();

  const operationNameValue = operationName.value,
    operationAmountValue = operationAmount.value;

    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationNameValue !== '' && operationAmountValue !== '') {
      // Добавляет в массив новый объект
      const operation = {
        id: generateId(),
        description: operationNameValue,
        amount: +operationAmountValue,
      };

      dbOperation.push(operation);
      init();
      

    } else {
      if (!operationNameValue) operationName.style.borderColor = 'red';
      if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    }

    operationName.value = '';
    operationAmount.value = '';
};

// Удаляем дела
const deleteOperation = (event) => {
  const target = event.target;
  if (event.target.classList.contains('history_delete')) {
    dbOperation = dbOperation
      .filter(operation => operation.id !== target.dataset.id);

    init();
  }
};

const init = () => {
  historyList.textContent = '';
  dbOperation.forEach(renderOperation) // елемент, индекс, массив
  updateBalance();
  localStorage.setItem('calc', JSON.stringify(dbOperation)); // отправили данные в локал сторадж в строке обязательно ибо объекты от туда потом не достать

  // for(let i = 0; i < 5; i++) {
  //   renderOperation(dbOperation[i]); // Добавляем из элементов массива
  // }
};



form.addEventListener('submit', addOperation);

historyList.addEventListener('click', deleteOperation);

init();
