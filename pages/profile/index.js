async function getAPI(url) {
    try {
      const data = await fetch(url);
      const dataJson = await data.json();
      return dataJson;
    } catch (error) {
      return error;
    }
  }
  
  function Header(user) {
    let bio
    if (user.bio===null){
      bio = "Usuário sem bio"
    } else{
      bio = user.bio
    }
    return `
          <header class="header flex justify-between items-center">
             
            <div class="header-box-left flex">
            
                <img class="header-avatar" src="${user.avatar_url}" alt="">

                <div class="header-box-left-infos flex flex-col justify-around ">
                    <h3 class="header-name">${user.name}</h3>
                    <h5 class="header-bio">${bio}</h5>
                </div>
             
            </div>
            
            <div class="header-box-right flex">
                <button class="button-header-brand-2"><a href="mailto:"${user.email} target="_blank">Email</a></button>
                <button class="button-header-grey-3" id="button-change-user">Trocar de usuário</button>
            </div>

          </header>
      `;
  }

  function createEventButtonChangeUser(){
    let button = document.querySelector("#button-change-user")
    button.addEventListener("click", (event)=>{
      window.location.href = "../../pages/home/index.html"
    })
  }


  function Repository(user,repos) {
    let description
    if (repos.description===null){
      description = "Repositório sem descrição"
    }else{
      description = repos.description
    }
    
    return `
          <li class="card-repository flex flex-col justify-between">
              <h3 class="card-repos-name">${repos.name}</h3>
              <p class="card-repos-description">${description} </p>

              <div class="card-repository-box-buttons flex">
              <button class="button-card-repos"><a href="${repos.html_url}" target="_blank">Repositório</a></button>
              <button class="button-card-repos"><a href="https://${user.login}.github.io/${repos.name}/" target="_blank">Demo</a></button>
              </div>
          </li>
      `;
  }


  async function Main(user) {
    const baseURL = `https://api.github.com/users/${user}`;
    const userDetails = await getAPI(baseURL);
    const repositories = await getAPI(`${baseURL}/repos`);
    
    //adicionando o nome do user git no title da pagina html
    let titlePage = document.querySelector("#user-name")
    titlePage.innerHTML=`${userDetails.login}(${userDetails.name})`

    document.body.insertAdjacentHTML(
      "beforeend",
      `
          <main class="container">
              ${Header(userDetails)}  
              <div class="loading">Carregando...</div>
              <ul class="list-repositories flex wrap">
              ${repositories
                .map((repository) =>
                  Repository(userDetails,repository)
                )
                .join("")}
              </ul>
          </main>
      `
    );
    createEventButtonChangeUser()
    if (document.querySelector(".list-repositories").children.length > 0) {
      document.querySelector(".loading").remove();
    }
  }
  
  

  window.addEventListener("DOMContentLoaded", (event)=>{
    const urlParams = new URLSearchParams(window.location.search);

    const ParamUser = urlParams.get('user');
    
    Main(ParamUser);
    
  })