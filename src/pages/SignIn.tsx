import MainLayout from "../components/login/MainLayout";
import React from "react";
import SigninPage from "../components/login/SigninPage";
import TitleBox from "../components/login/TitleBox";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {Box} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";

const SignIn = () => {

    const notifyError = (error: string) => {
        toast.error(error);
    }

    return (
        <MainLayout>
            <Box
                sx={{
                    width: {
                        sm: "90vw",
                        xs: "90vw",
                        md: "60vw",
                        lg: "60vw",
                        xl: "60vw",
                    },
                }}
            >
                {/* GRID SYSTEM */}
                <Grid container height="90vh">
                    <SigninPage notifyError={notifyError}/>

                    <TitleBox />
                </Grid>
                {/* GRID SYSTEM END */}
            </Box>
            <ToastContainer
                position="bottom-right"
                autoClose={7000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </MainLayout>
    );
}

export default SignIn;