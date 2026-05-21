export default function renderRegisterForm(){
    return `
            <form id="registerForm" class="auth-form">
                <div class="form-group">
                    <label for="regLastName">Овог</label>
                    <input type="text" id="regLastName" placeholder="Овгоо оруулна уу" required>
                </div>
                <div class="form-group">
                    <label for="regFirstName">Нэр</label>
                    <input type="text" id="regFirstName" placeholder="Нэрээ оруулна уу" required>
                </div>
                <div class="form-group">
                    <label for="regEmail">Имэйл хаяг</label>
                    <input type="email" id="regEmail" placeholder="Имэйлээ оруулна уу" required>
                </div>
                <div class="form-group">
                    <label for="regPassword">Нууц үг</label>
                    <input type="password" id="regPassword" placeholder="Нууц үг зохионо уу" required>
                </div>
                <button type="submit" class="btn-submit">Бүртгүүлэх</button>
            </form>
    `;
}