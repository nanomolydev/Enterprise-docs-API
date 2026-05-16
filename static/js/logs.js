import { LogsInfo } from "./dictionaries.js";




async function validate_res(res){
    if(res.status==401){
        window.location.href = '/login';
        return false
    }
    else if (res.status==200){
        return true
    }
    else{
        create_toast(await res.text());
        return false
    }
}


async function get_info_user(){
    const res = await fetch("/api/get_myself",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const first_word_avatar = document.getElementById("first_word_avatar");
        const last_word_avatar = document.getElementById("last_word_avatar");
        const avatar_word = data?.full_name.split(" ");
        const full_name_dropdown = document.getElementById("full_name_dropdown");
        const role_dropdown = document.getElementById("role_dropdown");
        full_name_dropdown.textContent = data?.full_name;
        role_dropdown.textContent = `Роль: ${data?.role?.title}`;
        if(avatar_word.length>=2){
            first_word_avatar.textContent = avatar_word[0][0];
            last_word_avatar.textContent = avatar_word[avatar_word.length-1][0]

        }
        else if(avatar_word.length==1){
            first_word_avatar.textContent = avatar_word[0][0];
        }
        else {
            first_word_avatar.textContent = 'T';
        }
        
        
        
        

        const rightside = document.getElementById("rightside")
        if (data?.role?.user_manage){
            let manage_option = `
                <a href="#" class="btn btn-primary-custom  me-2 " id="user_page_btn">
                    <i class="bi bi-person-video2" id="iconnavbtn"></i>
                    Пользователи
                </a>
                
                <div id='select_page'>
                    <a href="#" class="btn btn-primary-custom  me-2 active">
                        <i class="bi bi-clock-history" id="iconnavbtn"></i>
                        Журнал
                    </a>
                    <hr id="selected_page">
                </div>
            `
            rightside.insertAdjacentHTML('afterbegin', manage_option);
        }
    }
}

async function get_user(id){
    const res = await fetch(`/api/users/${id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        return data
    }
}


function create_log(data){
    data.reverse();
    const alllog_container = document.getElementById("maincontent");
    for(var i=0;i<data.length;i++){
        let log = `
        <li class="list-group-item list-group-item-action list-group-item-custom log_element" data-log-id="${data[i]?.id}">
            <div id="namedocandicon">
                <i class="bi ${data[i]?.is_complete ? LogsInfo[data[i]?.action].icon : 'bi-x-lg'}" style="font-size: 1.5rem;"></i>
                <div class="infodoc">
                    <p class="delete-standart-rules">${LogsInfo[data[i]?.action].label}</p>
                    <p class="byauthor-text">Сделал: ${data[i]?.user?.full_name}</p>
                </div>
            </div>
        </li>
        `
        alllog_container.insertAdjacentHTML('beforeend',log);
        
    }
}

async function getalllogs(){
    const res = await fetch("/api/logs",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        create_log(data);
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    await get_info_user();
    await getalllogs();
    const user_page_btn = document.getElementById("user_page_btn");
    const doc_select_page = document.getElementById("doc_select_page");
    if(user_page_btn){
        user_page_btn.addEventListener("click", async function(){
            window.location.href = '/users'
        })
    }
    if(doc_select_page){
        console.log("sdfsd");
        doc_select_page.addEventListener("click", function(){
            window.location.href = '/documents'
        })
    }
})