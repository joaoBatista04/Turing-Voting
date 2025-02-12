"use client"

import { useState, useEffect } from "react"
import { ChevronRight, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StartPanel } from "./init"

import { ethers, Signer } from 'ethers'

import TokenArtifact from "../../blockchain/src/artifacts/contracts/Turing.sol/Turing.json"
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

interface User {
  name: string
  coins: number
}

let users: User[] = []

export default function RankingPanel() {
  const [isAdminPanel, setIsAdminPanel] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [voteAmount, setVoteAmount] = useState("")
  const [isVotingEnabled, setIsVotingEnabled] = useState(true)
  const [adminSelectedUser, setAdminSelectedUser] = useState("")
  const [adminAmount, setAdminAmount] = useState("")
  const [showRanking, setShowRanking] = useState(false)
  const [usersList, setUsersList] = useState([])

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  window.ethereum.request({ method: "eth_requestAccounts" });
  const signer = provider.getSigner();

  useEffect(() => {
    const sync = async () => {
      const listUsersA = await handleGetUsers();
      await setUsersList(listUsersA[0]);
    }

    sync();
  }, [])

  const togglePanel = () => setIsAdminPanel(!isAdminPanel)

  const handleConnect = async () =>{
    users = await getBalances();
    
    setShowRanking(true)
  }

  const handleBack = () => setShowRanking(false)

  async function getBalances(){
    const users = await Promise.all(usersList.map(async (nome, index) => ({
      name: nome,
      coins: await handleGetBalanceOf(nome) ?? 0
    })));

    return users;
  }

  async function handleIssueToken() {
    if(adminAmount == "" || adminSelectedUser == ""){
      return alert("Escolha o usuário e a quantidade de Turings que você deseja enviar!");
    }

    try{
      const contract = await _intializeContract(signer)
      await contract.functions.issueToken(adminSelectedUser, Number(adminAmount) * 10)

      contract.on('VoteEvent', async (name) => {
        const result = await handleGetBalanceOf(name);
        const novaLista = users.map(obj => 
          obj.name === name ? { ...obj, coins: result } : obj
        );

        users = novaLista
      })

      alert('Issue token successfull')
    }
    catch(e){
      if(e.reason){
        const index = e.reason.indexOf("'");
        const error = e.reason.slice(index);
        return alert(e.reason);
      }

      else if(e.message){
        const index = e.message.indexOf("'");
        const error = e.message.slice(index);
        return alert(e.message);
      }
    }
  }

  async function handleLiberarVotacao(){
    try{
      if(isVotingEnabled == true){
        const contract = await _intializeContract(signer)
        await contract.functions.votingOff()
        setIsVotingEnabled(false);
        alert('Voting Disabled');
      }

      else{
        const contract = await _intializeContract(signer)
        await contract.functions.votingOn()
        setIsVotingEnabled(true);
        alert('Voting Enabled');
      }
    }
    catch(e){
      if(e.reason){
        const index = e.reason.indexOf("'");
        const error = e.reason.slice(index);
        return alert(error);
      }

      else if(e.message){
        const index = e.message.indexOf("'");
        const error = e.message.slice(index);
        return alert(error);
      }
    }
  }

  async function handleVoting(){
    if(voteAmount == "" || selectedUser == ""){
      return alert("Escolha o usuário e a quantidade de Turings que você deseja enviar no seu voto!");
    }

    try{
      const contract = await _intializeContract(signer)
      await contract.functions.vote(selectedUser, Number(voteAmount) * 10)

      contract.on('VoteEvent', async (name) => {
        const result = await handleGetBalanceOf(name);
        const novaLista = users.map(obj => 
          obj.name === name ? { ...obj, coins: result } : obj
        );

        users = novaLista
      })

      contract.on('VoteEvent', async (name) => {
        const result = await handleGetBalanceOf(name);
        const novaLista = users.map(obj => 
          obj.name === name ? { ...obj, coins: result } : obj
        );

        users = novaLista
      })

      alert("Voted successfully")
    }
    catch(e){
      if(e.reason){
        const index = e.reason.indexOf("'");
        const error = e.reason.slice(index);
        return alert(e.reason);
      }

      else if(e.message){
        const index = e.message.indexOf("'");
        const error = e.message.slice(index);
        return alert(e.message);
      }
    }
  }

  async function handleGetUsers(){
    const contract = await _intializeContract(signer)
    const userListA = await contract.functions.getUsersList()
    return userListA;
  }

  async function handleGetBalanceOf(user: string){
    const contract = await _intializeContract(signer)
    const result = await contract.functions.getBalance(user)
    const number = parseInt(result[0]._hex, 16);
    return number/10;
  }

  async function _intializeContract(init: any) {
    window.ethereum.request({ method: "eth_requestAccounts" });
    const contract = new ethers.Contract(
        tokenAddress,
        TokenArtifact.abi,
        init
    );

    return contract
  }

  if (!showRanking) {
    return <StartPanel onConnect={handleConnect} />
  }

  return (
    <div className="min-h-screen bg-gray-100 via-white bg-fixed">
      <div className="container mx-auto min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleBack} variant="outline" size="lg" className="mr-8 mb-4 bg-red-600 hover:bg-red-700 text-white font-bold">
                Tela Inicial
            </Button>
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={togglePanel}>
                <span className="text-sm mr-1">{isAdminPanel ? "Voltar" : "Administração"}</span>
                <ChevronRight className={`transform transition-transform ${isAdminPanel ? "rotate-180" : ""}`} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">{isAdminPanel ? "Opções de Administrador" : "Ranking de Usuários"}</h2>

          {!isAdminPanel ? (
            <>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Ranking</h3>
                <ScrollArea className="h-60 w-full pr-4">
                  <ul>
                    {users
                      .sort((a, b) => b.coins - a.coins)
                      .map((user, index) => (
                        <li key={user.name} className="flex justify-between items-center mb-2">
                          <span>
                            {index + 1}. {user.name}
                          </span>
                          <span>{user.coins} moedas</span>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
              </div>

              <h2 className="text-xl font-bold mb-0.7">Votação</h2>
              <div className="space-y-4">
                <Select onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um participante" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {users.map((user) => (
                        <SelectItem key={user.name} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Quantidade de moedas"
                  value={voteAmount}
                  onChange={(e) => setVoteAmount(e.target.value)}
                  min={0}
                  max={2}
                  step={0.1}
                />

                <Button onClick={handleVoting} className="w-full">Votar</Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold mb-4">Liberar votação</span>
                <Switch checked={isVotingEnabled} onCheckedChange={handleLiberarVotacao} />
              </div>

              <h2 className="text-xl font-bold mb-4">issueToken</h2>


              <Select onValueChange={setAdminSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um participante" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {users.map((user) => (
                      <SelectItem key={user.name} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Quantidade de moedas"
                value={adminAmount}
                min={0}
                max={2}
                step={0.1}
                onChange={(e) => setAdminAmount(e.target.value)}
              />

              <Button onClick={handleIssueToken}className="w-full">Emitir</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}