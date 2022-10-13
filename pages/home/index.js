let errorMessage = document.querySelector(".label-error-message")
let input = document.querySelector(".section-search-box-userSearch-input")
let buttonUserSearch = document.querySelector("#button-userSearch")
let cLoader = document.querySelector("#c-loader")
let body = document.querySelector("body")
let ul = document.querySelector(".list-recent-researches")

async function getAPI(url) {
    try {
      const data = await fetch(url);
      const dataJson = await data.json();
      return dataJson;
    } catch (error) {
       return error;
    }
  }

async function editUrl(){
    activateSpinnerAnimation()
    const baseURL = `https://api.github.com/users/${input.value}`;
    const userDetails = await getAPI(baseURL);
    //  console.log(userDetails)
    //  console.log(userDetails.message)
     if (userDetails.message){
        
        await setTimeout(()=>{
            disableSpinnerAnimation()
            errorMessage.classList = "label-error-message flex"
            buttonUserSearch.setAttribute("disabled","")
        },3000)
        

     } else{
        
        await setTimeout(()=>{
            // disableSpinnerAnimation()
            errorMessage.classList = "label-error-message"
            addRecentuserLocalstorage(userDetails.login,userDetails.avatar_url)
            window.location.href = `../../pages/profile/index.html?user=${userDetails.login}`
        },3000)
        
        
     }
    
}

function activateSpinnerAnimation(){
    cLoader.classList = "c-loader"
    cLoader.innerHTML= ""
}

function disableSpinnerAnimation(){
    cLoader.classList = ""
    cLoader.innerHTML= "Ver perfil do github"
}

function createEvents(){
    input.addEventListener("keyup", (event)=>{
 
        buttonUserSearch.removeAttribute("disabled")
        errorMessage.classList = "label-error-message"

        if (event.target.value.length === 0){
            buttonUserSearch.setAttribute("disabled","")
        }
    })
    
    buttonUserSearch.addEventListener("click",(event)=>{
        editUrl()
    })
}

function createRecentUser(index,arrTemp){
    let li = document.createElement("li")
    li.classList = "card-recent-user flex flex-col"
    ul.appendChild(li)

    let img = document.createElement("img")
    img.src = arrTemp[index].urlImg
    img.id = `card-recent-user-${index}`
    img.value = arrTemp[index].login
    li.appendChild(img)

    
    let buttonHover = document.createElement("button")
    buttonHover.innerText = "Acessar este perfil"
    li.appendChild(buttonHover)
    buttonHover.value = arrTemp[index].login
    buttonHover.classList = "button-hover-teste"

        img.addEventListener("click",(event)=>{
            window.location.href = `../../pages/profile/index.html?user=${event.target.value}`
        })

        buttonHover.addEventListener("click",(event)=>{
            window.location.href = `../../pages/profile/index.html?user=${event.target.value}`
        })

        li.addEventListener("mouseover", (event)=>{
            buttonHover.classList = "button-hover-teste button-hover-display"
        })

        li.addEventListener("mouseout", (event)=>{
            buttonHover.classList = "button-hover-teste"
        })
}


function createListRecentUsers(){
    
    let arrTemp = JSON.parse(localStorage.recentUsers)
    arrTemp.reverse()
    if (arrTemp.length===0){

    } else if(arrTemp.length<3){
        for(let index=0; index<arrTemp.length; index++){
        
            createRecentUser(index,arrTemp)

        }

    }else{
        for(let index=0; index<=2; index++){
          
           createRecentUser(index,arrTemp)

        }
           
    }
   
}

function addRecentuserLocalstorage(userLogin, userAvatar){
    let arrTemp = JSON.parse(localStorage.recentUsers)
    arrTemp.push({login:userLogin,urlImg:userAvatar})
     localStorage.recentUsers = JSON.stringify(arrTemp)
 }

function startingLocalstorage(){
    let arrTemp = []
    if (localStorage.recentUsers){
        console.log("existe")
    } else{
        console.log("opss")
        localStorage.recentUsers = JSON.stringify(arrTemp)
    }
}

window.addEventListener("DOMContentLoaded", (event)=>{
    startingLocalstorage()
    createListRecentUsers()
    createEvents()
  })

