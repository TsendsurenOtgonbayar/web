export default function renderSelect(){
    return `
            <div class="auth-tabs">
                <div id="tab-login" class="auth-tab active" onclick="switchTab('login')">Нэвтрэх</div>
                <div id="tab-register" class="auth-tab" onclick="switchTab('register')">Бүртгүүлэх</div>
            </div>
    `;
}