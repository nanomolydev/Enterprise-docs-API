import { LogsInfo } from "./dictionaries.js";

function formatDate(value) {
    if (!value) {
        return "-";
    }
    const date = new Date(value)

    return date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

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

async function read_log(){
    const log_id = event?.target.closest(".log_element").dataset.logId;
    const res = await fetch(`api/logs/${log_id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const action_log = document.getElementById("action_log");
        const name_doc = document.getElementById("name_doc");
        const byauthor = document.getElementById("byauthor-text-read-log");
        const reg_number_doc = document.getElementById("reg_number_doc");
        const created_at_loglabel = document.getElementById("created_at-log-label");
        name_doc.textContent=data?.document_title || "-";
        action_log.textContent=LogsInfo[data?.action]?.label;
        reg_number_doc.textContent=data?.document_reg_number  || "-";
        byauthor.textContent = `Сделал: ${data?.user?.full_name}`
        created_at_loglabel.textContent=formatDate(data?.timestamp)
        const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
        bsOffcanvas.show()
    }
}

function create_log(data){
    const alllog_container = document.getElementById("maincontent");
    alllog_container.innerHTML = "";
    for(var i=0;i<data.length;i++){
        let log = `
        <div class='container_log'>
            <li class="list-group-item list-group-item-action list-group-item-custom log_element" data-log-id="${data[i]?.id}">
                <div id="namelogandicon" class="nameandiconobject">
                    
                    <div class="circle_log ${data[i]?.is_complete ? LogsInfo[data[i]?.action]?.className : 'circle_red'}">
                        <i class="bi ${data[i]?.is_complete ? LogsInfo[data[i]?.action].icon : 'bi-x-lg'}" style="font-size: 1.5rem;"></i>
                    </div>
                    <div class="infodoc">
                        <p class="delete-standart-rules">${LogsInfo[data[i]?.action].label}</p>
                        <p class="byauthor-text">Сделал: ${data[i]?.user?.full_name}</p>
                    </div>
                </div>
                <div class="statusbar ">
                    <div class="accesslevel-container ">
                        <p class="delete-standart-rules" id="log_timestamp">${formatDate(data[i]?.timestamp)}</p>
                    </div>
                </div>
            </li>
        </div>
        `
        alllog_container.insertAdjacentHTML('beforeend',log);
        const read_log_btn = alllog_container.lastElementChild;
        read_log_btn.addEventListener("click", function (event){
            read_log(event);
        })
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
async function load_filter_selected(){
    const search_action = document.getElementById("search_action")
    const search_users = document.getElementById("search_users")
    for(var key in LogsInfo){
        let select = `
            <option value="${key}">${LogsInfo[key]?.label}</option>
        `
        search_action.insertAdjacentHTML("beforeend", select)
    }
    const res = await fetch("/api/users",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        for(var key in data){
            let select = `
                <option value="${data[key]?.id}">${data[key]?.full_name}</option>
            `
            search_users.insertAdjacentHTML("beforeend", select)
        }
    }
}


function get_filter_params(){
    const search_action = document.getElementById("search_action");
    const search_users = document.getElementById("search_users");
    const inputStartTimestamp = document.getElementById("inputStartTimestamp");
    const inputEndTimestamp = document.getElementById("inputEndTimestamp");
    
    const params = new URLSearchParams();
    search_action.value!="" && params.append("action", search_action.value);
    search_users.value!="" && params.append("user_id", search_users.value);
    inputStartTimestamp.value!="" && params.append("start_timestamp", inputStartTimestamp.value)
    inputEndTimestamp.value!="" && params.append("end_timestamp", inputEndTimestamp.value)
    return params
}

async function load_limit(){
    const params = get_filter_params();
    console.log(params);
    const count_log = parseInt(document.getElementById("count_log").value);
    var res = await fetch(`api/logs/count?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        const all_doc_count = data?.count;
        console.log(all_doc_count)
        const log_page_bar = document.getElementById("log_page_bar");
        var count_page = Math.floor(data?.count/count_log);
        var visual_page = Math.floor(data?.count/count_log);
        var current_page = parseInt(log_page_bar.dataset.currentPage) || 1;
        const counter_page = document.getElementById("counter_page");
        const limit = count_log;
        var current_offset = parseInt(log_page_bar.dataset.currentOffset) || 0;

        if(data?.count%count_log!=0){
            visual_page = visual_page+1;
        }
        counter_page.textContent=`${current_page} - ${visual_page}`;
        
        params.append("offset", current_offset);
        params.append("limit", limit);

        res = await fetch(`api/logs?${params.toString()}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        
        if(await validate_res(res)){
            console.log("успешно");
            const data = await res.json();
            await create_log(data);
            

            const back_page_btn = document.getElementById("back_page_btn");
            back_page_btn.disabled = true;


            if(current_page==visual_page){
                const next_page_btn = document.getElementById("next_page_btn");
                next_page_btn.disabled = true;
            }
            
            log_page_bar.setAttribute("data-current-page",  current_page);
            log_page_bar.setAttribute("data-lastpage-offset", (count_log*count_page));
            log_page_bar.setAttribute("data-current-offset", current_offset);
            log_page_bar.setAttribute("data-visual-page", visual_page);
        }
        
    }
}

async function next_page(){
    const params = get_filter_params();
    const count_log = parseInt(document.getElementById("count_log").value);
    const counter_page = document.getElementById("counter_page");
    var log_page_bar = document.getElementById("log_page_bar");
    var current_offset = parseInt(log_page_bar.dataset.currentOffset) || 0;
    var visual_page = parseInt(log_page_bar.dataset.visualPage) || 1;
    var current_page = parseInt(log_page_bar.dataset.currentPage) || 1;
    const lastpage_offset = log_page_bar.dataset.lastpageOffset || 0;
    const limit = count_log;
    current_page = current_page+1;
    current_offset = current_offset+limit;

    params.append("offset", current_offset);
    params.append("limit", limit);

    const res = await fetch(`api/logs?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        console.log("успешно");
        const data = await res.json();
        await create_log(data);
        
        counter_page.textContent=`${current_page} - ${visual_page}`;
        const back_page_btn = document.getElementById("back_page_btn");
        back_page_btn.disabled = false;
        
        if(current_page==visual_page){
            const next_page_btn = document.getElementById("next_page_btn");
            next_page_btn.disabled = true;
        }
        
        log_page_bar.setAttribute("data-current-page", current_page);
        log_page_bar.setAttribute("data-current-offset", current_offset);
        log_page_bar.setAttribute("data-visual-page", visual_page);
    }
}


async function back_page(){
    const params = get_filter_params();
    const count_log = parseInt(document.getElementById("count_log").value);
    const counter_page = document.getElementById("counter_page");
    const log_page_bar = document.getElementById("log_page_bar");
    var current_offset = parseInt(log_page_bar.dataset.currentOffset) || 0;
    var visual_page = parseInt(log_page_bar.dataset.visualPage) || 1;
    var current_page = parseInt(log_page_bar.dataset.currentPage) || 1;
    const lastpage_offset = log_page_bar.dataset.lastpageOffset || 0;
    const limit = count_log;
    current_page = current_page-1;
    current_offset = current_offset-limit;

    params.append("offset", current_offset);
    params.append("limit", limit);

    const res = await fetch(`api/logs?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        console.log("успешно");
        const data = await res.json();
        await create_log(data);
        
        counter_page.textContent=`${current_page} - ${visual_page}`;
        const back_page_btn = document.getElementById("back_page_btn");
        back_page_btn.disabled = false;
        

        if(current_page==1){
            const back_page_btn = document.getElementById("back_page_btn");
            back_page_btn.disabled = true;
        }
        if(current_page<visual_page){
            const next_page_btn = document.getElementById("next_page_btn");
            next_page_btn.disabled = false;
        }

        
        log_page_bar.setAttribute("data-current-page", current_page);
        log_page_bar.setAttribute("data-current-offset", current_offset);
        log_page_bar.setAttribute("data-visual-page", visual_page);
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
    await load_filter_selected();
    await load_limit(false);
    const user_page_btn = document.getElementById("user_page_btn");
    const count_log = document.getElementById("count_log");
    const doc_select_page = document.getElementById("doc_select_page");
    const next_page_btn = document.getElementById("next_page_btn");
    const back_page_btn = document.getElementById("back_page_btn");
    const search_action = document.getElementById("search_action");
    const search_users = document.getElementById("search_users");
    const inputStartTimestamp = document.getElementById("inputStartTimestamp");
    const inputEndTimestamp = document.getElementById("inputEndTimestamp");
    const delete_all_logs = document.getElementById("delete_all_logs");
    const trash_logs = document.getElementById("trash_logs");
    const delete_select_page = document.getElementById("delete_select_page");
    const select_delete = document.getElementById("select_delete");
    const sure_delete = document.getElementById("sure_delete");
    const trash_dropdown = document.getElementById("trash_dropdown");
    const backtologin = document.getElementById("backtologin");
    inputEndTimestamp.addEventListener('change', async function(){
        await load_limit();
    })
    inputStartTimestamp.addEventListener('change', async function(){
        await load_limit();
    })
    search_users.addEventListener('change', async function(){
        await load_limit();
    })
    search_action.addEventListener('change', async function(){
        await load_limit();
    })
    next_page_btn.addEventListener('click', async function(){
        await next_page();
    })
    back_page_btn.addEventListener('click', async function(){
        await back_page();
    })
    count_log.addEventListener("change", async function(){
        await load_limit(false);
    })
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
    backtologin.addEventListener('click', async function(){
        await logout_user();
    })
})