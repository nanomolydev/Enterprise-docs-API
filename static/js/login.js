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

async function get_response_messages(res) {
    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await res.json();
    }
    else {
        const text = await res.text();
        return [text || "Ошибка выполнения запроса"];
    }

    const messages = [];
    if (data?.message && !data?.errors) {
        messages.push(data.message);
    }
    messages.push(...extract_error_messages(data?.errors));
    if (data?.message && data?.errors && messages.length === 0) {
        messages.push(data.message);
    }
    return messages.length ? messages : ["Ошибка выполнения запроса"];
}

function extract_error_messages(value) {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value.flatMap(extract_error_messages);
    }
    if (typeof value === "object") {
        return Object.values(value).flatMap(extract_error_messages);
    }
    return [String(value)];
}

async function loginfunc(event){
    event.preventDefault(); 
    var login = document.getElementById("loginuser");
    var password = document.getElementById("password_user");
    const res = await fetch("/api/login",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"login": login.value, "password": password.value})
    });
    if(res.status==200){
        window.location.href = '/documents';
    }
    else{
        const messages = await get_response_messages(res);
        messages.forEach(message => create_toast(message));
    }
}

async function get_info_user(){
    const res = await fetch("/api/get_myself",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    if (res.status==200){
        window.location.href = '/documents';
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await get_info_user();
})
