import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  hasApiKey,
  removeApiKey,
  setApiKey,
  validateApiKey,
} from "@/services/assemblyAiService";
import {
  AlertTriangle,
  CheckCircle,
  Key,
  Loader,
  Shield,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface ApiKeyFormProps {
  onKeySet: () => void;
  onKeyRemoved?: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeySet, onKeyRemoved }) => {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(!hasApiKey());
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    // Check if key exists and set editing mode accordingly
    setIsEditing(!hasApiKey());
  }, []);

  const validateAndSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma chave API válida.",
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const isValid = await validateApiKey(apiKey);
      setValidationResult(isValid);

      if (isValid) {
        setApiKey(apiKey);
        setApiKeyState(""); // Clear the input for security
        setIsEditing(false);
        toast({
          title: "Sucesso",
          description: "Chave API validada e salva com sucesso!",
        });
        onKeySet();
      } else {
        toast({
          variant: "destructive",
          title: "Chave API inválida",
          description:
            "A chave API fornecida não é válida ou não foi possível conectar com a AssemblyAI. Por favor, verifique a chave e tente novamente.",
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description:
          "Ocorreu um erro ao validar a chave API. Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    removeApiKey();
    setApiKeyState("");
    setIsEditing(true);
    setValidationResult(null);
    toast({
      title: "Chave removida",
      description: "Sua chave API foi removida.",
    });
    if (onKeyRemoved) {
      onKeyRemoved();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Chave API AssemblyAI
        </CardTitle>
        <CardDescription>
          Configure sua chave API da AssemblyAI para usar o serviço de
          transcrição.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Insira sua chave API da AssemblyAI"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKeyState(e.target.value);
                    setValidationResult(null);
                  }}
                  className={
                    validationResult !== null
                      ? validationResult
                        ? "pr-10 border-green-500 focus-visible:ring-green-500"
                        : "pr-10 border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  disabled={isValidating}
                />
                {validationResult !== null && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {validationResult ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Obtenha sua chave API em:{" "}
                <a
                  href="https://www.assemblyai.com/dashboard/signup"
                  className="text-brand-500 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  assemblyai.com
                </a>
              </p>
              {validationResult === false && (
                <p className="text-xs text-red-500 mt-1">
                  Chave API inválida. Por favor, verifique e tente novamente.
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Segurança da sua chave API:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Sua chave API é armazenada apenas no seu navegador
                    (localStorage)
                  </li>
                  <li>
                    Usamos encriptação básica para dificultar o acesso por
                    outros sites
                  </li>
                  <li>Sua chave nunca é enviada para nossos servidores</li>
                  <li>
                    Todas as chamadas para a AssemblyAI são feitas diretamente
                    do seu navegador
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={validateAndSaveKey}
              disabled={isValidating || !apiKey.trim()}
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" /> Validando...
                </>
              ) : (
                "Validar e Salvar Chave API"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative flex-1 mr-2">
                <Input
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="bg-gray-50"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center bg-gray-50 pl-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Atualizar
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover chave API?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso removerá sua chave API da AssemblyAI. Você precisará
                      inseri-la novamente para usar o serviço de transcrição.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="flex items-start">
              <div className="mr-2">
                <Shield className="w-4 h-4 text-green-500 mt-0.5" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium">
                  ✓ Chave API configurada e armazenada de forma segura
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Por segurança, a chave não é exibida. Você pode atualizá-la ou
                  removê-la a qualquer momento.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
