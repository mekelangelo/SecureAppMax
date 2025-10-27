import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the SecureCounter contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the SecureCounter contract
 *
 *   npx hardhat --network localhost task:decrypt-secure-value
 *   npx hardhat --network localhost task:increase-secure-value --value 2
 *   npx hardhat --network localhost task:decrease-secure-value --value 1
 *   npx hardhat --network localhost task:decrypt-secure-value
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the SecureCounter contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the SecureCounter contract
 *
 *   npx hardhat --network sepolia task:decrypt-secure-value
 *   npx hardhat --network sepolia task:increase-secure-value --value 2
 *   npx hardhat --network sepolia task:decrease-secure-value --value 1
 *   npx hardhat --network sepolia task:decrypt-secure-value
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the SecureCounter address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const secureCounter = await deployments.get("SecureCounter");

  console.log("SecureCounter address is " + secureCounter.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-secure-value
 *   - npx hardhat --network sepolia task:decrypt-secure-value
 */
task("task:decrypt-secure-value", "Calls the getSecureValue() function of SecureCounter Contract")
  .addOptionalParam("address", "Optionally specify the SecureCounter contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const SecureCounterDeployement = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureCounter");
    console.log(`SecureCounter: ${SecureCounterDeployement.address}`);

    const signers = await ethers.getSigners();

    const secureCounterContract = await ethers.getContractAt("SecureCounter", SecureCounterDeployement.address);

    const encryptedValue = await secureCounterContract.getSecureValue();
    if (encryptedValue === ethers.ZeroHash) {
      console.log(`encrypted value: ${encryptedValue}`);
      console.log("clear value    : 0");
      return;
    }

    const clearValue = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedValue,
      SecureCounterDeployement.address,
      signers[0],
    );
    console.log(`Encrypted value: ${encryptedValue}`);
    console.log(`Clear value    : ${clearValue}`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:increase-secure-value --value 1
 *   - npx hardhat --network sepolia task:increase-secure-value --value 1
 */
task("task:increase-secure-value", "Calls the increaseSecureValue() function of SecureCounter Contract")
  .addOptionalParam("address", "Optionally specify the SecureCounter contract address")
  .addParam("value", "The increment value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const SecureCounterDeployement = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureCounter");
    console.log(`SecureCounter: ${SecureCounterDeployement.address}`);

    const signers = await ethers.getSigners();

    const secureCounterContract = await ethers.getContractAt("SecureCounter", SecureCounterDeployement.address);

    // Encrypt the value passed as argument
    const encryptedValue = await fhevm
      .createEncryptedInput(SecureCounterDeployement.address, signers[0].address)
      .add32(value)
      .encrypt();

    const tx = await secureCounterContract
      .connect(signers[0])
      .increaseSecureValue(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    const newEncryptedValue = await secureCounterContract.getSecureValue();
    console.log("Encrypted value after increase:", newEncryptedValue);

    console.log(`SecureCounter increaseSecureValue(${value}) succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrease-secure-value --value 1
 *   - npx hardhat --network sepolia task:decrease-secure-value --value 1
 */
task("task:decrease-secure-value", "Calls the decreaseSecureValue() function of SecureCounter Contract")
  .addOptionalParam("address", "Optionally specify the SecureCounter contract address")
  .addParam("value", "The decrement value")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const value = parseInt(taskArguments.value);
    if (!Number.isInteger(value)) {
      throw new Error(`Argument --value is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const SecureCounterDeployement = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureCounter");
    console.log(`SecureCounter: ${SecureCounterDeployement.address}`);

    const signers = await ethers.getSigners();

    const secureCounterContract = await ethers.getContractAt("SecureCounter", SecureCounterDeployement.address);

    // Encrypt the value passed as argument
    const encryptedValue = await fhevm
      .createEncryptedInput(SecureCounterDeployement.address, signers[0].address)
      .add32(value)
      .encrypt();

    const tx = await secureCounterContract
      .connect(signers[0])
      .decreaseSecureValue(encryptedValue.handles[0], encryptedValue.inputProof);
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    const newEncryptedValue = await secureCounterContract.getSecureValue();
    console.log("Encrypted value after decrease:", newEncryptedValue);

    console.log(`SecureCounter decreaseSecureValue(${value}) succeeded!`);
  });
