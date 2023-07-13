import { Box, Button, colors, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import CustomInput from "./CustomInput";
import logo from "../../assets/images/stride_logo.png"

const SigninPage: React.FC = () => {
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
                    />
                    <CustomInput
                        label="Mot de passe"
                        placeholder="Entrez votre mot de passe..."
                        isIconActive={true}
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
                    >
                        Connexion
                    </Button>
                </Box>
            </Box>
        </Grid>

    );
};

export default SigninPage;