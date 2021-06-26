import styled from "styled-components";

export default function SingleTransaction(props) {
    const { date, description, value, type } = props.transaction;

    return (
        <TransactionHolder>
            <Date> {date} </Date>
            <Description>{description}</Description>
            <Value type={type}>
                {(value / 100).toFixed(2).replace(".", ",")}
            </Value>
        </TransactionHolder>
    );
}

const TransactionHolder = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Date = styled.span`
    color: #c6c6c6;
`;

const Description = styled.span`
    color: #000;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 8px;
`;

const Value = styled.span`
    color: ${(props) => (props.type === "entrada" ? "#03AC00" : "#C70000")};
`;
