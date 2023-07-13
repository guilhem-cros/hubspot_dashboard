import { Box } from "@mui/material";

const bgImage = require("../../assets/images/bg.png");

const MainLayout: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({children,}) => {
    return (
            <Box
                sx={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {children}
            </Box>
    );
};

export default MainLayout;