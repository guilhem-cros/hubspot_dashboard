import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    Box,
    IconButton,
    InputAdornment,
    InputBase,
    Paper,
    Typography,
} from "@mui/material";
import {useState} from "react";

const CustomInput: React.FC<{
    isIconActive: boolean;
    label: string;
    placeholder: string;
}> = ({ isIconActive, label, placeholder }) => {

    const [showPW, setShowPW] = useState(false);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignContent="center"
            justifyContent="flex-start"
            mb={2}
        >
            <Box display="flex" flexDirection="column" justifyContent="flex-start">
                <Typography color="white" pb={1}>
                    {label}
                </Typography>
                <Paper
                    sx={{
                        background: "#233447",
                        width: "100%"
                    }}
                >
                    <InputBase
                        type={isIconActive && !showPW ? "password" : "text"}
                        placeholder={placeholder}
                        fullWidth
                        sx={{
                            bgcolor: "#233447",
                            p: 1,
                            borderRadius: "5px",
                            color: "white",
                        }}
                        endAdornment={
                            isIconActive && (
                                <InputAdornment position="end" sx={{ pr: 1 }}>
                                    <IconButton edge="end" color="info" onClick={()=> { setShowPW(!showPW)}} sx={{color: "white"}}>
                                        {showPW ?
                                        <VisibilityOff/>
                                            :
                                        <Visibility/>
                                        }
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default CustomInput;