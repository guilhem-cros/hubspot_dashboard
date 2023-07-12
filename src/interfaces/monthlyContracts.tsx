import Period from "./period";
import Contract from "./contract";

export default interface MonthlyContracts{
    period: Period,
    contracts: Contract[]
}