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
import { useTranslation } from "react-i18next";

interface ApiKeyFormProps {
  onKeySet: () => void;
  onKeyRemoved?: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeySet, onKeyRemoved }) => {
  const { t } = useTranslation();
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
        title: t("apiKey.error"),
        description: t("apiKey.validationError"),
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
          title: t("apiKey.success"),
          description: t("apiKey.savedSuccess"),
        });
        onKeySet();
      } else {
        toast({
          variant: "destructive",
          title: t("apiKey.invalidKey"),
          description: t("apiKey.invalidKeyDescription"),
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      toast({
        variant: "destructive",
        title: t("apiKey.error"),
        description: t("apiKey.validationErrorGeneric"),
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
      title: t("apiKey.removed"),
      description: t("apiKey.removedDescription"),
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
          {t("apiKey.title")}
        </CardTitle>
        <CardDescription>{t("apiKey.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("apiKey.placeholder")}
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
                {t("apiKey.getKeyAt")}{" "}
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
                  {t("apiKey.invalidKey")}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-start">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">
                  {t("security.apiKeySecurity")}
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>{t("security.storedInBrowser")}</li>
                  <li>{t("security.basicEncryption")}</li>
                  <li>{t("security.neverSent")}</li>
                  <li>{t("security.directCalls")}</li>
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
                  <Loader className="w-4 h-4 mr-2 animate-spin" />{" "}
                  {t("apiKey.validating")}
                </>
              ) : (
                t("apiKey.save")
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
                {t("apiKey.update")}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <span className="sr-only">{t("apiKey.remove")}</span>
                    <Trash className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("apiKey.removeConfirm")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("apiKey.removeDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("apiKey.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {t("apiKey.removeAction")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <div className="flex items-center text-green-700 mb-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                <p className="text-sm font-medium">{t("apiKey.configured")}</p>
              </div>
              <p className="text-xs text-green-600">
                {t("apiKey.securityNote")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
