import { useState } from "react";
import { Plus, Users, Upload, Download, Trash2, Search, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Target {
  id: string;
  username?: string;
  addedAt: string;
  status: 'active' | 'invalid' | 'unreachable';
}

export default function Targets() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newTargetIds, setNewTargetIds] = useState("");
  const [importText, setImportText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleAddTargets = () => {
    const ids = newTargetIds.split(/[\n,\s]+/).filter(id => id.trim());
    let added = 0;

    ids.forEach(id => {
      const cleanId = id.trim();
      if (cleanId && /^\d{17,19}$/.test(cleanId)) {
        const exists = targets.some(target => target.id === cleanId);
        if (!exists) {
          const newTarget: Target = {
            id: cleanId,
            username: `User_${cleanId.slice(-4)}`,
            addedAt: new Date().toLocaleString(),
            status: Math.random() > 0.1 ? 'active' : 'invalid'
          };
          setTargets(prev => [...prev, newTarget]);
          added++;
        }
      }
    });

    setNewTargetIds("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "IDs ajoutés",
      description: `${added} IDs valides ajoutés (${ids.length - added} ignorés/doublons)`,
    });
  };

  const handleImportTargets = () => {
    const lines = importText.split('\n');
    const allIds: string[] = [];

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine && !cleanLine.startsWith('#')) {
        // Support multiple IDs per line
        const ids = cleanLine.split(/[\s,]+/).filter(id => id.trim());
        allIds.push(...ids);
      }
    });

    let imported = 0;
    allIds.forEach(id => {
      const cleanId = id.trim();
      if (cleanId && /^\d{17,19}$/.test(cleanId)) {
        const exists = targets.some(target => target.id === cleanId);
        if (!exists) {
          const newTarget: Target = {
            id: cleanId,
            username: `Imported_${cleanId.slice(-4)}`,
            addedAt: new Date().toLocaleString(),
            status: Math.random() > 0.1 ? 'active' : 'invalid'
          };
          setTargets(prev => [...prev, newTarget]);
          imported++;
        }
      }
    });

    setImportText("");
    setIsImportDialogOpen(false);
    
    toast({
      title: "Import terminé",
      description: `${imported} IDs importés avec succès`,
    });
  };

  const handleDeleteTarget = (id: string) => {
    setTargets(targets.filter(target => target.id !== id));
    toast({
      title: "ID supprimé",
      description: "ID cible supprimé avec succès",
    });
  };

  const handleDeleteAll = () => {
    setTargets([]);
    toast({
      title: "Tous les IDs supprimés",
      description: "Liste des IDs cibles vidée",
    });
  };

  const filteredTargets = targets.filter(target => 
    target.id.includes(searchTerm) || 
    target.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Target['status']) => {
    const colors = {
      active: "bg-success text-success-foreground",
      invalid: "bg-destructive text-destructive-foreground", 
      unreachable: "bg-warning text-warning-foreground"
    };
    
    const labels = {
      active: "Actif",
      invalid: "Invalide",
      unreachable: "Inatteignable"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IDs Cibles
          </h1>
          <p className="text-muted-foreground">
            Gérez votre liste d'utilisateurs Discord cibles
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Importer des IDs cibles</DialogTitle>
                <DialogDescription>
                  Collez vos IDs Discord (17-19 chiffres). Formats supportés : un par ligne, séparés par des espaces ou virgules.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Exemples de formats acceptés :</h4>
                  <code className="text-sm text-muted-foreground">
                    123456789012345678<br/>
                    987654321098765432 456789123456789012<br/>
                    111222333444555666, 777888999000111222
                  </code>
                </div>
                <Textarea
                  placeholder="123456789012345678&#10;987654321098765432 456789123456789012&#10;# Commentaire ignoré&#10;777888999000111222, 333444555666777888"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={10}
                />
                <div className="flex gap-2">
                  <Button onClick={handleImportTargets} className="flex-1">
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
                Ajouter IDs
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter des IDs cibles</DialogTitle>
                <DialogDescription>
                  Entrez les IDs Discord (un par ligne ou séparés par des espaces/virgules)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ids">IDs Discord</Label>
                  <Textarea
                    id="ids"
                    placeholder="123456789012345678&#10;987654321098765432&#10;456789123456789012"
                    value={newTargetIds}
                    onChange={(e) => setNewTargetIds(e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTargets} className="flex-1">
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{targets.length}</p>
                <p className="text-sm text-muted-foreground">Total IDs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {targets.filter(t => t.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {targets.filter(t => t.status === 'invalid').length}
                </p>
                <p className="text-sm text-muted-foreground">Invalides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {targets.length > 0 ? Math.round((targets.filter(t => t.status === 'active').length / targets.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Taux validité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des IDs Cibles</CardTitle>
              <CardDescription>
                IDs Discord configurés ({filteredTargets.length}/{targets.length})
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              {targets.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                  <Trash2 className="h-4 w-4" />
                  Vider
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID ou nom d'utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {targets.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun ID configuré</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter des IDs Discord pour cibler vos utilisateurs
                </p>
                <Button variant="discord" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Ajouter vos premiers IDs
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Discord</TableHead>
                      <TableHead>Nom d'utilisateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Ajouté le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTargets.map((target) => (
                      <TableRow key={target.id}>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {target.id}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium">
                          {target.username || 'Inconnu'}
                        </TableCell>
                        <TableCell>{getStatusBadge(target.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{target.addedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteTarget(target.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}