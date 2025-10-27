import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedSecureCounter = await deploy("SecureCounter", {
    from: deployer,
    log: true,
  });

  console.log(`SecureCounter contract: `, deployedSecureCounter.address);

  const deployedCipherBoard = await deploy("CipherBoard", {
    from: deployer,
    log: true,
  });

  console.log(`CipherBoard contract: `, deployedCipherBoard.address);
};
export default func;
func.id = "deploy_cipherboard"; // id required to prevent reexecution
func.tags = ["CipherBoard"];
