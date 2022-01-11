let moment = require('moment');

// IIFE -- Immediately Invoked Function Expression
(function(){

    function Start()
    {
        console.log("App started...");
        let deleteButtons = document.querySelectorAll('.btn-danger')
        for (button of deleteButtons)
        {
            button.addEventListener('click', (event) => {
                if(!confirm('Voce tem certeza?'))
                {
                    event.preventDefault();
                    window.location.assign('/admin');
                }

            });
        }    
    }
    window.addEventListener("load", Start);

})();

function getDateFormat(date){
    var a = moment(date).format('DD-MM-YYYY');
    return a;

}

function buscarJogos()
    {
        var bolao = document.getElementById('bolao');
        var jogo = document.getElementById('jogos');
        console.log('Entrou');
        boloesList.forEach(element => 
        {
            if(bolao.value == element.bolao)
            {
                element.jogos.forEach(jogo => 
                {
                    var item = document.createElement('option')
                    item.text = jogo.time1 + " x " + jogo.time2
                    jogos.appendChild(item)
                });
            }
                
        });
        
    }




