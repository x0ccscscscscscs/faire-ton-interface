import { Settings, Download, Upload, Trash2, RefreshCw, Database, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Tools() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action simulée",
      description: `${action} - Fonctionnalité en développement`,
    });
  };

  const tools = [
    {
      category: "Import/Export",
      items: [
        {
          title: "Exporter les tokens",
          description: "Sauvegardez vos tokens dans un fichier JSON sécurisé",
          icon: Download,
          action: "export-tokens",
          variant: "outline" as const
        },
        {
          title: "Importer les tokens",
          description: "Restaurez vos tokens depuis un fichier de sauvegarde",
          icon: Upload,
          action: "import-tokens",
          variant: "outline" as const
        },
        {
          title: "Exporter les IDs",
          description: "Téléchargez votre liste d'IDs cibles",
          icon: Download,
          action: "export-ids",
          variant: "outline" as const
        }
      ]
    },
    {
      category: "Maintenance",
      items: [
        {
          title: "Nettoyer les données",
          description: "Supprimez les données obsolètes et les doublons",
          icon: Trash2,
          action: "cleanup",
          variant: "outline" as const
        },
        {
          title: "Tester tous les tokens",
          description: "Vérifiez la validité de tous vos tokens Discord",
          icon: RefreshCw,
          action: "test-tokens",
          variant: "discord" as const
        },
        {
          title: "Réinitialiser l'application",
          description: "Supprimez toutes les données et recommencez",
          icon: Database,
          action: "reset",
          variant: "destructive" as const
        }
      ]
    },
    {
      category: "Sécurité",
      items: [
        {
          title: "Chiffrer les tokens",
          description: "Activez le chiffrement des tokens stockés",
          icon: Shield,
          action: "encrypt",
          variant: "outline" as const
        },
        {
          title: "Audit de sécurité",
          description: "Analysez la sécurité de votre configuration",
          icon: Shield,
          action: "audit",
          variant: "outline" as const
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Outils & Utilitaires
        </h1>
        <p className="text-muted-foreground">
          Outils de maintenance, import/export et configuration avancée
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0 MB</p>
                <p className="text-sm text-muted-foreground">Données stockées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Sécurisé</p>
                <p className="text-sm text-muted-foreground">État sécurité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Santé système</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Categories */}
      {tools.map((category) => (
        <Card key={category.category} className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {category.category}
            </CardTitle>
            <CardDescription>
              Outils de {category.category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((tool) => (
                <Card key={tool.action} className="bg-muted/30 border-border hover:bg-muted/50 transition-smooth">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{tool.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                      
                      <Button 
                        variant={tool.variant}
                        className="w-full"
                        onClick={() => handleAction(tool.title)}
                      >
                        {tool.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Configuration Files */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Fichiers de Configuration</CardTitle>
          <CardDescription>
            Créez et gérez les fichiers d'exemple et de configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">tokens_list.txt</h4>
                  <Badge variant="secondary">Exemple</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Fichier d'exemple pour l'import de tokens en lot
                </p>
                <Button variant="outline" size="sm" onClick={() => handleAction("Créer tokens_list.txt")}>
                  Créer fichier exemple
                </Button>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">ids_to_import.txt</h4>
                  <Badge variant="secondary">Exemple</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Fichier d'exemple pour l'import d'IDs cibles
                </p>
                <Button variant="outline" size="sm" onClick={() => handleAction("Créer ids_to_import.txt")}>
                  Créer fichier exemple
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Sécurité des fichiers</h4>
                  <p className="text-sm text-muted-foreground">
                    Les fichiers de tokens contiennent des informations sensibles. 
                    Assurez-vous de les stocker en sécurité et de ne jamais les partager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backend Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Fonctionnalités Backend</h3>
              <p className="text-sm text-muted-foreground">
                Pour utiliser pleinement ces outils (sauvegarde, chiffrement, API Discord), 
                connectez votre projet à Supabase pour activer les fonctionnalités backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}