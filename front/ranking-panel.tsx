"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
  name: string
  coins: number
}

const users: User[] = [
  { name: "Alice", coins: 100 },
  { name: "Bob", coins: 75 },
  { name: "Charlie", coins: 50 },
  { name: "David", coins: 25 },
  { name: "Eve", coins: 120 },
  { name: "Frank", coins: 90 },
  { name: "Grace", coins: 60 },
  { name: "Henry", coins: 40 },
  { name: "Ivy", coins: 110 },
  { name: "Jack", coins: 85 },
  { name: "Kate", coins: 70 },
  { name: "Liam", coins: 55 },
  { name: "Mia", coins: 95 },
  { name: "Noah", coins: 65 },
  { name: "Olivia", coins: 45 },
]

export default function RankingPanel() {
  const [isAdminPanel, setIsAdminPanel] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [voteAmount, setVoteAmount] = useState("")
  const [isVotingEnabled, setIsVotingEnabled] = useState(false)
  const [adminSelectedUser, setAdminSelectedUser] = useState("")
  const [adminAmount, setAdminAmount] = useState("")

  const togglePanel = () => setIsAdminPanel(!isAdminPanel)

  return (
    <div className="min-h-screen bg-gradient-to-b from-brown-600 to-brown-600 via-white bg-fixed">
      <div className="container mx-auto min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between cursor-pointer mb-4" onClick={togglePanel}>
            <h2 className="text-xl font-bold">{isAdminPanel ? "Opções de Administrador" : "Ranking de Usuários"}</h2>
            <div className="flex items-center">
              <span className="text-sm mr-2">Opções de Administrador</span>
              <ChevronRight className={`transform transition-transform ${isAdminPanel ? "rotate-90" : ""}`} />
            </div>
          </div>

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
                />

                <Button className="w-full">Votar</Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span>Liberar votação</span>
                <Switch checked={isVotingEnabled} onCheckedChange={setIsVotingEnabled} />
              </div>

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
                onChange={(e) => setAdminAmount(e.target.value)}
              />

              <Button className="w-full">Atualizar Moedas</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

