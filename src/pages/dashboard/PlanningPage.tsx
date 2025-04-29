
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import AddGoalDialog from "@/components/dashboard/AddGoalDialog";
import GoalsTab from "@/components/dashboard/planning/GoalsTab";
import SavingsTab from "@/components/dashboard/planning/SavingsTab";
import InvestmentsTab from "@/components/dashboard/planning/InvestmentsTab";

const PlanningPage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planejamento Financeiro</h1>
        <AddGoalDialog 
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          }
          onAddGoal={(goal) => console.log("Goal added:", goal)}
        />
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="goals">Metas Financeiras</TabsTrigger>
          <TabsTrigger value="savings">Poupança</TabsTrigger>
          <TabsTrigger value="investments">Investimentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals">
          <GoalsTab />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsTab />
        </TabsContent>
        
        <TabsContent value="investments">
          <InvestmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningPage;
