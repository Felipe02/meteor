import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Historic } from '../../api/api.js';
import template from './report.html';

/*
* Criação do componente 
* reletório
*/
class HistoryCtrl {

  constructor($scope) {
    $scope.viewModel(this);
    this.helpers({
      //Função para mostrar os dados inseridos
      report() {
        return Historic.find({}, {
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
}

//Criação do módulo report
export default angular.module('report', [
  angularMeteor
])
  .component('report', {
    templateUrl: 'imports/components/templates/report.html',
    controller: HistoryCtrl
  });



