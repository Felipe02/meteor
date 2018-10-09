import { Mongo } from 'meteor/mongo';
import bodyParser from 'body-parser';

export const Products = new Mongo.Collection('products');
export const Historic = new Mongo.Collection('historic');
const method = 'POST';

/*
*  Serviço para retornar os  
*  dados do produto
*/
if (Meteor.isServer) {

    Picker.route('/products', function (params, req, res, next) {

        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        //Consulta no bando de dados
        var products = Products.find().fetch();

        if (products.length > 0) {
            for (let _i = 0; _i < products.length; _i++) {
                // O serviço retorna um valor aleatório entre 0 - 100 referente ao frente
                products[_i].freight = Math.floor((Math.random() * 101));
                // O serviço retorna um valor aleatório entre 1 - 20 referente aos dias úteis
                products[_i].days = Math.floor((Math.random() * 20) + 1);
            }
        }

        //Valida a conversão (valor booleano) do resultado da expressão   
        if (!!params.query.random) {
            products = products.concat(products);
            //O serviço retorna os dados aleatóriamente
            shuffle(products);
        }

        //Retorna os dados em JSON para o cliente
        res.end(JSON.stringify(products));
    });

    Picker.middleware(bodyParser.json());
    Picker.middleware(bodyParser.urlencoded({ extended: true }));

    //Definição do metódo POST
    var postRoutes = Picker.filter(function (req, res) {
        return req.method == method;
    });

    /*
     *  Serviço para cadastrar os dados 
     *  enviados pelo cliente
    */
    postRoutes.route('/checkout', function (params, req, res, next) {

        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Formato de datas
        var dateNow = new Date();
        var date = new Date();

        var register = dateFormat(dateNow.getDate()) + '/'
            + dateFormat(dateNow.getMonth() + 1) + '/'
            + dateNow.getFullYear() + ' '
            + dateNow.toLocaleTimeString();

        var days = parseInt(date.getDate()) + parseInt(req.body.days);
        date.setDate(days);

        var deadline = dateFormat(date.getDate()) + '/'
            + dateFormat(date.getMonth() + 1) + '/'
            + date.getFullYear();

        // Inserção no banco de dados
        var historic = Historic.insert({
            title: req.body.title,
            quantity: req.body.quantity,
            price: req.body.price,
            address: req.body.address,
            name: req.body.name,
            ativo: true,
            register: register,
            deadline: deadline
        });

        res.statusCode = 200;
        //Retorno da mensagem
        res.end(JSON.stringify('Compra efetuada com sucesso, obrigado!'));
    });

    // Formato de data
    function dateFormat(n) {
        return n < 10 ? "0" + n : n;
    }
}


