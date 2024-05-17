const button = document.querySelector(".btn");
const nom = document.querySelector("#nom");
const prenom = document.querySelector("#prenom")
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confpass = document.querySelector("#passwordconf");
const genre = document.querySelector("#genre");
const pays = document.querySelector("#pays")
const adresse = document.querySelector("#addresse")


button.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
        if (nom.value === '' || prenom.value === '' || email.value === '' || password.value === '' || confpass.value === '' || genre.value === '' || pays.value === '' || adresse.value === ''){
            console.log('flop !');
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
})