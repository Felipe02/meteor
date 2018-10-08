var DataPoints = [];
var position = 0;
const url = "http://localhost:3000/products";
const urlCheckout = 'http://localhost:3000/checkout';
const method = ['GET', 'POST'];

/*
 * Consumo do serviço para adicionar 
 * os produtos na interface
*/
$(document).ready(function () {
    $.ajax({
        method: method[0],
        url: url,
        success: function (result) {
            for (let _i = 0; _i < result.length; _i++) {
                DataPoints.push({
                    "title": result[_i].title,
                    "category": result[_i].category,
                    "description": result[_i].description,
                    "price": result[_i].price,
                    "freight": result[_i].freight,
                    "days": result[_i].days
                });
            }
            for (let _i = 0; _i < DataPoints.length; _i++) {
                $('#myUL').append(
                    '<li class="collection-item" onclick="listPosition(' + _i + ')">' +
                    '<span><b>Título: ' + ' ' + DataPoints[_i].title + '</b></span><br>' +
                    '<span>Categoria: ' + DataPoints[_i].category + '<span><br>' +
                    '<span>Preço:</b>R$ ' + DataPoints[_i].price + ',00</span>' +
                    '<span id=' + _i + ' style="display:none">Descrição: ' + DataPoints[_i].description + '</span>' +
                    "</li>"
                );
            }
        },
        error: function (request, error) {
            console.log(error);
        }
    });
});
/*
 * Descobre a posição 
 * da lista
*/
function listPosition(item) {
    position = item;
}

/*
 *  Seleciona e contabiliza o 
 *  total de produtos
*/
$('.collection')
    .on('click', '.collection-item', function () {

        //Mostra detalhes do pedidos
        document.getElementById(position).style.display = 'block'

        var nameProduct = this.firstChild.textContent;
        Materialize.toast(nameProduct + ' adicionado', 900);
        var $badge = $('.badge', this);

        if ($badge.length === 0) {
            $badge = $('<span class="badge brown-text">0</span>').appendTo(this);
        }

        var pattern = /[^,\d]+/g;
        var qt = $badge.text();
        var num = qt.replace(pattern, '');

        $badge.text('Quantidade: ' + (parseInt(num) + 1));
    })
    .on('click', '.badge', function () {
        $(this).remove();
        return false;
    });

$(document).ready(function () {
    $('.modal').modal();
});

/*  Adiciona o nome e quantidade do produto 
 *  selecionado no modal
*/
$('#confirmar').on('click', function () {
    var title = '';
    var qt = '';

    $('.badge').parent().each(function () {
        title += this.firstChild.textContent;
        qt += this.lastChild.textContent;
    });

    $('#product').empty().text(title);
    $('#freight').empty().text('Frete: R$' + DataPoints[position].freight + ',00')
    $('#days').empty().text('Tempo para entrega: ' + DataPoints[position].days + ' dias')
    $('#qt').empty().text(qt);
});

/*
 *  Envia os dados do comprador 
 *  para o servidor via HTTP
*/
$('.acao-finalizar').on('click', function () {
    var pattern = /[^,\d]+/g;
    var str = $('#qt').text();
    var quantity = str.replace(pattern, '');

    //Parse data
    var date = new Date();
    var now = parseInt(date.getDate());
    var days = parseInt(DataPoints[position].days);
    date.setDate(now + days);
    var deadline = date.toLocaleDateString();

    $.ajax({
        method: method[method.length - 1],
        url: urlCheckout,
        data: {
            name: $('#name').val(),
            address: $('#address').val(),
            price: DataPoints[position].price,
            days: DataPoints[position].days,
            title: DataPoints[position].title,
            quantity: quantity
        },
        error: function (erro) {
            Materialize.toast(erro.responseText, 3000, 'red-text');
        },
        success: function (message) {
            Materialize.toast('Resumo da compra' +
                '<br>Produto: ' + DataPoints[position].title +
                '<br>Quantidade: ' + quantity +
                '<br>Prazo de entrega: ' + deadline +
                '<br>' + message, 7000
            );
        }
    });
    // Limpa os campos após o envio das informações
    $('#name').val('');
    $('#address').val('');
    //  $('#qt').val('');
    $('.badge').remove();
});
/*
 *  Limpa as informações após 
 *  cancelar a compra
*/
$('.acao-limpar').on('click', function () {
    $('#name').val('');
    $('#address').val('');
    $('#qt').val('');
    $('.badge').remove();
    $('.quote').remove();
});

$('.tap-target').tapTarget('open');
$('.tap-target').tapTarget('close');

