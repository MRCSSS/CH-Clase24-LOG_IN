(async () => {
    await renderLogin().then(html => {
        document.getElementById('root').innerHTML = html;
        setTimeout( function() { window.location.href = "/"; }, 2000 );
    })    
})()


/* --------------------------- HANDLEBARS ---------------------------*/
async function renderLogin () {
    return fetch('templates/logout.hbs')
        .then(resp => resp.text())
        .then(temp => {return temp})
}

