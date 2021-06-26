import styled from "styled-components";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import SingleTransaction from "./SingleTransaction";

export default function ShowTransactions() {
    const { user, setUser } = useContext(UserContext);
    const [transactions, setTransactions] = useState(null);
    const history = useHistory();
    const localStorageUser = localStorage.getItem("user");
    const localUser = JSON.parse(localStorageUser);
    let total = 0;

    useEffect(() => {
        if (!user && localStorageUser) {
            setUser(localUser);
        }
        getTransactions();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getTransactions() {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.token || localUser.token}`,
            },
        };

        const request = axios.get(
            "http://localhost:4000/mywallet/show-transactions",
            config
        );

        request.then((response) => {
            setTransactions(response.data);
        });
        request.catch((error) => {
            alert("Não foi possível recuperar as transações");
        });
    }

    function logoutUser() {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.token || localUser.token}`,
            },
        };

        const request = axios.delete(
            "http://localhost:4000/mywallet/end-sessions",
            config
        );

        request.then((response) => {
            console.log(response);
            localStorage.removeItem("user");
            history.push("/");
        });
        request.catch((error) => {
            alert("Não foi possível encerrar a sessão.");
        });
    }

    return (
        <FlexEffect>
            <SideBySide>
                <Title>{`Olá, ${user?.name}`}</Title>
                <LogoutIcon onClick={logoutUser} />
            </SideBySide>
            <TransactionsField>
                {transactions ? (
                    <TransactionsHolder>
                        {transactions.map((transaction, index) => {
                            transaction.type === "entrada"
                                ? (total += transaction.value)
                                : (total -= transaction.value);
                            return (
                                <SingleTransaction
                                    key={index}
                                    transaction={transaction}
                                />
                            );
                        })}
                    </TransactionsHolder>
                ) : (
                    <EmptyHolder>
                        <p>Não há registros de</p>
                        <p>entrada ou saída</p>
                    </EmptyHolder>
                )}
                <DistanceForBalance />
                <Balance total={total}>
                    <p>SALDO</p>
                    <p>
                        {((total > 0 ? total : total * -1) / 100)
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>
                </Balance>
            </TransactionsField>
            <SideBySide>
                <Link to="/new-credit">
                    <AddTransaction>
                        <AddCreditIcon />
                        <div>
                            <p>Nova</p>
                            <p>entrada</p>
                        </div>
                    </AddTransaction>
                </Link>
                <Link to="/new-debit">
                    <AddTransaction>
                        <AddDebitIcon />
                        <div>
                            <p>Nova</p>
                            <p>saída</p>
                        </div>
                    </AddTransaction>
                </Link>
            </SideBySide>
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

const SideBySide = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Title = styled.p`
    font-weight: 700;
    font-size: 26px;
    color: #fff;
    line-height: 31px;
    margin-bottom: 22px;
`;

const LogoutIcon = styled(RiLogoutBoxRLine)`
    color: #fff;
    width: 28px;
    height: 28px;
    margin-bottom: 22px;
`;

const TransactionsField = styled.div`
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    max-height: 446px;
    padding: 23px 11px 10px 12px;
    position: relative;
`;

const AddTransaction = styled.div`
    width: 155px;
    height: 114px;
    border-radius: 5px;
    background: #a328d6;
    margin-top: 13px;
    padding: 11px 10px 9px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
        font-size: 17px;
        line-height: 20px;
        color: #fff;
        font-weight: 700;
    }
`;

const AddCreditIcon = styled(AiOutlinePlusCircle)`
    color: #fff;
    width: 22px;
    height: 22px;
`;

const AddDebitIcon = styled(AiOutlineMinusCircle)`
    color: #fff;
    width: 22px;
    height: 22px;
`;

const TransactionsHolder = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: calc(446px - 62px);
    overflow-y: scroll;
`;

const EmptyHolder = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
        color: #868686;
        font-size: 20px;
        line-height: 23px;
    }
`;

const Balance = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 17px;
    width: calc(100% - 20px);
    position: absolute;
    bottom: 10px;
    left: 10px;
    border-radius: 5px;

    & > p:first-child {
        font-weight: 700;
    }

    & > p:nth-child(2) {
        color: ${(props) => (props.total > 0 ? "#03AC00" : "#C70000")};
    }
`;

const DistanceForBalance = styled.div`
    height: 38px;
    background-color: #fff;
`;
