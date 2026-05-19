import firstSection from "../aboutUsPage/firstSection.js";
import secondSection from "../aboutUsPage/secondSection.js";
import {flexExprienceData} from "../../data/aboutUsPagesData/SDFFS.js";
import cssChanger from "../../components/pagesCSS.js";

export default function aboutUsPage() {
    cssChanger('aboutUs');
    return `
        ${firstSection(flexExprienceData)}
        ${secondSection()}
    `
}