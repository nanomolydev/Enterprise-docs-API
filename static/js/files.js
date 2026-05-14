import {AccessLevel, CategoryDoc, StatusDoc} from './dictionaries.js';

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString("ru-RU");
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


async function read_doc(event){
    const document_id = event?.target.closest(".document_element").getAttribute('document_id');
    const res = await fetch(`/documents/${document_id}`,{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const readdocname = document.getElementById("readdocname");
        const author = document.getElementById("byauthor-text-read-doc");
        const category = document.getElementById("category-doc-label");
        const department = document.getElementById("department-doc-label");
        const created_at = document.getElementById("department-doc-label");
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
                <p>${AccessLevel[data?.access_level]?.label}</p>
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

        const doc_download = document.getElementById("doc-download");
        const doc_edit = document.getElementById("doc-edit");
        const doc_delete = document.getElementById("doc-delete");

        doc_download.addEventListener('click', async function(event){
            window.location.href = `/documents/${document_id}/download`
        })

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
    for(var i=0;i<data.length;i++){
        let doc = `
        <li class="list-group-item list-group-item-action list-group-item-custom document_element" document_id="${data[i]?.id}">
            <div id="namedocandicon">
                <i class="bi bi-file-earmark-word-fill" style="font-size: 1.5rem;"></i>
                <div class="infodoc">
                    <p class="delete-standart-rules">${data[i]?.title}</p>
                    <p class="byauthor-text">Автор: ${data[i]?.author?.full_name}</p>
                </div>
            </div>
            <div class="statusbar ">
                <div class="accesslevel-container ${AccessLevel[data[i]?.access_level]?.className}">
                    <p>${AccessLevel[data[i]?.access_level]?.label}</p>
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
    const res = await fetch("/get_myself",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if(await validate_res(res)){
        const data = await res.json();
        const rightside = document.getElementById("rightside")
        if (data?.role?.user_manage){
            let manage_option = `
                <a href="#"\ class="btn btn-primary-custom  me-2" id="navbtn">
                    <i class="bi bi-person-video2" id="iconnavbtn"></i>
                    Пользователи
                </a>
                <a href="#" class="btn btn-primary-custom  me-2" id="navbtn">
                    <i class="bi bi-clock-history" id="iconnavbtn"></i>
                    Журнал
                </a>
            `
            rightside.insertAdjacentHTML('beforeend', manage_option);
        }
    }
}

async function getalldoc(){
    const res = await fetch("/documents",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    if(await validate_res(res)){
        const data = await res.json();
        create_doc(data);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await get_info_user();
    await getalldoc();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    
})