import { ReactComponent as Instagram_icon } from "../../svg/instagram.svg";
import { ReactComponent as Linkedin_icon } from "../../svg/linkedin.svg";
import { ReactComponent as Telegram_icon } from "../../svg/telegram.svg"; // fixed typo


import { Link } from "react-router-dom"; // make sure you're importing Link

export default function Footer() {
    return (
        <footer>
            <div className="left_part">
                <div className="point"></div>
                <Link to="/about-us">About Us</Link>
                <Link to="/contact">Contact</Link>
            </div>
            <div className="middle_part"></div>
            <div className="right_part">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram_icon />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin_icon />
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                    <Telegram_icon />
                </a>
            </div>
        </footer>
    );
}
