import { Box, Button, colors, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React, {useState} from "react";
import CustomInput from "./CustomInput";
import logo from "../../assets/images/stride_logo.png"
import {useAuth} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";

interface Props{
    notifyError: (error: string) => void;
}

const SigninPage: React.FC<Props> = ({notifyError}) => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [enteredId, setEnteredId] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');

    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredId(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPassword(event.target.value);
    };

    const signIn = () => {
        const correctId = process.env.REACT_APP_BASIC_ID;
        const correctPassword = process.env.REACT_APP_BASIC_PASSWORD;

        if (enteredId.localeCompare(correctId!)===0 && enteredPassword.localeCompare(correctPassword!)===0) {
            console.log('Authentication successful!');
            login();
            navigate('/');
        } else {
            console.log('Invalid ID or password.');
            notifyError("Identifiant ou mot de passe invalide");
        }

    }

    return (

        <Grid
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            minHeight={550}
            sx={{
                boxShadow: {
                    xs: "",
                    sm: "",
                    md: "15px 2px 5px -5px",
                    lg: "15px 2px 5px -5px",
                    xl: "15px 2px 5px -5px",
                },
            }}
        >
            <Box
                sx={{
                    backgroundColor: "rgba(0, 24, 57, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    borderRadius: {
                        xs: "30px",
                        sm: "30px",
                        md: "30px 0 0 30px",
                        lg: "30px 0 0 30px",
                        xl: "30px 0 0 30px",
                    },
                }}
            >
                <Box width="80%">
                    <Box display="flex" flexDirection="column" alignItems="center">
                        {/* LOGO */}
                        <Box
                            sx={{
                                mt: "60px",
                                width: "50px",
                                height: "50px",
                                bgcolor: "white",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 0 20px ${colors.red[500]}`,
                            }}
                        >
                            <img src={logo} alt={"Logo Stride"} width={40}/>
                        </Box>
                        {/* LOGO END */}

                        <Typography color="white" fontWeight="bold" mt={7} mb={3}>
                            Connexion au dashboard
                        </Typography>
                    </Box>

                    {/* INPUTS */}
                    <CustomInput
                        label="Identifiant"
                        placeholder="Entrez votre identifiant..."
                        isIconActive={false}
                        onChange={handleIdChange}
                        onEnter={signIn}
                    />
                    <CustomInput
                        label="Mot de passe"
                        placeholder="Entrez votre mot de passe..."
                        isIconActive={true}
                        onChange={handlePasswordChange}
                        onEnter={signIn}
                    />

                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        mt={2}
                        width="100%"
                        color="white"
                    >
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 4, boxShadow: `0 0 20px ${colors.red[500]}`, fontWeight: "bold", color: "white", backgroundColor: "red" }}
                        onClick={signIn}
                    >
                        Connexion
                    </Button>
                </Box>
            </Box>
        </Grid>

    );
};

export default SigninPage;