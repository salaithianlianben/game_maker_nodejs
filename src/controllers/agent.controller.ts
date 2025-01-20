// import { get } from "lodash";
// import { UserPayload } from "../utils/jwtUtils";
// import { ApiResponse, ErrorResponse } from "../types/ApiResponse";
// import { Request, Response } from "express";
// import {
//   addAgentPaymentAccount,
//   fetchAgentPaymentAccountDetail,
//   fetchAgentPaymentAccounts,
// } from "../services/agent.service";
// import { deletePaymentAccount, updatePaymentAccount } from "../models/agent_payment_account.model";

// const createAgentPaymentAccount = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const reqData = get(req, "user", null) as UserPayload | null;

//     if (!reqData) {
//       res.status(400).json({
//         status: "fail",
//         message: "Missing or invalid user data",
//         errors: [
//           "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
//         ],
//         data: null,
//       } as ErrorResponse);
//       return;
//     }

//     const { account_name, account_number, payment_gateway_id } = req.body;

//     const data = await addAgentPaymentAccount({
//       agent_id: parseInt(reqData.userId),
//       account_name,
//       account_number,
//       payment_gateway_id,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Create agent payment account successfully",
//       data: data,
//     } as ApiResponse<typeof data>);
//   } catch (error) {
//     console.error("Error creating agent payment account:", error);
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "fail",
//         message: error.message,
//         errors: error.stack,
//         data: null,
//       } as ErrorResponse);
//     } else {
//       res.status(500).json({
//         status: "fail",
//         message: "Internal server error",
//         errors: [
//           "An unexpected error occurred while creating agent payment account.",
//         ],
//         data: null,
//       } as ErrorResponse);
//     }
//   }
// };

// const getAgentPaymentAccountDetail = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const data = await fetchAgentPaymentAccountDetail(parseInt(id));

//     res.status(200).json({
//       status: "success",
//       message: "Fetch agent payment account successfully",
//       data: data,
//     } as ApiResponse<typeof data>);
//   } catch (error) {
//     console.error("Error fetching agent payment account:", error);
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "fail",
//         message: error.message,
//         errors: error.stack,
//         data: null,
//       } as ErrorResponse);
//     } else {
//       res.status(500).json({
//         status: "fail",
//         message: "Internal server error",
//         errors: [
//           "An unexpected error occurred while fetching agent payment account.",
//         ],
//         data: null,
//       } as ErrorResponse);
//     }
//   }
// };

// const getAgentPaymentAccounts = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { agentId } = req.params;

//     const data = await fetchAgentPaymentAccounts(parseInt(agentId));

//     res.status(200).json({
//       status: "success",
//       message: "Fetch agent payment accounts successfully",
//       data: data,
//     } as ApiResponse<typeof data>);
//   } catch (error) {
//     console.error("Error fetching agent payment accounts:", error);
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "fail",
//         message: error.message,
//         errors: error.stack,
//         data: null,
//       } as ErrorResponse);
//     } else {
//       res.status(500).json({
//         status: "fail",
//         message: "Internal server error",
//         errors: [
//           "An unexpected error occurred while fetching agent payment accounts.",
//         ],
//         data: null,
//       } as ErrorResponse);
//     }
//   }
// };

// const updateAgentPaymentAccount = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const reqData = get(req, "user", null) as UserPayload | null;

//     if (!reqData) {
//       res.status(400).json({
//         status: "fail",
//         message: "Missing or invalid user data",
//         errors: [
//           "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
//         ],
//         data: null,
//       } as ErrorResponse);
//       return;
//     }

//     const { id } = req.params;

//     const { account_name,  account_number, payment_gateway_id } = req.body;

//     const accountDetails = await fetchAgentPaymentAccountDetail(parseInt(id));

//     if(!accountDetails){
//       throw new Error(`There is no agent payment account of ${id}`)
//     }

//     if(accountDetails.agent_id !== parseInt(reqData.userId)){
//       throw new Error(`Access denied. You can't update this payment account.`)
//     }

//     const data = await updatePaymentAccount({
//       id: accountDetails.id,
//       account_name,
//       account_number,
//       payment_gateway_id
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Updated payment account successfully",
//       data: data,
//     } as ApiResponse<typeof data>);
//   } catch (error) {
//     console.error("Error updating agent payment account:", error);
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "fail",
//         message: error.message,
//         errors: error.stack,
//         data: null,
//       } as ErrorResponse);
//     } else {
//       res.status(500).json({
//         status: "fail",
//         message: "Internal server error",
//         errors: [
//           "An unexpected error occurred while updating agent payment account.",
//         ],
//         data: null,
//       } as ErrorResponse);
//     }
//   }
// };


// const deleteAgentPaymentAccount = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const reqData = get(req, "user", null) as UserPayload | null;

//     if (!reqData) {
//       res.status(400).json({
//         status: "fail",
//         message: "Missing or invalid user data",
//         errors: [
//           "User information is required to retrieve data. Please ensure you're logged in or your request includes valid user data.",
//         ],
//         data: null,
//       } as ErrorResponse);
//       return;
//     }

//     const { id } = req.params;

//     const accountDetails = await fetchAgentPaymentAccountDetail(parseInt(id));

//     if(!accountDetails){
//       throw new Error(`There is no agent payment account of ${id}`)
//     }

//     if(accountDetails.agent_id !== parseInt(reqData.userId)){
//       throw new Error(`Access denied. You can't delete this payment account.`)
//     }

//     await deletePaymentAccount(parseInt(id));

//     res.status(200).json({
//       status: "success",
//       message: "Deleted payment account successfully",
//       data: null,
//     } as ApiResponse<null>);
//   } catch (error) {
//     console.error("Error deleting agent payment account:", error);
//     if (error instanceof Error) {
//       res.status(500).json({
//         status: "fail",
//         message: error.message,
//         errors: error.stack,
//         data: null,
//       } as ErrorResponse);
//     } else {
//       res.status(500).json({
//         status: "fail",
//         message: "Internal server error",
//         errors: [
//           "An unexpected error occurred while deleting agent payment account.",
//         ],
//         data: null,
//       } as ErrorResponse);
//     }
//   }
// };

// export {
//   createAgentPaymentAccount,
//   getAgentPaymentAccountDetail,
//   getAgentPaymentAccounts,
//   updateAgentPaymentAccount,
//   deleteAgentPaymentAccount
// };
