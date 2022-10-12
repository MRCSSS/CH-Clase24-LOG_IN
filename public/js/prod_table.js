/* ---------------------------- MODULOS -----------------------------*/
const socket = io();

/* ---------------------------- WEBSOCKET ---------------------------*/
socket.on('serv-prods', async () => {
    await renderProducts().then(html => {
        document.getElementById('prods_table').innerHTML = html;
    })
})

/* --------------------------- HANDLEBARS ---------------------------*/
async function renderProducts () {
    return fetch('http://localhost:8080/api/productos-test', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(async data => {
            return fetch('templates/prod_table.hbs')
                .then(resp => resp.text())
                .then(temp => {
                    const template = Handlebars.compile(temp);
                    const html = template( {data} );

                    return html
                })
        }); 
}
