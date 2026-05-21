export default function renderLoginForm(){
    return`
            <form id="loginForm" class="auth-form active">
                <div class="form-group">
                    <label for="loginEmail">Имэйл хаяг</label>
                    <input type="email" id="loginEmail" placeholder="Имэйлээ оруулна уу" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Нууц үг</label>
                    <input type="password" id="loginPassword" placeholder="Нууц үгээ оруулна уу" required>
                </div>
                <button type="submit" class="btn-submit">Нэвтрэх</button>
            </form>
    `;
}