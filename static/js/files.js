import {AccessLevel, StatusDoc} from './dictionaries.js';

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
        <li class="list-group-item list-group-item-custom">
            <div id="namedocandicon">
                <i class="bi bi-file-earmark-word-fill" style="font-size: 1.5rem;"></i>
                <div class="infodoc">
                    <p class="docname">${data[i]?.title}</p>
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
    }
}

async function getalldoc(){
    const res = await fetch("/documents",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    
    console.log(res.status);
    if(res.status==401){
        window.location.href = '/login';
    }
    else if (res.status==200){
        const data = await res.json();
        create_doc(data);
    }
    else{
        create_toast(await res.text());
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await getalldoc();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    
    
})