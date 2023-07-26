import styled from 'styled-components';
import Objectives from "../../interfaces/objectives";
import React, {useEffect, useState} from "react";
import {getObjectives, updateObjectives} from "../../config/hubspotConfig";
import {Button, Container, Grid, TextField, Typography} from "@mui/material";
import {Update} from "@mui/icons-material";
import {Hypnosis} from "react-cssfx-loading";
import {toast, ToastContainer} from "react-toastify";


const StyledForm = styled.div`
  #objectives-form-button{
    margin-top: 2%;
    margin-bottom: 2%;
  }
  
  .global-loading{
    margin-left: 45%;
    margin-top: 10%;
  }
  
`

interface Props {

}

const ObjectivesForm: React.FC<Props> = ()=>{

    const [values, setValues] = useState<Objectives|null>(null);
    const [criticalError, setCriticalError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
        if(loading){
            fetchObjectives().then(()=>{
                setLoading(false);
            })
        }
    });

    const fetchObjectives = async () => {
        try{
            if(values===null){
                const obj=await  getObjectives();
                setValues(obj);
            }
        } catch (err){
            setCriticalError(true);
            if(err instanceof Error){
                console.error(err)
            } else {
                console.error("Unexpected error: " + err);
            }
        }
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues!,
            [name]: value !== "" ? Number(value) : null,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const submission = await updateObjectives(values!);
            if (submission) {
                toast.success("Les objectifs ont été mis à jour.");
            } else {
                toast.error("Une erreur est survenu durant la mise à jour des objectifs.");
            }
        } catch (err){
            toast.error("Une erreur innatendue est survenue.")
        }
    };

    return (
        <StyledForm>
            { (!loading && !criticalError) ?
                <Container maxWidth="sm">
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" gutterBottom>
                            Mettre à jour les objectifs
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Contacts par mois"
                                    variant="outlined"
                                    name="MONTHLY_CONTACTS_OBJ"
                                    type="number"
                                    value={values!.MONTHLY_CONTACTS_OBJ || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Leads par mois"
                                    variant="outlined"
                                    name="MONTHLY_LEADS_OBJ"
                                    type="number"
                                    value={values!.MONTHLY_LEADS_OBJ || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Prospects par mois"
                                    variant="outlined"
                                    name="MONTHLY_PROSPECTS_OBJ"
                                    type="number"
                                    value={values!.MONTHLY_PROSPECTS_OBJ || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Prospects avancés par mois"
                                    variant="outlined"
                                    name="MONTHLY_ADVANCED_PROSPECTS_OBJ"
                                    type="number"
                                    value={values!.MONTHLY_ADVANCED_PROSPECTS_OBJ || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Clients par mois"
                                    variant="outlined"
                                    name="MONTHLY_CLIENTS_OBJ"
                                    type="number"
                                    value={values!.MONTHLY_CLIENTS_OBJ || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="CA devisé par mois"
                                    variant="outlined"
                                    name="MONTHLY_EXPECTED_CA"
                                    type="number"
                                    value={values!.MONTHLY_EXPECTED_CA || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="CA signé par mois"
                                    variant="outlined"
                                    name="MONTHLY_SIGNED_CA"
                                    type="number"
                                    value={values!.MONTHLY_SIGNED_CA || ""}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Button
                            id="objectives-form-button"
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<Update />}
                        >
                            Update
                        </Button>
                    </form>
                </Container>
                :
                <div>
                    <Hypnosis
                        width={100}
                        height={100}
                        className={"global-loading"}
                    />
                </div>
            }
            <ToastContainer
                position="bottom-right"
                autoClose={6000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </StyledForm>
    )
}

export default ObjectivesForm