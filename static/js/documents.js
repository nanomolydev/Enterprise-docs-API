import {AccessLevel, CategoryDoc, StatusDoc} from './dictionaries.js';

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

async function document_download_func(document_id){
    const res = await fetch(`api/documents/${document_id}/download`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        window.location.href = `api/documents/${document_id}/download`
    }
    
}

async function read_doc(event){
    const document_id = event?.target.closest(".document_element").getAttribute('document_id');
    const res = await fetch(`api/documents/${document_id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const readdocname = document.getElementById("readdocname");
        const author = document.getElementById("byauthor-text-read-doc");
        const category = document.getElementById("category-doc-label");
        const department = document.getElementById("department-doc-label");
        const created_at = document.getElementById("created_at-doc-label");
        const updated_at = document.getElementById("updated_at-doc-label");
        const reg_number = document.getElementById("reg_number-doc-label");
        const status_doc_label = document.getElementById("status-doc-label");
        const storage_deadline =  document.getElementById("storage_deadline-doc-label");
        const access_level = document.getElementById("access_level-doc-label");
        const file_original_name = document.getElementById("file_original_name-doc");

        const statusbar = document.getElementById("read_doc_statusbar");
        statusbar.innerHTML = "";
        let status = `
            <div class="accesslevel-container ${AccessLevel[data?.access_level]?.className}">
                <p class="delete-standart-rules">${AccessLevel[data?.access_level]?.label}</p>
            </div>
            <div class="status-container ${StatusDoc[data?.status]?.className}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${StatusDoc[data?.status]?.label}">
                <i class="bi ${StatusDoc[data?.status]?.icon}"></i>
            </div>
        `
        statusbar.insertAdjacentHTML('beforeend', status);
        
        readdocname.textContent = data?.title;
        category.textContent = CategoryDoc[data?.category];
        department.textContent = data?.department || '-';
        created_at.textContent = formatDate(data?.created_at);
        updated_at.textContent = formatDate(data?.updated_at);
        reg_number.textContent = data?.reg_number;
        status_doc_label.textContent = StatusDoc[data?.status]?.label;
        storage_deadline.textContent = formatDate(data?.storage_deadline);
        access_level.textContent = AccessLevel[data?.access_level]?.full_label || AccessLevel[data?.access_level]?.label;
        file_original_name.textContent = data?.file_original_name;
        author.textContent = `Автор: ${data?.author?.full_name}`;

        const current_user_data = await get_info_user();
        

        const container_add_doc = document.getElementById("container_add_doc");
        container_add_doc.setAttribute("data-document-id", document_id);
        
        const container_button_canvas = document.getElementById("container_button_canvas");
        container_button_canvas.innerHTML = "";
        if(current_user_data?.role?.download_doc){
            let download_button = `
                <button type="button" class="btn btn-primary btn-doc-read btn-doc-download" id="doc-download">
                    <i class="bi bi-download"></i>
                    <p class="delete-standart-rules">Скачать</p>
                </button>
            `
            container_button_canvas.insertAdjacentHTML("beforeend", download_button);
        }
        if(current_user_data?.role?.edit_anydoc==false && current_user_data?.role?.edit_selfdoc){
            if(data?.author_id==current_user_data?.id){
                
                let edit_button = `
                    <button type="button" class="btn btn-primary btn-doc-read btn-doc-edit" id="doc-edit">
                        <i class="bi bi-pencil-square"></i>
                        <p class="delete-standart-rules">Редактировать</p>
                    </button>
                `
                container_button_canvas.insertAdjacentHTML("beforeend", edit_button);
            }
        }
        if(current_user_data?.role?.del_anydoc==false && current_user_data?.role?.del_selfdoc){
            if(data?.author_id==current_user_data?.id){
                let delete_button = `
                    <button type="button" class="btn btn-primary btn-doc-read btn-doc-delete" id="doc-delete">
                        <i class="bi bi-trash"></i>
                        <p class="delete-standart-rules">Удалить</p>
                    </button>
                `
                container_button_canvas.insertAdjacentHTML("beforeend", delete_button);
            }
        }
        const doc_download = document.getElementById("doc-download");
        const doc_edit = document.getElementById("doc-edit");
        const doc_delete = document.getElementById("doc-delete");
        if(doc_download){
            doc_download.addEventListener('click', async function(){
                await document_download_func(document_id);
            })
        }

        if(doc_delete){
            doc_delete.addEventListener('click', async function(){
                const container_are_you_sure = new bootstrap.Modal("#container_are_you_sure");
                container_are_you_sure.show();
                
            })
        }
        
        if(doc_edit){
            doc_edit.addEventListener("click", function (){
                const exampleModalLabel = document.getElementById("exampleModalLabel");
                exampleModalLabel.textContent = 'Редактирование документа';
                container_add_doc.setAttribute("data-type-action", 'edit');
                
                const edit_doc_modal = new bootstrap.Modal('#container_add_doc')
                edit_doc_modal.show();
            })
        }
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight');
        bsOffcanvas.show()
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

function create_doc(data){
    const alldoc_container = document.getElementById("maincontent");
    alldoc_container.innerHTML = "";
    for(var i=0;i<data.length;i++){
        let doc = `
        <li class="list-group-item list-group-item-action list-group-item-custom document_element" document_id="${data[i]?.id}">
            <div id="namedocandicon" class="nameandiconobject">
                <i class="bi bi-file-earmark-word-fill" style="font-size: 1.5rem;"></i>
                <div class="infodoc">
                    <p class="delete-standart-rules">${data[i]?.title}</p>
                    <p class="byauthor-text">Автор: ${data[i]?.author?.full_name}</p>
                </div>
            </div>
            <div class="statusbar ">
                <div class="accesslevel-container ${AccessLevel[data[i]?.access_level]?.className}">
                    <p class="delete-standart-rules">${AccessLevel[data[i]?.access_level]?.label}</p>
                </div>
                <div class="status-container ${StatusDoc[data[i]?.status]?.className}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${StatusDoc[data[i]?.status]?.label}">
                    <i class="bi ${StatusDoc[data[i]?.status]?.icon}"></i>
                </div>
            </div>
        </li>
        `
        alldoc_container.insertAdjacentHTML('beforeend',doc);
        const read_doc_btn = alldoc_container.lastElementChild;
        read_doc_btn.addEventListener("click", function (event){
            read_doc(event);
        })
    }
}

async function get_info_user(){
    const res = await fetch("/api/get_myself",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        return data;
    }
}


async function insert_info_user(){
    const data = await get_info_user();
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
    
    
    
    

    const rightside = document.getElementById("rightside");
    const searchtools = document.getElementById("searchtools");
    const container_button_canvas = document.getElementById("container_button_canvas");
    container_button_canvas.innerHTML = "";
    if(data?.role?.download_doc){
        let download_button = `
            <button type="button" class="btn btn-primary btn-doc-read btn-doc-download" id="doc-download">
                <i class="bi bi-download"></i>
                <p class="delete-standart-rules">Скачать</p>
            </button>
        `
        container_button_canvas.insertAdjacentHTML("beforeend", download_button);
    }
    if(data?.role?.edit_anydoc){

        let edit_button = `
            <button type="button" class="btn btn-primary btn-doc-read btn-doc-edit" id="doc-edit">
                <i class="bi bi-pencil-square"></i>
                <p class="delete-standart-rules">Редактировать</p>
            </button>
        `
        container_button_canvas.insertAdjacentHTML("beforeend", edit_button);
    }
    if(data?.role?.del_anydoc){
        let delete_button = `
            <button type="button" class="btn btn-primary btn-doc-read btn-doc-delete" id="doc-delete">
                <i class="bi bi-trash"></i>
                <p class="delete-standart-rules">Удалить</p>
            </button>
        `
        container_button_canvas.insertAdjacentHTML("beforeend", delete_button);
    }
    if(data?.role?.create_doc){
        let create_doc_btn = `
            <a href="#" id="show_add_modal" class="btn btn-primary-search" data-bs-toggle="modal" data-bs-target="#container_add_doc">
                <i class="bi bi-plus"></i>
                Добавить
            </a>
        `
        searchtools.insertAdjacentHTML('beforeend', create_doc_btn);
    }
    if (data?.role?.user_manage){
        let manage_option = `
            <a href="#"\ class="btn btn-primary-custom  me-2" id="user_page_btn">
                <i class="bi bi-person-video2" id="iconnavbtn"></i>
                Пользователи
            </a>
            <a href="#" class="btn btn-primary-custom  me-2" id="logs_page_btn">
                <i class="bi bi-clock-history" id="iconnavbtn"></i>
                Журнал
            </a>
        `
        rightside.insertAdjacentHTML('afterbegin', manage_option);
    }
}


async function getalldoc(){
    const res = await fetch("/api/documents",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        create_doc(data);
    }
}
async function delete_doc(){
    const container_add_doc = document.getElementById("container_add_doc");
    const res = await fetch(`api/documents/${container_add_doc.dataset.documentId}`,{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        window.location.reload();
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

function load_add_doc_select(){;
    const select_status_container = document.getElementById("add_doc_status");
    const select_access_level_container = document.getElementById("add_doc_access_level");
    const select_category_container = document.getElementById("add_doc_category");
    for(var key in StatusDoc){
        let select = `<option value="${key}">${StatusDoc[key]?.label}</option>`;
        select_status_container.insertAdjacentHTML("beforeend",select);
    }
    for(var key in AccessLevel){
        let select = `<option value="${key}">${AccessLevel[key]?.full_label || AccessLevel[key]?.label}</option>`;
        select_access_level_container.insertAdjacentHTML("beforeend",select);
    }
    for(var key in CategoryDoc){
        let select = `<option value="${key}">${CategoryDoc[key]}</option>`;
        select_category_container.insertAdjacentHTML("beforeend",select);
    }
}

async function add_edit_doc(){
    const container_add_doc = document.getElementById("container_add_doc");

    const select_status_container = document.getElementById("add_doc_status");
    const select_access_level_container = document.getElementById("add_doc_access_level");
    const select_category_container = document.getElementById("add_doc_category");
    const form_file = document.getElementById("formFile");
    const name_doc = document.getElementById("inputNameDoc");
    const depart_doc = document.getElementById("inputDepartDoc");
    const reg_number = document.getElementById("inputRegNumber");
    const inputExpiredDate = document.getElementById("inputExpiredDate");
    const formData = new FormData();
    name_doc.value!="" && formData.append("title", name_doc.value)
    reg_number.value !="" && formData.append("reg_number", reg_number.value);
    depart_doc.value !="" && formData.append("department", depart_doc.value);
    select_category_container.value !="" && formData.append("category", select_category_container.value);
    select_access_level_container.value !="" && formData.append("access_level", select_access_level_container.value);
    select_status_container.value !="" && formData.append("status", select_status_container.value);
    if(inputExpiredDate.value){
        formData.append("storage_deadline", inputExpiredDate.value);
    }
    if(form_file?.files[0]){
        formData.append("file", form_file?.files[0]);
    }
    console.log(formData);
    const typeaction = container_add_doc.dataset.typeAction;
    const document_id = container_add_doc.dataset.documentId;
    const res = await fetch(`/api/documents${typeaction=='edit' ? '/'+document_id : ''}`,{
        method: typeaction=='edit' ? 'PATCH' : 'POST',
        body: formData
    });
    if(await validate_res(res)){
        window.location.reload();
    }
    
}

function get_filter_params(){
    const search_name = document.getElementById("search_name");
    const search_category = document.getElementById("search_category");
    const search_access_level = document.getElementById("search_access_level");
    const search_status = document.getElementById("search_status");
    
    const params = new URLSearchParams();
    search_name.value!="" && params.append("name", search_name.value);
    search_category.value!="" && params.append("category", search_category.value);
    search_access_level.value!="" && params.append("access_level", search_access_level.value)
    search_status.value!="" && params.append("status", search_status.value)
    return params
}

async function load_limit(){
    const params = get_filter_params();
    console.log(params);
    const count_doc = parseInt(document.getElementById("count_doc").value);
    var res = await fetch(`api/documents/count?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        const all_doc_count = data?.count;
        console.log(all_doc_count)
        const doc_page_bar = document.getElementById("doc_page_bar");
        var count_page = Math.floor(data?.count/count_doc);
        var visual_page = Math.floor(data?.count/count_doc);
        var current_page = parseInt(doc_page_bar.dataset.currentPage) || 1;
        const counter_page = document.getElementById("counter_page");
        const limit = count_doc;
        var current_offset = parseInt(doc_page_bar.dataset.currentOffset) || 0;

        if(data?.count%count_doc!=0){
            visual_page = visual_page+1;
        }
        counter_page.textContent=`${current_page} - ${visual_page}`;
        
        params.append("offset", current_offset);
        params.append("limit", limit);

        res = await fetch(`api/documents?${params.toString()}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        
        if(await validate_res(res)){
            console.log("успешно");
            const data = await res.json();
            await create_doc(data);
            

            const back_page_btn = document.getElementById("back_page_btn");
            back_page_btn.disabled = true;

            if(current_page==visual_page){
                const next_page_btn = document.getElementById("next_page_btn");
                next_page_btn.disabled = true;
            }
            
            doc_page_bar.setAttribute("data-current-page",  current_page);
            doc_page_bar.setAttribute("data-lastpage-offset", (count_doc*count_page));
            doc_page_bar.setAttribute("data-current-offset", current_offset);
            doc_page_bar.setAttribute("data-visual-page", visual_page);
        }
        
    }
}


async function next_page(){
    const params = get_filter_params();
    const count_doc = parseInt(document.getElementById("count_doc").value);
    const counter_page = document.getElementById("counter_page");
    var doc_page_bar = document.getElementById("doc_page_bar");
    var current_offset = parseInt(doc_page_bar.dataset.currentOffset) || 0;
    var visual_page = parseInt(doc_page_bar.dataset.visualPage) || 1;
    var current_page = parseInt(doc_page_bar.dataset.currentPage) || 1;
    const lastpage_offset = doc_page_bar.dataset.lastpageOffset || 0;
    const limit = count_doc;
    current_page = current_page+1;
    current_offset = current_offset+limit;
    console.log(limit);
    console.log(current_offset);
    params.append("offset", current_offset);
    params.append("limit", limit);

    const res = await fetch(`api/documents?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        console.log("успешно");
        const data = await res.json();
        await create_doc(data);
        
        counter_page.textContent=`${current_page} - ${visual_page}`;
        const back_page_btn = document.getElementById("back_page_btn");
        back_page_btn.disabled = false;
        
        if(current_page==visual_page){
            const next_page_btn = document.getElementById("next_page_btn");
            next_page_btn.disabled = true;
        }
        
        doc_page_bar.setAttribute("data-current-page", current_page);
        doc_page_bar.setAttribute("data-current-offset", current_offset);
        doc_page_bar.setAttribute("data-visual-page", visual_page);
    }
}
async function back_page(){
    const params = get_filter_params();
    const count_doc = parseInt(document.getElementById("count_doc").value);
    const counter_page = document.getElementById("counter_page");
    const doc_page_bar = document.getElementById("doc_page_bar");
    var current_offset = parseInt(doc_page_bar.dataset.currentOffset) || 0;
    var visual_page = parseInt(doc_page_bar.dataset.visualPage) || 1;
    var current_page = parseInt(doc_page_bar.dataset.currentPage) || 1;
    const lastpage_offset = doc_page_bar.dataset.lastpageOffset || 0;
    const limit = count_doc;
    current_page = current_page-1;
    current_offset = current_offset-limit;
    console.log(limit);
    console.log(current_offset);
    params.append("offset", current_offset);
    params.append("limit", limit);

    const res = await fetch(`api/documents?${params.toString()}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        console.log("успешно");
        const data = await res.json();
        await create_doc(data);
        
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

        
        doc_page_bar.setAttribute("data-current-page", current_page);
        doc_page_bar.setAttribute("data-current-offset", current_offset);
        doc_page_bar.setAttribute("data-visual-page", visual_page);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await insert_info_user();
    await getalldoc();
    

    const backtologin = document.getElementById("backtologin");
    const add_doc_btn = document.getElementById("add_doc_btn");
    const user_page_btn = document.getElementById("user_page_btn");
    const logs_page_btn = document.getElementById("logs_page_btn");
    const count_doc = document.getElementById("count_doc");
    const next_page_btn = document.getElementById("next_page_btn");
    const back_page_btn = document.getElementById("back_page_btn");
    const search_name = document.getElementById("search_name");
    const search_category = document.getElementById("search_category");
    const search_access_level = document.getElementById("search_access_level");
    const search_status = document.getElementById("search_status");
    const delete_doc_btn = document.getElementById("delete_doc_btn");
    const show_add_modal = document.getElementById("show_add_modal");
    await load_limit();
    if(show_add_modal){
        show_add_modal.addEventListener("click", async function(){
            const exampleModalLabel = document.getElementById("exampleModalLabel");
                exampleModalLabel.textContent = 'Добавление документа';
            const container_add_doc = document.getElementById("container_add_doc");
            container_add_doc.setAttribute("data-type-action", 'create');
        })
    }
    if(user_page_btn){
        user_page_btn.addEventListener("click", async function(){
            window.location.href = '/users'
        })
    }
    if(logs_page_btn){
        logs_page_btn.addEventListener("click", async function(){
            window.location.href = '/logs'
        })
    }
    delete_doc_btn.addEventListener("click", async function(){
        event.preventDefault();
        await delete_doc();
    })
    search_status.addEventListener("change", async function(){
        await load_limit()
    })
    search_access_level.addEventListener("change", async function(){
        await load_limit()
    })
    search_category.addEventListener("change", async function(){
        await load_limit()
    })
    search_name.addEventListener("change", async function(){
        await load_limit();
    })
    next_page_btn.addEventListener('click', async function(){
        await next_page();
    })
    back_page_btn.addEventListener('click', async function(){
        await back_page();
    })
    count_doc.addEventListener("change", async function(){
        await load_limit();
    })
    add_doc_btn.addEventListener("click", async function(){
        event.preventDefault();
        add_edit_doc();
    })
    backtologin.addEventListener('click', async function(){
        console.log("sdf");
        await logout_user();
    })
    load_add_doc_select();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})