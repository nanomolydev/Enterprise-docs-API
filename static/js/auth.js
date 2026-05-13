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

async function loginfunc(){
    event.preventDefault(); 
    var login = document.getElementById("loginuser");
    var password = document.getElementById("password_user");
    const res = await fetch("/login",{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"login": login.value, "password": password.value})
    });
    const data = await res.json();
    data.errors?.json?.password?.forEach(error => {
        create_toast(error);
    });
    data.errors?.json?.login?.forEach(error => {
        create_toast(error);
    });
    if(res.status==200){
        window.location.href = '/files';
    }
}