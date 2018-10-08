import angular from 'angular';
import angularMeteor from 'angular-meteor';
import products from '../imports/components/templates/form';
import report from '../imports/components/templates/report';
import '../imports/startup/accounts-config.js';

//módulo geral da interface
angular.module('simple-adm', [
  angularMeteor,
  products.name,
  report.name,
  'accounts.ui'
]);