import { useState } from "react";
import { Plus, Bot, User, Trash2, TestTube, Download, Upload, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Token {
  id: string;
  name: string;
  type: 'bot' | 'user';
  username: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSeen: string;
  token: string;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [importText, setImportText] = useState("");
  const [showTokens, setShowTokens] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleAddToken = () => {
    if (!newToken.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un token valide",
        variant: "destructive",
      });
      return;
    }

    // Mock validation
    const isBot = newToken.startsWith('Bot ');
    const mockToken: Token = {
      id: Date.now().toString(),
      name: `Token_${Date.now()}`,
      type: isBot ? 'bot' : 'user',
      username: isBot ? 'MonBot' : 'MonUtilisateur',
      status: 'connected',
      lastSeen: 'À l\'instant',
      token: newToken
    };

    setTokens([...tokens, mockToken]);
    setNewToken("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Token ajouté",
      description: `Token ${mockToken.type} ajouté avec succès`,
    });
  };

  const handleImportTokens = () => {
    const lines = importText.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    let imported = 0;

    lines.forEach((line, index) => {
      const token = line.trim();
      if (token) {
        const isBot = token.startsWith('Bot ');
        const mockToken: Token = {
          id: `${Date.now()}_${index}`,
          name: `Import_${Date.now()}_${index}`,
          type: isBot ? 'bot' : 'user',
          username: isBot ? `Bot_${index}` : `User_${index}`,
          status: Math.random() > 0.2 ? 'connected' : 'error',
          lastSeen: 'À l\'instant',
          token
        };
        setTokens(prev => [...prev, mockToken]);
        imported++;
      }
    });

    setImportText("");
    setIsImportDialogOpen(false);
    
    toast({
      title: "Import terminé",
      description: `${imported} tokens importés avec succès`,
    });
  };

  const handleDeleteToken = (id: string) => {
    setTokens(tokens.filter(token => token.id !== id));
    toast({
      title: "Token supprimé",
      description: "Token supprimé avec succès",
    });
  };

  const toggleTokenVisibility = (id: string) => {
    setShowTokens(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskToken = (token: string) => {
    if (token.length <= 10) return token;
    return token.slice(0, 10) + '...' + token.slice(-10);
  };

  const getStatusBadge = (status: Token['status']) => {
    const variants = {
      connected: { variant: "default" as const, text: "Connecté", class: "bg-success text-success-foreground" },
      disconnected: { variant: "secondary" as const, text: "Déconnecté", class: "" },
      error: { variant: "destructive" as const, text: "Erreur", class: "" }
    };
    
    const config = variants[status];
    return (
      <Badge 
        variant={config.variant}
        className={config.class}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestion des Tokens
          </h1>
          <p className="text-muted-foreground">
            Gérez vos tokens Discord (bots et utilisateurs)
          </p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importer des tokens</DialogTitle>
                <DialogDescription>
                  Collez vos tokens (un par ligne). Les lignes commençant par # sont ignorées.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Bot MTEzNzk2NzM4OTk4NzYzNTIwMA.example.token&#10;MTEzNzk2NzM4OTk4NzYzNTIwMB.example.user-token"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={8}
                />
                <div className="flex gap-2">
                  <Button onClick={handleImportTokens} className="flex-1">
                    Importer
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="discord">
                <Plus className="h-4 w-4" />
                Ajouter Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un token</DialogTitle>
                <DialogDescription>
                  Entrez votre token Discord (bot ou utilisateur)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token">Token Discord</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="MTEzNzk2NzM4OTk4NzYzNTIwMA.example.token"
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddToken} className="flex-1">
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tokens.filter(t => t.status === 'connected').length}
                </p>
                <p className="text-sm text-muted-foreground">Tokens actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tokens.length}</p>
                <p className="text-sm text-muted-foreground">Total tokens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TestTube className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tokens.length > 0 ? Math.round((tokens.filter(t => t.status === 'connected').length / tokens.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Taux de succès</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tokens Table */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Liste des Tokens</CardTitle>
          <CardDescription>
            Tokens Discord configurés ({tokens.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun token configuré</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos tokens Discord pour utiliser le gestionnaire
              </p>
              <Button variant="discord" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Ajouter votre premier token
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {token.type === 'bot' ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-accent" />
                          )}
                          <span className="capitalize">{token.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{token.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showTokens[token.id] ? token.token : maskToken(token.token)}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleTokenVisibility(token.id)}
                          >
                            {showTokens[token.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(token.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{token.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline">
                            <TestTube className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteToken(token.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}