
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Layout from "../component/layout/layout";
import NotFound from "../component/parties/not_found";
import Setting from "../component/parties/satting";
import AboutUs from "../component/parties/about_us";
import Contact from "../component/parties/contact";
import More from "../component/parties/more";

import UserShow from '../component/user/user_show';
import UserCreate from '../component/user/user_create';
import UserUpdate from '../component/user/user_update';
import UserDelete from '../component/user/user_delete';
import UserLogin from '../component/user/user_login';
import UserLogout from '../component/user/user_logout';

import PinIndex from '../component/pin/pin_index';
import PinShow from '../component/pin/pin_show';
import PinCreate from '../component/pin/pin_create';
import PinUpdate from '../component/pin/pin_update';
import PinDelete from '../component/pin/pin_delete';
import { UserContext } from "../provider/userContext";
import { useContext } from "react";

export default function Router() {

    const { storedUser } = useContext(UserContext);
    console.log(storedUser);

    return (
        <BrowserRouter>
            <Routes>

                <Route path='/user' element={<Layout />}>
                    {storedUser?.id ? (
                        <>
                            <Route path="update/:id" element={<UserUpdate />} />
                            <Route path="delete/:id" element={<UserDelete />} />
                            <Route path="logout" element={<UserLogout />} />
                        </>
                    ) : (
                        <>
                            <Route path="create" element={<UserCreate />} />
                            <Route path="login" element={<UserLogin />} />
                        </>
                    )}
                    <Route path="show/:id" element={<UserShow />} />
                </Route>

                <Route path='/pin' element={<Layout />}>
                    <Route index element={<PinIndex />} />
                    <Route path="show/:id" element={<PinShow />} />
                    {storedUser?.id && (
                        <>
                            <Route path="create" element={<PinCreate />} />
                            <Route path="update/:id" element={<PinUpdate />} />
                            <Route path="delete/:id" element={<PinDelete />} />
                        </>
                    )}
                </Route>

                <Route path="/" element={<Layout />} >
                    <Route path="setting" element={<Setting />} />
                    <Route path="more" element={<More />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

            </Routes>
        </BrowserRouter>

    )
}