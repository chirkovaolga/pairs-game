const mainContainer = document.getElementById('container');

document.addEventListener('DOMContentLoaded', () => {

  //создаем форму для определения сложности игры
  function createForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    form.classList.add('form');
    input.classList.add('input');
    input.placeholder = 'Введите количество карточек по вертикали';
    input.type = 'number';
    input.min = '2';
    input.max = '10';
    button.classList.add('button');
    button.textContent = 'Начать игру';

    mainContainer.append(form);
    form.append(input, button);

    //создаем обработчик для инпута
    button.addEventListener('click', () => {
      if (input.value % 2 === 0 && input.value <= 10 && input.value >= 2) {
        input.value = input.value;
      } else {
        input.value = 4;
      }

      form.remove();

      //создание игрового поля после определения параметров
      let firstCard = null;
      let secondCard = null;
      let randomNumberArray = [];

      //генерируем массив парных чисел
      function startGame(mainContainer, cardsRow) {
        function createNumbersArray(count) {
          count = cardsRow * 2;
          let arr = [];
          for (let i = 0; i < count; i++) {
            arr.push(i + 1);
            arr.push(i + 1);
          }
          return arr;
        }

        //перемешиваем массив
        function shuffle(arr) {
          for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
          }
          return arr;
        }

        randomNumberArray = shuffle(createNumbersArray());

        //создаем таймер

        let time = 60;
        let timeId;

        function createTime(time) {
          let div = document.createElement('div');
          div.classList.add('time');
          div.textContent = `До конца игры осталось: ${time}`;
          return div
        }

        function timerCount(div) {
          --time;
          div.textContent = `До конца игры осталось: ${time}`;
          if (time === 0) {
            clearInterval(timeId);
            alert(`Вы проиграли :(`);
            mainContainer.innerHTML = '';
            createForm();
          }
        }

        (() => {
          let timer = createTime(time);
          mainContainer.append(timer);
          timeId = setInterval(() => {
            timerCount(timer);
          }, 1000);

          //создаем карточки
          (() => {
            for (const numbers of randomNumberArray) {
              const card = document.createElement('div');
              card.classList.add('card');
              card.textContent = numbers;
              mainContainer.append(card);

              //настройка стилей при клике на карточки
              card.addEventListener('click', () => {
                if (card.classList.contains('card-open') || card.classList.contains('success')) {
                  alert(`Эта карточка уже открыта :( Попробуйте выбрать другую`)
                  return
                }

                if (firstCard !== null && secondCard !== null) {
                  firstCard.classList.remove('card-open');
                  secondCard.classList.remove('card-open');
                  firstCard = null;
                  secondCard = null;
                }

                card.classList.add('card-open');

                if (firstCard === null) {
                  firstCard = card;
                } else {
                  secondCard = card;
                }

                if (firstCard !== null && secondCard !== null) {
                  let firstCardNumber = firstCard.textContent;
                  let secondCardNumber = secondCard.textContent;
                  if (firstCardNumber === secondCardNumber) {
                    firstCard.classList.add('card-success');
                    secondCard.classList.add('card-success');
                  }
                }

                function containerWin() {
                  const containerWin = document.createElement('div');
                  containerWin.classList.add('win');
                  containerWin.textContent = 'Ура! Вы победили!';
                  mainContainer.append(containerWin);
                }

                //окончание игры
                if (randomNumberArray.length === document.querySelectorAll('.card-success').length) {
                  clearInterval(timeId);
                  containerWin();
                  setTimeout(() => {
                    mainContainer.innerHTML = '';
                    createForm();
                  }, 600);
                }
              })
            }
          })()
        })()
      }

      let cardsRow = input.value;
      startGame(mainContainer, cardsRow);

    });
  }
  createForm();
});
