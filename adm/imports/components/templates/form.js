import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Products } from '../../api/api.js';
import template from './form.html';

/*
*  Criação do componente 
*  formulário
*/
class ProductsCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.helpers({
      //Função para mostrar os dados inseridos
      products() {
        return Products.find({}, {
          sort: {
            createdAt: -1
          }
        });
      },
      //Verifica se o usuário está logado
      currentUser() {
        return Meteor.user();
      },
      //Verifica se o usuário não está logado
      isNotLoggedIn() {
        return !!Meteor.userId();
      }
    })
  }
  // Insere os dados do produto no banco de dados
  addProduct(category, title, description, price) {
    //Validação dos campos
    if (category == undefined || title == undefined || price == undefined) {
      alert("Digite no(s) campo(s) em branco(s)");

    } else {
      if (description == undefined)
        description = 'Sem Descrição';

      // Inserção dos dados no bando de dados
      Products.insert({
        category: category,
        title: title,
        description: description,
        price: price,
        createdAt: new Date,
        owner: Meteor.userId(),
        username: Meteor.user().username
      });

      //Limpa os campos do formulário
      this.category.empty();
      this.title.empty();
      this.description.empty();
      this.price.empty();
    }
  }

  setChecked(product) {
    //Função para atualizar o dado selecionado
    Products.update(product._id, {
      $set: {
        checked: !item.checked
      },
    });
  }
  //Função para remover o dado selecionado
  removeProduct(product) {
    Products.remove(product._id);
  }
}

//Criação do módulo products
export default angular.module('products', [
  angularMeteor
])
  .component('products', {
    templateUrl: 'imports/components/templates/form.html',
    controller: ProductsCtrl
  });



