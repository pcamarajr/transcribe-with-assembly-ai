
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasApiKey, getApiKey, setApiKey } from '@/services/assemblyAiService';
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";

interface ApiKeyFormProps {
  onKeySet: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeySet }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(!hasApiKey());
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with stored key if exists
    if (hasApiKey()) {
      setApiKeyState(getApiKey() || '');
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma chave API válida."
      });
      return;
    }

    setApiKey(apiKey);
    setIsEditing(false);
    toast({
      title: "Sucesso",
      description: "Chave API salva com sucesso!"
    });
    onKeySet();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Chave API AssemblyAI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Input 
                type="text" 
                placeholder="Insira sua chave API da AssemblyAI" 
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenha sua chave API em: <a href="https://www.assemblyai.com/dashboard/signup" className="text-brand-500 hover:underline" target="_blank" rel="noreferrer">assemblyai.com</a>
              </p>
            </div>
            <Button onClick={handleSave}>Salvar Chave API</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <Input 
                type="password" 
                value="••••••••••••••••••••••••••••••"
                disabled
                className="bg-gray-50 mr-2"
              />
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            </div>
            <p className="text-xs text-green-600">
              ✓ Chave API configurada
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
