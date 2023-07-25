import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    Box,
    IconButton,
    InputAdornment,
    InputBase,
    Paper,
    Typography,
} from "@mui/material";
import React, {useState} from "react";

const CustomInput: React.FC<{
    isIconActive: boolean;
    label: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter?: () => void;
}> = ({ isIconActive, label, placeholder, onChange, onEnter }) => {

    const [showPW, setShowPW] = useState(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (onEnter) {
                onEnter();
            }
        }
    };

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
                        onChange={onChange}
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
                        onKeyDown={handleKeyDown}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default CustomInput;