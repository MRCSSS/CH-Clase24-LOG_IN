(async () => {
    await renderLogin().then(html => {
        document.getElementById('login').innerHTML = html;
    })    
})()


/* --------------------------- HANDLEBARS ---------------------------*/
async function renderLogin () {
    return fetch('templates/login.hbs')
        .then(resp => resp.text())
        .then(temp => {return temp})
}


// function login() {
//     const inputTitle = document.getElementById('title');
//     const inputPrice = document.getElementById('price');
//     const inputThumbnail = document.getElementById('thumbnail');

//     const prod = {
//         title: inputTitle.value,
//         price: inputPrice.value,
//         thumbnail: inputThumbnail.value
//     }

//     socket.emit('client-prods', prod)
// }