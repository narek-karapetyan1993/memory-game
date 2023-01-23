/// <reference types="cypress" />

const numberOfRows = 4;

describe('Игра в пары', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // cy.get('input').type(numberOfRows);
    cy.contains('Начать игру').click();
  });

  it('В начальном состоянии поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима', () => {
    cy.get('.game__board')
      .find('.game__card')
      .should('have.length', numberOfRows * numberOfRows);
    cy.get('.game__board')
      .find('.game__card')
      .should('have.not.class', 'card__flip');
  });

  it('Нажать на карточку. Убедиться, что она осталась открытой', () => {
    cy.get('.game__card').eq(7).click();
    cy.get('.game__card').eq(7).should('have.class', 'card__flip');
  });

  it('Найти одну пару. Проверить, что найденная пара осталась открытой', () => {
    let counter = 1;

    function clickCards(cards) {
      cy.get(cards[0]).click();
      cy.get(cards[counter]).click();
      if (cards[0].dataset.number === cards[counter].dataset.number) {
        cy.get(cards[0]).should('have.class', 'card__flip');
        cy.get(cards[counter]).should('have.class', 'card__flip');
      } else {
        counter++;
        clickCards(cards);
      }
    }
    cy.get('.game__card').then(($cards) => {
      clickCards($cards);
    });
  });

  it('Найти все пары. Проверить, что после нажатия на не парную карточку обе становятся невидимыми', () => {
    let arr = [];

    cy.get('ul>li').each((element) => {
      let value;
      cy.wrap(element)
        .click()
        .invoke('attr', 'data-number')
        .then((attr) => {
          value = attr;
          arr.push(value);

          if (arr.length >= 2) {
            if (arr[0] !== arr[1]) {
              cy.get('.container')
                .pause()
                .should('have.not.class', 'card__flip')
                .and('have.length.gte', 1);
              return false;
            }
            arr.splice(0, 2);
          }
        });
    });
  });
});
