import renderLoginForm from "./loginSection.js";
import renderRegisterForm from "./registerSection.js";
import renderSelect from "./selectSectionRender.js";
import cssChanger from "../../components/pagesCSS.js";

export default function renderLoginPage(){
    cssChanger(login);
    return `
    ${renderLoginForm()}
    ${renderRegisterForm()}
    ${renderSelect()}
    `;
}