"use client";

import { useState, useEffect } from "react";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useCipherBoard } from "@/hooks/useCipherBoard";

/*
 * CipherBoard Platform - An elite blockchain private messaging platform
 */
export const CipherBoardDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
    connect,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // CipherBoard Hook
  //////////////////////////////////////////////////////////////////////////////

  const cipherBoard = useCipherBoard({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Local State for UI
  //////////////////////////////////////////////////////////////////////////////

  const [recipientAddress, setRecipientAddress] = useState("");
  const [secureMessage, setSecureMessage] = useState("");

  //////////////////////////////////////////////////////////////////////////////
  // Modal State
  //////////////////////////////////////////////////////////////////////////////

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  //////////////////////////////////////////////////////////////////////////////
  // Message Listener for Modal Alerts
  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (cipherBoard.message) {
      if (cipherBoard.message.startsWith('PERMISSION_DENIED:')) {
        const message = cipherBoard.message.replace('PERMISSION_DENIED:', '');
        showModal('error', 'Access Denied', message);
      } else if (cipherBoard.message.includes('decrypted successfully')) {
        showModal('success', 'Decryption Complete', cipherBoard.message);
      } else if (cipherBoard.message.includes('Failed') || cipherBoard.message.includes('Error')) {
        showModal('error', 'Operation Failed', cipherBoard.message);
      }
    }
  }, [cipherBoard.message]);

  //////////////////////////////////////////////////////////////////////////////
  // UI Styling - Premium Dark Theme
  //////////////////////////////////////////////////////////////////////////////


  //////////////////////////////////////////////////////////////////////////////
  // Modal Functions
  //////////////////////////////////////////////////////////////////////////////

  const showModal = (type: 'error' | 'success' | 'warning' | 'info', title: string, message: string) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  //////////////////////////////////////////////////////////////////////////////
  // Modal Component
  //////////////////////////////////////////////////////////////////////////////

  const Modal = () => {
    if (!modalState.isOpen) return null;

    const getIcon = () => {
      switch (modalState.type) {
        case 'error': return '❌';
        case 'success': return '✅';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
      }
    };

    const getColorClasses = () => {
      switch (modalState.type) {
        case 'error': return 'border-red-500/20 bg-red-500/10';
        case 'success': return 'border-green-500/20 bg-green-500/10';
        case 'warning': return 'border-amber-500/20 bg-amber-500/10';
        case 'info': return 'border-cyan-500/20 bg-cyan-500/10';
        default: return 'border-slate-500/20 bg-slate-500/10';
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className={`w-full max-w-md rounded-xl border ${getColorClasses()} p-6 shadow-2xl`}>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">{getIcon()}</span>
            <h3 className="text-xl font-semibold text-white">{modalState.title}</h3>
          </div>

          <p className="text-slate-300 mb-6 leading-relaxed">
            {modalState.message}
          </p>

          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  //////////////////////////////////////////////////////////////////////////////
  // Render Functions
  //////////////////////////////////////////////////////////////////////////////


  if (cipherBoard.isDeployed === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Contract Not Deployed</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              CipherBoard contract not found on chain {chainId}. Please deploy the contract first to enable secure communications.
            </p>
            <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
              <p className="text-slate-400 text-sm">
                Deploy the CipherBoard contract to initialize the secure messaging infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-xl">🔐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CipherBoard</h1>
                <p className="text-xs text-slate-400">Enterprise Security Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">System Online</span>
              </div>

              {!isConnected ? (
                <button
                  onClick={connect}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-sm text-green-300">Wallet Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Secure Communication
            <span className="block text-cyan-400">Control Center</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade blockchain communication platform with military-level encryption protocols.
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Compose Section */}
          <div className="xl:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <span className="text-cyan-400">✉️</span>
                </div>
                <h2 className="text-xl font-semibold text-white">New Transmission</h2>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Draft and transmit encrypted communications with enterprise-grade security protocols.
                Access is restricted to authorized recipients through advanced cryptographic controls.
              </p>

            {!isConnected && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-amber-300 flex items-center">
                    <span className="mr-2">🔗</span>
                    Please establish wallet connection to initiate classified communications.
                  </p>
                  <button
                    onClick={connect}
                    className="ml-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (recipientAddress && secureMessage) {
                    cipherBoard.transmitSecureMessage(recipientAddress, secureMessage);
                    setRecipientAddress("");
                    setSecureMessage("");
                  }
                }}
                className="space-y-5"
              >
                {/* Recipient Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-300">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    Target Recipient
                  </label>
                  <input
                    type="text"
                    placeholder="Enter recipient wallet address (0x...)"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-300">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    Classified Content
                  </label>
                  <textarea
                    placeholder="Compose your encrypted message..."
                    value={secureMessage}
                    onChange={(e) => setSecureMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none"
                    rows={6}
                    maxLength={280}
                    required
                  />
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Character limit: 280</span>
                    <span>{secureMessage.length}/280</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    disabled={!recipientAddress || !secureMessage || cipherBoard.isTransmitting || !isConnected}
                  >
                    {cipherBoard.isTransmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Encrypting & Transmitting...
                      </>
                    ) : !isConnected ? (
                      <>
                        <span className="mr-2">🔗</span>
                        Wallet Connection Required
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Transmit Classified Communication
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Main Content Area - Communication Vault */}
          <div className="xl:col-span-2 space-y-6">
            {/* Vault Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xl">🗄️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Communication Vault</h2>
                    <p className="text-slate-400 text-sm">
                      {cipherBoard.totalCommunications} classified communications in secure storage
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Stats Card */}
                  <div className="hidden md:block bg-slate-900/50 rounded-lg px-4 py-2 border border-slate-600">
                    <div className="text-xs text-slate-400">Total Secured</div>
                    <div className="text-lg font-bold text-cyan-400">{cipherBoard.totalCommunications}</div>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={cipherBoard.loadCommunications}
                    className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    disabled={cipherBoard.isLoading}
                  >
                    {cipherBoard.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border border-slate-400 border-t-transparent mr-2"></div>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🔄</span>
                        Sync Vault
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Communication List */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              {cipherBoard.communications.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 mb-6">
                    <span className="text-4xl">📭</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Vault is Empty</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    No classified communications have been secured yet. Compose and transmit your first encrypted message to populate the vault.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {cipherBoard.communications.map((communication) => (
                    <div key={communication.id} className="p-6 hover:bg-slate-800/50 transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm font-medium text-slate-300">Transmission #{communication.id}</span>
                            </div>
                            <div className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
                              {new Date(communication.transmissionTime * 1000).toLocaleString()}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <span className="text-slate-500">From:</span>
                              <div className="font-mono text-cyan-400 bg-slate-900/50 px-3 py-1 rounded border border-slate-600">
                                {communication.sender.slice(0, 10)}...{communication.sender.slice(-8)}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-slate-500">To:</span>
                              <div className="font-mono text-purple-400 bg-slate-900/50 px-3 py-1 rounded border border-slate-600">
                                {communication.recipient.slice(0, 10)}...{communication.recipient.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {communication.isDecrypted && communication.content ? (
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                              <span className="text-green-400">✓</span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                              <span className="text-amber-400">🔒</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {communication.isDecrypted && communication.content ? (
                        <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-1">💬</span>
                            <div className="flex-1">
                              <p className="text-slate-100 leading-relaxed">{communication.content}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            onClick={() => cipherBoard.decryptCommunication(communication.id)}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 hover:text-cyan-200 rounded-lg transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={cipherBoard.isDecrypting || !isConnected}
                          >
                            {cipherBoard.isDecrypting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border border-cyan-300 border-t-transparent mr-3"></div>
                                Decrypting...
                              </>
                            ) : !isConnected ? (
                              <>
                                <span className="mr-2">🔗</span>
                                Wallet Required
                              </>
                            ) : (
                              <>
                                <span className="mr-2">🔓</span>
                                Decrypt Message
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400">🌐</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Network Status</h3>
                <p className="text-xs text-slate-400">Blockchain Connection</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Chain ID</span>
                <span className="font-mono text-cyan-400 bg-slate-900/50 px-3 py-1 rounded text-sm">{chainId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Wallet</span>
                <span className="font-mono text-slate-300 bg-slate-900/50 px-3 py-1 rounded text-sm">{ethersSigner?.address?.slice(0, 6)}...{ethersSigner?.address?.slice(-4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <span className="text-green-400">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Contract Status</h3>
                <p className="text-xs text-slate-400">Smart Contract Health</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">CipherBoard</span>
                <span className="font-mono text-slate-300 bg-slate-900/50 px-3 py-1 rounded text-sm">{cipherBoard.contractAddress?.slice(0, 6)}...{cipherBoard.contractAddress?.slice(-4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Status</span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  cipherBoard.isDeployed
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${cipherBoard.isDeployed ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span>{cipherBoard.isDeployed ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400">🔐</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Cryptographic Engine</h3>
                <p className="text-xs text-slate-400">Encryption System Status</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">FHEVM Status</span>
                <span className="font-medium text-blue-400 bg-slate-900/50 px-3 py-1 rounded text-sm">{fhevmStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Engine State</span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  fhevmInstance
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${fhevmInstance ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span>{fhevmInstance ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operations Status */}
        {cipherBoard.message && (
          <div className="mt-12 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              <p className="text-cyan-300">{cipherBoard.message}</p>
            </div>
          </div>
        )}

        {/* Security Alerts */}
        {fhevmError && (
          <div className="mt-6 p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              <p className="text-red-300">Cryptographic Engine Malfunction: {fhevmError.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal />
    </div>
  );
}
