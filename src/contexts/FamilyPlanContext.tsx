
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  FamilyPlan,
  FamilyMember,
  UserSubscription,
  getFamilyPlan,
  getFamilyMembers,
  getUserSubscription
} from "@/services/familyService";

type FamilyPlanContextType = {
  familyPlan: FamilyPlan | null;
  members: FamilyMember[];
  subscription: UserSubscription | null;
  isOwner: boolean;
  isFamilyPlan: boolean;
  isLoading: boolean;
  refreshFamilyData: () => Promise<void>;
};

const FamilyPlanContext = createContext<FamilyPlanContextType | undefined>(undefined);

export const FamilyPlanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyPlan, setFamilyPlan] = useState<FamilyPlan | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = !!familyPlan && !!user && familyPlan.owner_id === user.id;
  const isFamilyPlan = subscription?.plan_type === "family";

  const loadFamilyData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Load subscription first to determine if user has family plan
      const userSubscription = await getUserSubscription();
      setSubscription(userSubscription);

      if (userSubscription?.plan_type === "family") {
        const plan = await getFamilyPlan();
        setFamilyPlan(plan);

        if (plan) {
          const familyMembers = await getFamilyMembers(plan.id);
          setMembers(familyMembers);
        }
      }
    } catch (error) {
      console.error("Error loading family data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do plano familiar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyData();
  }, [user]);

  const refreshFamilyData = async () => {
    await loadFamilyData();
  };

  const value = {
    familyPlan,
    members,
    subscription,
    isOwner,
    isFamilyPlan,
    isLoading,
    refreshFamilyData,
  };

  return (
    <FamilyPlanContext.Provider value={value}>
      {children}
    </FamilyPlanContext.Provider>
  );
};

export const useFamilyPlan = () => {
  const context = useContext(FamilyPlanContext);
  if (context === undefined) {
    throw new Error("useFamilyPlan must be used within a FamilyPlanProvider");
  }
  return context;
};
