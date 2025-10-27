"use client";

// import { useFhevm } from "../fhevm/useFhevm";
// import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
// import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
// import { useSecureCounter } from "@/hooks/useSecureCounter";
// import { errorNotDeployed } from "./ErrorNotDeployed";

/*
 * Main SecureCounter React component with 3 buttons
 *  - "Decrypt" button: allows you to decrypt the current SecureCounter value handle.
 *  - "Increase" button: allows you to increase the SecureCounter value handle using FHE operations.
 *  - "Decrease" button: allows you to decrease the SecureCounter value handle using FHE operations.
 */
// Temporarily disabled for refactoring
// const SecureCounterDemo = () => {
//   // Component code commented out
// };

// function printProperty(name: string, value: unknown) {
//   let displayValue: string;

//   if (typeof value === "boolean") {
//     return printBooleanProperty(name, value);
//   } else if (typeof value === "string" || typeof value === "number") {
//     displayValue = String(value);
//   } else if (typeof value === "bigint") {
//     displayValue = String(value);
//   } else if (value === null) {
//     displayValue = "null";
//   } else if (value === undefined) {
//     displayValue = "undefined";
//   } else if (value instanceof Error) {
//     displayValue = value.message;
//   } else {
//     displayValue = JSON.stringify(value);
//   }
//   return (
//     <p className="text-black">
//       {name}:{" "}
//       <span className="font-mono font-semibold text-black">{displayValue}</span>
//     </p>
//   );
// }

// function printBooleanProperty(name: string, value: boolean) {
//   if (value) {
//     return (
//       <p className="text-black">
//         {name}:{" "}
//         <span className="font-mono font-semibold text-green-500">true</span>
//       </p>
//     );
//   }

//   return (
//     <p className="text-black">
//       {name}:{" "}
//       <span className="font-mono font-semibold text-red-500">false</span>
//     </p>
//   );
// }
