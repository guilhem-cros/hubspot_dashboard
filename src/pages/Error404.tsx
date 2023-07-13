import logo from "../assets/images/stride_logo.png";
import styled from "styled-components";

const StyledPage = styled.div`

  text-align: center;
  margin-top: 6%;
  
  .err{
    >*{
      margin-top: 3%;
    }
  }
`

const Error404 = () => {

    return (
        <StyledPage>
            <div className={"err"}>
                <h1>Erreur 404</h1>
                <img src={logo} alt={"Logo Stride"} width={250}/>
                <h2>Page introuvable</h2>
            </div>
        </StyledPage>
    )
}

export default Error404;