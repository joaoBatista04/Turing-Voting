import Image from "next/image"
import { Button } from "@/components/ui/button"

interface StartPanelProps {
  onConnect: () => void
}

export function StartPanel({ onConnect }: StartPanelProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-32 w-full max-w-md flex flex-col items-center">
        <div className="mb-8">
          <Image src="/alan-turing.png?height=200&width=200" alt="Logo" width={200} height={200} />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 whitespace-nowrap">TURING VOTES</h1>
        <Button
          onClick={onConnect}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-8 px-48 rounded w-full"
        >
          Conectar
        </Button>
      </div>
    </div>
  )
}