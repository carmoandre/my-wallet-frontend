import styled from "styled-components";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useState, useContext } from "react";
import Loader from "react-loader-spinner";
import UserContext from "../contexts/UserContext";
import { GenericInput, FormatedValueInput } from "./reusable/GenericInput";
import { GenericButton } from "./reusable/GenericButton";
import CurrencyInput from "react-currency-masked-input";

export default function NewTransaction({ action }) {
    const [value, setValue] = useState("");
    const [description, setDescription] = useState("");
    const [disabled, setDisabled] = useState(false);
    const { user } = useContext(UserContext);
    const history = useHistory();

    const loadEffect = (
        <Loader type="ThreeDots" color="#fff" height={45} width={80} />
    );

    function submitTransaction(event) {
        event.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const body = { value, description, type: action };

        const request = axios.post(
            "http://localhost:4000/mywallet/new-transaction",
            body,
            config
        );

        setDisabled(true);

        request.then((response) => {
            console.log(response);
            setDisabled(false);
            history.push("/transactions");
        });
        request.catch((error) => {
            alert("Não foi possível salvar a transação");
            setDisabled(false);
        });
    }

    return (
        <FlexEffect>
            <Title>{`Nova ${action}`}</Title>
            <Form onSubmit={submitTransaction}>
                <FormatedValueInput>
                    <CurrencyInput
                        type="number"
                        placeholder="Valor"
                        required
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={disabled}
                    ></CurrencyInput>
                </FormatedValueInput>
                <GenericInput
                    type="text"
                    placeholder="Descrição"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={disabled}
                    maxLength="20"
                />
                <GenericButton type="submit" disabled={disabled}>
                    {disabled ? loadEffect : `Salvar ${action}`}
                </GenericButton>
            </Form>
            <Link to="/transactions">
                <GoBackButton disabled={disabled}>Cancelar</GoBackButton>
            </Link>
        </FlexEffect>
    );
}

const FlexEffect = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;

const Title = styled.p`
    font-weight: 700;
    font-size: 26px;
    margin-bottom: 40px;
    color: #fff;
    line-height: 31px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const GoBackButton = styled.button`
    width: 100%;
    height: 46px;
    background-color: #af4adb;
    color: #efedef;
    font-size: 20px;
    font-weight: 700;
    border: none;
    border-radius: 5px;
    margin-top: 13px;
`;
