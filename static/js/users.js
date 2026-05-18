import { RoleInfo } from "./dictionaries.js";


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

function create_toast(toast_text){
    var toastdiv = document.getElementById("toastdiv");
    let toast = `
    <div class="toast  align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
        <div class="d-flex">
            <div class="toast-body">
            ${toast_text}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    `;
    
    toastdiv.insertAdjacentHTML('beforeend', toast);
    const newToast = toastdiv.lastElementChild;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(newToast)
    toastBootstrap.show();
    newToast.addEventListener('hidden.bs.toast', ()=>{
        newToast.remove();
    });
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
                <div id='select_page'>
                    <a href="#" class="btn btn-primary-custom  me-2 active" id="user_page_btn">
                        <i class="bi bi-person-video2" id="iconnavbtn"></i>
                        Пользователи
                    </a>
                    <hr id="selected_page">
                </div>
                
                <a href="#" class="btn btn-primary-custom  me-2" id="log_select_page">
                    <i class="bi bi-clock-history" id="iconnavbtn"></i>
                    Журнал
                </a>
            `
            rightside.insertAdjacentHTML('afterbegin', manage_option);
        }
    }
}

async function open_user(event){
    const user_id = event?.target.closest(".user_element").dataset.userId;
    const res = await fetch(`api/users/${user_id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const open_full_name = document.getElementById("open_full_name");
        const open_user_role = document.getElementById("open_user_role");
        const department_user_label = document.getElementById("department-user-label");
        const is_active_label = document.getElementById("is_active_label");


        open_user_role.innerHTML = "";
        let status = `
            <div class="accesslevel-container ${RoleInfo[data?.role?.title].className}">
                <p class="delete-standart-rules">${data?.role?.title}</p>
                
            </div>
        `
        open_user_role.insertAdjacentHTML('beforeend', status);
        
        open_full_name.textContent = data?.full_name;
        department_user_label.textContent = data?.department || '-';
        is_active_label.textContent = data?.is_active ? "Активный" : "Отключен"

        const user_edit = document.getElementById("user-edit");

        user_edit.addEventListener("click", function (){
            console.log("edit_user");
            // container_add_doc.setAttribute("data-type-action", 'edit');
            container_edit_user.setAttribute("data-user-id", user_id);
        })

        const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
        bsOffcanvas.show()
    }

}

function create_user(data){
    data.reverse();
    const alluser_container = document.getElementById("maincontent");
    for(var i=0;i<data.length;i++){
        let user = `
        <li class="list-group-item list-group-item-action list-group-item-custom user_element" data-user-id="${data[i]?.id}">
            <div id="namedocandicon" class="nameandiconobject">
                <i class="bi bi-person-fill" style="font-size: 1.5rem;"></i>
                <div class="infodoc">
                    <p class="delete-standart-rules">${data[i]?.full_name}</p>
                </div>
            </div>
            <div class="statusbar statusbar-users ">
                <div class="accesslevel-container ${RoleInfo[data[i]?.role?.title].className}">
                    <p class="delete-standart-rules">${data[i]?.role?.title}</p>
                    
                </div>
                <div class="circle" style="width: 10px; height: 10px; background-color: ${data[i]?.is_active ? "green" : "red"}" data-bs-toggle="dropdown" ></div>
            </div>
        </li>
        `
        alluser_container.insertAdjacentHTML('beforeend',user);
        const open_user_btn = alluser_container.lastElementChild;
        open_user_btn.addEventListener("click", function (event){
            open_user(event);
        })
    }
}

async function getallusers(){
    const res = await fetch("/api/users",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        create_user(data);
    }
}

async function edit_user(){
    const container_edit_user = document.getElementById("container_edit_user");
    const user_id = container_edit_user.dataset.userId;
    const edit_user_role_select = document.getElementById("edit_user_role_select");
    const edit_user_status = document.getElementById("edit_user_status");
    const inputNameUser = document.getElementById("inputNameUser");
    const inputDepartUser = document.getElementById("inputDepartUser");
    var result_json = {};
    if(inputNameUser.value!=""){
        result_json['full_name'] = inputNameUser.value;
    }
    if(inputDepartUser.value!=""){
        result_json['department'] = inputDepartUser.value;
    }
    if(edit_user_role_select.value!=""){
        result_json['role_id'] = edit_user_role_select.value;
    }
    if(edit_user_status.value!=""){
        result_json['is_active'] = edit_user_status.value=='1' ? true : false;
    }
    const res = await fetch(`/api/users/${user_id}`,{
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(result_json)
    });
    if(await validate_res(res)){
        window.location.reload();
    }
}

async function add_user(){
    const add_user_role_select = document.getElementById("add_user_role_select");
    const inputAddFullNameUser = document.getElementById("inputAddFullNameUser");
    const inputAddLoginUser = document.getElementById("inputAddLoginUser");
    const inputAddPasswordUser = document.getElementById("inputAddPasswordUser");
    const inputAddDepartUser = document.getElementById("inputAddDepartUser");
    var result_json = {
        full_name: inputAddFullNameUser.value,
        login: inputAddLoginUser.value,
        password: inputAddPasswordUser.value,
        role_id: add_user_role_select.value
    };
    if(inputAddDepartUser.value!=""){
        result_json['department'] = inputAddDepartUser.value;
    }
    const res = await fetch("/api/users",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(result_json)
    });
    if(await validate_res(res)){
        window.location.reload();
    }
}

function add_edit_role_select(){
    const edit_user_role_select = document.getElementById("edit_user_role_select");
    const add_user_role_select = document.getElementById("add_user_role_select");
    for(var key in RoleInfo){
        let select =  `<option value="${RoleInfo[key]?.id}">${key}</option>`;
        edit_user_role_select.insertAdjacentHTML('beforeend',select);
        add_user_role_select.insertAdjacentHTML('beforeend',select);
    }
}
async function logout_user(){
    const res = await fetch("/api/logout",{
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        window.location .href = '/login'
    }
}

document.addEventListener("DOMContentLoaded", async function(){

    await get_info_user();
    await getallusers();

    const edit_user_btn = document.getElementById("edit_user_btn");
    const add_user_btn = document.getElementById("add_user_btn");
    const log_select_page = document.getElementById("log_select_page");
    const doc_select_page = document.getElementById("doc_select_page");
    const backtologin = document.getElementById("backtologin");
    if(log_select_page){
        log_select_page.addEventListener("click", function(){
            window.location.href = '/logs'
        })
    }
    if(doc_select_page){
        console.log("sdfsd");
        doc_select_page.addEventListener("click", function(){
            window.location.href = '/documents'
        })
    }
    edit_user_btn.addEventListener("click", async function(){
        event.preventDefault();
        edit_user();
    })
    backtologin.addEventListener('click', async function(){
        await logout_user();
    })
    add_user_btn.addEventListener("click", async function(event){
        event.preventDefault();
        add_user();
    })
    add_edit_role_select();
})
