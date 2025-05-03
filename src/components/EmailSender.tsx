
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EmailSenderProps {
  transcription: string;
  audioFileName: string;
}

const EmailSender: React.FC<EmailSenderProps> = ({ transcription, audioFileName }) => {
  const [recipient, setRecipient] = useState<string>('');
  const [subject, setSubject] = useState<string>(`Transcrição: ${audioFileName}`);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe o e-mail do destinatário"
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Por favor, informe um e-mail válido"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would be an API call to your backend
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail enviado com sucesso",
        description: `A transcrição foi enviada para ${recipient}`,
      });
      
      setRecipient('');
      setSubject(`Transcrição: ${audioFileName}`);
      setMessage('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: "Ocorreu um erro ao enviar o e-mail. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fullEmailBody = message ? `${message}\n\n--------\n\nTRANSCRIÇÃO:\n${transcription}` : transcription;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          <span>Enviar por E-mail</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Destinatário</Label>
            <Input 
              id="recipient" 
              placeholder="email@exemplo.com" 
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input 
              id="subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem adicional (opcional)</Label>
            <Input 
              id="message" 
              placeholder="Adicione um contexto ou mensagem..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Conteúdo a ser enviado</Label>
            <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 max-h-[150px] overflow-y-auto">
              <p className="whitespace-pre-wrap">{fullEmailBody}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>Enviando...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Enviar Transcrição
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailSender;
