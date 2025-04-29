
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFamilyPlan } from "@/contexts/FamilyPlanContext";
import { 
  inviteFamilyMember, 
  removeFamilyMember,
  updateFamilyPlan,
  createInvitationLink
} from "@/services/familyService";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Copy, UserMinus, Edit } from "lucide-react";

const FamilyMembersPage: React.FC = () => {
  const { familyPlan, members, isOwner, isLoading, refreshFamilyData } = useFamilyPlan();
  const { toast } = useToast();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState(familyPlan?.name || "Minha Família");

  // Handle new member invitation
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!familyPlan || !newMemberEmail) return;
    
    setIsSubmitting(true);
    try {
      await inviteFamilyMember(newMemberEmail, familyPlan.id);
      toast({
        title: "Convite enviado",
        description: `Um convite foi enviado para ${newMemberEmail}`,
      });
      setNewMemberEmail("");
      refreshFamilyData();
    } catch (error) {
      toast({
        title: "Erro ao enviar convite",
        description: "Não foi possível enviar o convite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate invitation link
  const handleGenerateLink = () => {
    if (!familyPlan) return;
    
    const link = createInvitationLink(familyPlan.id);
    setInviteLink(link);
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Link copiado",
        description: "Link de convite copiado para a área de transferência",
      });
    }
  };

  // Remove family member
  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeFamilyMember(memberId);
      toast({
        title: "Membro removido",
        description: "O membro foi removido do plano familiar",
      });
      refreshFamilyData();
    } catch (error) {
      toast({
        title: "Erro ao remover membro",
        description: "Não foi possível remover o membro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Update family plan name
  const handleUpdateFamilyName = async () => {
    if (!familyPlan || !newFamilyName) return;
    
    try {
      await updateFamilyPlan(familyPlan.id, { name: newFamilyName });
      toast({
        title: "Nome atualizado",
        description: "O nome do plano familiar foi atualizado",
      });
      setEditingName(false);
      refreshFamilyData();
    } catch (error) {
      toast({
        title: "Erro ao atualizar nome",
        description: "Não foi possível atualizar o nome. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-finance-primary" />
      </div>
    );
  }

  if (!familyPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Users className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Plano Familiar não encontrado</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Você não tem um plano familiar ativo. Faça upgrade para o plano familiar para gerenciar membros da família.
        </p>
        <Button className="bg-finance-primary hover:bg-finance-primary/90">
          <a href="https://pay.cakto.com.br/4j2tn5j_365603" target="_blank" rel="noopener noreferrer">
            Fazer upgrade para Plano Familiar
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleUpdateFamilyName}>Salvar</Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setEditingName(false);
                    setNewFamilyName(familyPlan.name);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{familyPlan.name}</span>
                {isOwner && (
                  <Button 
                    size="icon"  
                    variant="ghost" 
                    onClick={() => setEditingName(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </CardTitle>
          <Users className="h-5 w-5 text-finance-primary" />
        </CardHeader>
        <CardContent>
          {/* Members List */}
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Membros ({members.length}/{familyPlan.max_members})</h3>
            
            {members.length > 0 ? (
              <div className="space-y-2">
                {members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{member.user?.nome || "Usuário"}</p>
                      <p className="text-sm text-gray-500">{member.user?.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                        {member.role === "owner" ? "Administrador" : "Membro"}
                      </span>
                      
                      {isOwner && member.role !== "owner" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover membro</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este membro do seu plano familiar?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-2">Nenhum membro encontrado.</p>
            )}
          </div>

          {/* Invite Members Section */}
          {isOwner && members.length < familyPlan.max_members && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Convidar novo membro</h3>
              
              <form onSubmit={handleInviteMember} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email do convidado"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newMemberEmail}
                  className="bg-finance-primary hover:bg-finance-primary/90"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Convidar"}
                </Button>
              </form>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Ou gere um link de convite:</h4>
                <div className="flex gap-2">
                  {!inviteLink ? (
                    <Button 
                      onClick={handleGenerateLink}
                      variant="outline" 
                      className="flex-1"
                    >
                      Gerar link de convite
                    </Button>
                  ) : (
                    <>
                      <Input value={inviteLink} readOnly className="flex-1" />
                      <Button onClick={handleCopyLink} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {isOwner && members.length >= familyPlan.max_members && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
              <p>Você atingiu o limite máximo de 5 membros para o plano familiar.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Family Settings - could be expanded in future */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Plano Familiar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Como administrador, você pode gerenciar permissões e configurações adicionais para os membros da sua família.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Compartilhamento de despesas</span>
                <span className="text-green-600">Ativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Permissões de edição</span>
                <span className="text-green-600">Ativas</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Notificações compartilhadas</span>
                <span className="text-green-600">Ativas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyMembersPage;
