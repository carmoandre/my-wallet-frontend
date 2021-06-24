import styled from "styled-components";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import UserContext from "../contexts/UserContext";
import { GenericInput } from "./reusable/GenericInput";
import { GenericButton } from "./reusable/GenericButton";
import { Logo } from "./reusable/Logo";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const { setUser } = useContext(UserContext);
    const history = useHistory();

    const loadEffect = (
        <Loader type="ThreeDots" color="#fff" height={45} width={80} />
    );

    const localStorageUser = localStorage.getItem("user");
    /*
    useEffect(() => {
        if (localStorageUser) {
            setUser(JSON.parse(localStorageUser));
            history.push("/transactions");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    */
    function logUser(event) {
        event.preventDefault();

        setDisabled(true);

        const body = { email, password };

        const request = axios.post(
            "http://localhost:4000/mywallet/sign-in",
            body
        );
        request.then((response) => {
            console.log(response);
            setUser(response.data);
            const stringUser = JSON.stringify(response.data);
            localStorage.setItem("user", stringUser);
            setDisabled(false);
            history.push("/transactions");
        });
        request.catch((error) => {
            alert("Usuário ou senha inválidos");
            setDisabled(false);
        });
    }

    return (
        <FlexEffect>
            <Logo>MyWallet</Logo>
            <Form onSubmit={logUser}>
                <GenericInput
                    type="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={disabled}
                />
                <GenericInput
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={disabled}
                />
                <GenericButton type="submit" disabled={disabled}>
                    {disabled ? loadEffect : `Entrar`}
                </GenericButton>
            </Form>
            <Link to="/register">
                <Suggestion>Primeira vez? Cadastre-se!</Suggestion>
            </Link>
        </FlexEffect>
    );
}

const FlexEffect = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vh - 50px);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Suggestion = styled.p`
    font-weight: 700;
    color: #fff;
    font-size: 15px;
    line-height: 18px;
    margin-top: 36px;
`;
